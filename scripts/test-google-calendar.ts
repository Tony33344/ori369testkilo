/**
 * Test script for Google Calendar API integration
 * Run with: npx ts-node scripts/test-google-calendar.ts
 * Or: npx tsx scripts/test-google-calendar.ts
 */

import { google } from 'googleapis';
import * as fs from 'fs';
import * as path from 'path';

// Paths to check for credentials
const CREDENTIAL_PATHS = [
  path.join(process.cwd(), 'google-calendar-credentials.json'),
  path.join(process.cwd(), 'credentials', 'ori369-calendar-96684c4cecbe.json'),
  path.join(process.cwd(), 'credentials', 'google-calendar.json'),
  path.join(process.cwd(), 'ori369-calendar-96684c4cecbe.json'),
];

function findCredentials() {
  // Check environment variable first
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8');
      return JSON.parse(decoded);
    } catch {
      try {
        return JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
      } catch {
        console.error('❌ Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY');
      }
    }
  }

  // Check file paths
  for (const filePath of CREDENTIAL_PATHS) {
    if (fs.existsSync(filePath)) {
      console.log(`✅ Found credentials at: ${filePath}`);
      return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
  }

  // Check credentials directory for any JSON with service account keys
  const credDir = path.join(process.cwd(), 'credentials');
  if (fs.existsSync(credDir)) {
    const files = fs.readdirSync(credDir).filter(f => f.endsWith('.json'));
    for (const file of files) {
      const filePath = path.join(credDir, file);
      try {
        const content = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        if (content.client_email && content.private_key) {
          console.log(`✅ Found service account credentials at: ${filePath}`);
          return content;
        }
      } catch {}
    }
  }

  return null;
}

async function testCalendarConnection() {
  console.log('\n🔍 Testing Google Calendar API Connection...\n');
  console.log('='.repeat(50));

  // Step 1: Find credentials
  console.log('\n📁 Step 1: Looking for credentials...');
  const credentials = findCredentials();
  
  if (!credentials) {
    console.error('❌ No credentials found!');
    console.log('\nPlease ensure you have one of:');
    console.log('  1. GOOGLE_SERVICE_ACCOUNT_KEY environment variable set');
    console.log('  2. google-calendar-credentials.json in project root');
    console.log('  3. credentials/ori369-calendar-96684c4cecbe.json');
    process.exit(1);
  }

  console.log(`✅ Service Account Email: ${credentials.client_email}`);
  console.log(`✅ Project ID: ${credentials.project_id}`);

  // Step 2: Create auth client
  console.log('\n🔐 Step 2: Creating JWT auth client...');
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  // Step 3: Create calendar client
  console.log('\n📅 Step 3: Creating Calendar client...');
  const calendar = google.calendar({ version: 'v3', auth });

  // Step 4: Get calendar ID
  const calendarId = process.env.GOOGLE_CALENDAR_ID || credentials.client_email;
  console.log(`\n🎯 Using Calendar ID: ${calendarId}`);

  // Step 5: Test listing events
  console.log('\n📋 Step 4: Testing event listing...');
  try {
    const now = new Date();
    const oneWeekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
    
    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      timeMax: oneWeekLater.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    const events = response.data.items || [];
    console.log(`✅ Successfully connected! Found ${events.length} events in next 7 days.`);
    
    if (events.length > 0) {
      console.log('\n📌 Upcoming events:');
      events.slice(0, 5).forEach((event, i) => {
        const start = event.start?.dateTime || event.start?.date;
        console.log(`   ${i + 1}. ${event.summary} - ${start}`);
      });
    }
  } catch (error: any) {
    console.error('❌ Failed to list events:', error.message);
    
    if (error.message.includes('Not Found')) {
      console.log('\n💡 The calendar might not exist or the service account doesn\'t have access.');
      console.log('   Make sure to share your Google Calendar with:', credentials.client_email);
    }
    
    if (error.message.includes('forbidden') || error.message.includes('403')) {
      console.log('\n💡 Permission denied. Please:');
      console.log('   1. Go to Google Calendar settings');
      console.log('   2. Share the calendar with:', credentials.client_email);
      console.log('   3. Give "Make changes to events" permission');
    }
    
    process.exit(1);
  }

  // Step 6: Test creating a test event
  console.log('\n✏️ Step 5: Testing event creation...');
  try {
    const testEvent = {
      summary: 'ORI 369 - Test Event (DELETE ME)',
      description: 'This is a test event created by the test script. Please delete.',
      start: {
        dateTime: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        timeZone: 'Europe/Ljubljana',
      },
      end: {
        dateTime: new Date(Date.now() + 25 * 60 * 60 * 1000).toISOString(),
        timeZone: 'Europe/Ljubljana',
      },
    };

    const createResponse = await calendar.events.insert({
      calendarId,
      requestBody: testEvent,
    });

    console.log(`✅ Test event created! ID: ${createResponse.data.id}`);
    
    // Delete the test event
    console.log('\n🗑️ Step 6: Cleaning up test event...');
    await calendar.events.delete({
      calendarId,
      eventId: createResponse.data.id!,
    });
    console.log('✅ Test event deleted successfully!');
    
  } catch (error: any) {
    console.error('❌ Failed to create/delete test event:', error.message);
    
    if (error.message.includes('forbidden') || error.message.includes('403')) {
      console.log('\n💡 Write permission denied. The service account can read but not write.');
      console.log('   Please give "Make changes to events" permission to:', credentials.client_email);
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('✅ Google Calendar API test completed!');
  console.log('='.repeat(50) + '\n');
}

// Run the test
testCalendarConnection().catch(console.error);
