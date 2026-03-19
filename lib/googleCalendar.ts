import { google } from 'googleapis';
import path from 'path';
import fs from 'fs';
import { fromZonedTime } from 'date-fns-tz';

// Service account credentials - can be from file or environment variable
const SERVICE_ACCOUNT_KEY_PATH = path.join(process.cwd(), 'google-calendar-credentials.json');
const BUSINESS_TIMEZONE = 'Europe/Vienna';

// Calendar ID - the service account needs to be invited to this calendar with write permissions
// For service accounts, use the calendar ID (e.g., primary or the calendar's email address)
const CALENDAR_ID = process.env.GOOGLE_CALENDAR_ID || 'ori369-koledar@ori369-calendar.iam.gserviceaccount.com';

interface CalendarEventData {
  bookingId: string;
  date: string;
  time: string;
  serviceName: string;
  duration: number;
  clientName: string;
  clientEmail: string;
  clientPhone?: string;
  notes?: string;
}

/**
 * Get service account credentials from file or environment variable
 */
function getServiceAccountCredentials() {
  // PRIORITY 1: Try split environment variables (client_email + private_key)
  // This is the recommended approach for Netlify to avoid 4KB env limit
  if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
    console.log('[Google Calendar] Loaded credentials from GOOGLE_SERVICE_ACCOUNT_EMAIL + GOOGLE_PRIVATE_KEY');
    return {
      type: 'service_account',
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    };
  }

  // PRIORITY 2: Try full JSON in environment variable (base64 encoded or plain)
  if (process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
    try {
      const decoded = Buffer.from(process.env.GOOGLE_SERVICE_ACCOUNT_KEY, 'base64').toString('utf8');
      const parsed = JSON.parse(decoded);
      console.log('[Google Calendar] Loaded credentials from GOOGLE_SERVICE_ACCOUNT_KEY (base64)');
      return parsed;
    } catch (e) {
      // Try parsing as plain JSON
      try {
        const parsed = JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY);
        console.log('[Google Calendar] Loaded credentials from GOOGLE_SERVICE_ACCOUNT_KEY (plain JSON)');
        return parsed;
      } catch (err) {
        console.error('[Google Calendar] Failed to parse GOOGLE_SERVICE_ACCOUNT_KEY:', err instanceof Error ? err.message : err);
      }
    }
  }

  // Then try file
  if (fs.existsSync(SERVICE_ACCOUNT_KEY_PATH)) {
    return JSON.parse(fs.readFileSync(SERVICE_ACCOUNT_KEY_PATH, 'utf8'));
  }

  // Check for alternate file names
  const altPaths = [
    path.join(process.cwd(), 'ori369-calendar-96684c4cecbe.json'),
    path.join(process.cwd(), 'credentials', 'ori369-calendar-96684c4cecbe.json'),
    path.join(process.cwd(), 'credentials', 'google-calendar.json'),
    path.join(process.cwd(), 'credentials', 'google-calendar-credentials.json'),
    path.join(process.cwd(), 'service-account.json'),
  ];

  for (const altPath of altPaths) {
    if (fs.existsSync(altPath)) {
      return JSON.parse(fs.readFileSync(altPath, 'utf8'));
    }
  }

  // Finally, try to find *any* json file in a ./credentials folder
  try {
    const credentialsDir = path.join(process.cwd(), 'credentials');
    if (fs.existsSync(credentialsDir) && fs.statSync(credentialsDir).isDirectory()) {
      const jsonFiles = fs
        .readdirSync(credentialsDir)
        .filter((name) => name.toLowerCase().endsWith('.json'))
        .map((name) => path.join(credentialsDir, name));

      for (const filePath of jsonFiles) {
        try {
          const parsed = JSON.parse(fs.readFileSync(filePath, 'utf8'));
          if (parsed?.client_email && parsed?.private_key) {
            return parsed;
          }
        } catch {
          // ignore non-json / invalid json
        }
      }
    }
  } catch {
    // ignore directory read issues
  }

  return null;
}

/**
 * Get authenticated Google Calendar client using service account
 */
export async function getCalendarClient() {
  const credentials = getServiceAccountCredentials();
  
  if (!credentials) {
    throw new Error(
      'Google Calendar credentials not found. Please either:\n' +
      '1. Set GOOGLE_SERVICE_ACCOUNT_KEY environment variable (base64 encoded JSON), or\n' +
      '2. Place google-calendar-credentials.json file in project root'
    );
  }

  // Create JWT auth client
  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
  });

  // Create calendar client
  const calendar = google.calendar({ version: 'v3', auth });

  return calendar;
}

/**
 * Create a calendar event for a booking
 */
export async function createCalendarEvent(data: CalendarEventData) {
  const calendar = await getCalendarClient();

  // Parse date and time
  const [hours, minutes] = data.time.split(':');
  const startDateTimeUTC = fromZonedTime(
    `${data.date}T${parseInt(hours).toString().padStart(2, '0')}:${parseInt(minutes).toString().padStart(2, '0')}:00`,
    BUSINESS_TIMEZONE
  );

  const endDateTimeUTC = new Date(startDateTimeUTC);
  endDateTimeUTC.setMinutes(endDateTimeUTC.getMinutes() + data.duration);

  // Build description
  let description = `Klient: ${data.clientName}\nEmail: ${data.clientEmail}`;
  if (data.clientPhone) {
    description += `\nTelefon: ${data.clientPhone}`;
  }
  if (data.notes) {
    description += `\n\nOpombe: ${data.notes}`;
  }
  description += `\n\nID rezervacije: ${data.bookingId}`;

  // Create event object
  const event = {
    summary: `ORI 369 - ${data.serviceName}`,
    description,
    start: {
      dateTime: startDateTimeUTC.toISOString(),
      timeZone: BUSINESS_TIMEZONE,
    },
    end: {
      dateTime: endDateTimeUTC.toISOString(),
      timeZone: BUSINESS_TIMEZONE,
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'email', minutes: 24 * 60 }, // 24 hours before
        { method: 'popup', minutes: 60 }, // 1 hour before
      ],
    },
    colorId: '7', // Turquoise color to match ORI 369 branding
  };

  // Insert event
  const response = await calendar.events.insert({
    calendarId: CALENDAR_ID,
    requestBody: event,
  });

  return {
    eventId: response.data.id,
    eventLink: response.data.htmlLink,
  };
}

/**
 * Update an existing calendar event
 */
export async function updateCalendarEvent(eventId: string, data: Partial<CalendarEventData>) {
  const calendar = await getCalendarClient();

  const updateData: any = {};

  if (data.serviceName) {
    updateData.summary = `ORI 369 - ${data.serviceName}`;
  }

  if (data.date && data.time && data.duration) {
    const [hours, minutes] = data.time.split(':');
    const startDateTimeUTC = fromZonedTime(
      `${data.date}T${parseInt(hours).toString().padStart(2, '0')}:${parseInt(minutes).toString().padStart(2, '0')}:00`,
      BUSINESS_TIMEZONE
    );

    const endDateTimeUTC = new Date(startDateTimeUTC);
    endDateTimeUTC.setMinutes(endDateTimeUTC.getMinutes() + data.duration);

    updateData.start = {
      dateTime: startDateTimeUTC.toISOString(),
      timeZone: BUSINESS_TIMEZONE,
    };
    updateData.end = {
      dateTime: endDateTimeUTC.toISOString(),
      timeZone: BUSINESS_TIMEZONE,
    };
  }

  const response = await calendar.events.patch({
    calendarId: CALENDAR_ID,
    eventId,
    requestBody: updateData,
  });

  return {
    eventId: response.data.id,
    eventLink: response.data.htmlLink,
  };
}

/**
 * Delete a calendar event
 */
export async function deleteCalendarEvent(eventId: string) {
  const calendar = await getCalendarClient();

  await calendar.events.delete({
    calendarId: CALENDAR_ID,
    eventId,
  });

  return { success: true };
}

/**
 * List upcoming events
 */
export async function listUpcomingEvents(maxResults: number = 10) {
  const calendar = await getCalendarClient();

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin: new Date().toISOString(),
    maxResults,
    singleEvents: true,
    orderBy: 'startTime',
  });

  return response.data.items || [];
}

export async function listEventsInRange(timeMin: string, timeMax: string) {
  const calendar = await getCalendarClient();

  const response = await calendar.events.list({
    calendarId: CALENDAR_ID,
    timeMin,
    timeMax,
    singleEvents: true,
    orderBy: 'startTime',
    maxResults: 2500,
  });

  return response.data.items || [];
}
