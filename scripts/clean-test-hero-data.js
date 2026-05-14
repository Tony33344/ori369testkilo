#!/usr/bin/env node
/**
 * Clean "Test update at ..." text from the CMS hero block_translations.
 * 
 * Usage: node scripts/clean-test-hero-data.js
 * 
 * Requires: NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceKey);

async function main() {
  console.log('🔍 Searching for block_translations containing "Test update"...');

  // Find all block_translations with "Test update" in their content
  const { data: translations, error } = await supabase
    .from('block_translations')
    .select('id, block_id, lang, content');

  if (error) {
    console.error('Error fetching translations:', error.message);
    process.exit(1);
  }

  const affected = (translations || []).filter((t) => {
    const contentStr = JSON.stringify(t.content || {});
    return contentStr.includes('Test update');
  });

  if (affected.length === 0) {
    console.log('✅ No block_translations found with "Test update" text. Already clean!');
    return;
  }

  console.log(`Found ${affected.length} affected translation(s):`);

  for (const t of affected) {
    console.log(`  - ID: ${t.id}, Block: ${t.block_id}, Lang: ${t.lang}`);
    console.log(`    Content: ${JSON.stringify(t.content).substring(0, 200)}...`);

    // Clean the content by removing the test HTML
    const content = { ...t.content };
    if (content.html && typeof content.html === 'string') {
      // Remove <p>Test update at ...</p> patterns
      content.html = content.html.replace(/<p>Test update at [^<]*<\/p>/g, '').trim();
      if (!content.html) {
        // If the entire content was just the test, set something minimal
        content.html = '';
      }
    }
    if (content.text && typeof content.text === 'string') {
      content.text = content.text.replace(/Test update at [^\n]*/g, '').trim();
    }

    const { error: updateError } = await supabase
      .from('block_translations')
      .update({ content })
      .eq('id', t.id);

    if (updateError) {
      console.error(`  ❌ Failed to clean translation ${t.id}:`, updateError.message);
    } else {
      console.log(`  ✅ Cleaned translation ${t.id}`);
    }
  }

  console.log('\n🎉 Done! The "Test update" text has been removed from the CMS.');
}

main().catch(console.error);
