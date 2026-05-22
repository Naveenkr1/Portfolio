require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.GATSBY_SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY
);

async function cleanup() {
  // Delete the old hero row that was being pulled by the frontend instead of the new one
  const { error } = await supabase.from('hero').delete().eq('id', '12868d01-f7bc-45c2-8bce-d6de62b08503');
  if (error) {
    console.error('Failed to delete old hero row:', error);
  } else {
    console.log('Successfully deleted old hero row. Only the updated one remains!');
  }
}
cleanup();
