/**
 * Run migration directly via Supabase client
 * Run with: npx tsx scripts/run-migration.ts
 */

import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseKey) {
  console.error('❌ SUPABASE_SERVICE_ROLE_KEY not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  db: { schema: 'public' }
});

async function runMigration() {
  console.log('🔄 Running database migration...\n');

  // Test connection by checking services table
  const { data: services, error: testError } = await supabase
    .from('services')
    .select('id, name, slug')
    .limit(3);

  if (testError) {
    console.error('❌ Connection test failed:', testError.message);
    return;
  }

  console.log(`✅ Connected to Supabase. Found ${services?.length || 0} services.`);

  // Check if columns already exist by trying to select them
  const { error: checkError } = await supabase
    .from('services')
    .select('long_description')
    .limit(1);

  if (!checkError) {
    console.log('✅ Extended columns already exist in services table.');
  } else {
    console.log('⚠️ Extended columns may need to be added manually via Supabase dashboard.');
    console.log('   Please run the following SQL in your Supabase SQL Editor:');
    console.log(`
-- Add extended description fields to services table
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS long_description TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS benefits TEXT[];
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS indications TEXT[];
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS contraindications TEXT[];
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS how_it_works TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS image_url TEXT;
ALTER TABLE public.services ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'therapy';
    `);
  }

  // Check if team_members table exists
  const { error: teamError } = await supabase
    .from('team_members')
    .select('id')
    .limit(1);

  if (!teamError) {
    console.log('✅ team_members table already exists.');
  } else {
    console.log('⚠️ team_members table needs to be created via Supabase dashboard.');
  }

  // Check if therapy_packages table exists
  const { error: pkgError } = await supabase
    .from('therapy_packages')
    .select('id')
    .limit(1);

  if (!pkgError) {
    console.log('✅ therapy_packages table already exists.');
  } else {
    console.log('⚠️ therapy_packages table needs to be created via Supabase dashboard.');
  }

  console.log('\n✅ Migration check complete!');
}

runMigration().catch(console.error);
