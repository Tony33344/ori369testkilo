import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

export const runtime = 'nodejs';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST() {
  if (!supabaseServiceKey) {
    return NextResponse.json({ error: 'Service role key not configured' }, { status: 500 });
  }

  const supabase = createClient(supabaseUrl, supabaseServiceKey, {
    db: { schema: 'public' }
  });

  const results: string[] = [];

  try {
    // Add columns to services table using raw SQL through RPC or direct insert
    // Since we can't run ALTER TABLE directly, we'll check if columns exist
    
    // Test if long_description column exists
    const { error: testError } = await supabase
      .from('services')
      .select('long_description')
      .limit(1);

    if (testError && testError.message.includes('long_description')) {
      results.push('⚠️ Services table needs schema updates - please run migration SQL in Supabase dashboard');
    } else {
      results.push('✅ Services table schema is up to date');
    }

    // Check/create team_members - try to select from it
    const { error: teamError } = await supabase
      .from('team_members')
      .select('id')
      .limit(1);

    if (teamError) {
      results.push(`⚠️ team_members table: ${teamError.message}`);
    } else {
      results.push('✅ team_members table exists');
    }

    // Check/create therapy_packages
    const { error: pkgError } = await supabase
      .from('therapy_packages')
      .select('id')
      .limit(1);

    if (pkgError) {
      results.push(`⚠️ therapy_packages table: ${pkgError.message}`);
    } else {
      results.push('✅ therapy_packages table exists');
    }

    return NextResponse.json({ 
      success: true, 
      results,
      message: 'Migration check complete. If tables are missing, please run the SQL migration in Supabase Dashboard SQL Editor.'
    });

  } catch (error) {
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Unknown error',
      results 
    }, { status: 500 });
  }
}
