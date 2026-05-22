require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.GATSBY_SUPABASE_URL || process.env.SUPABASE_URL,
  process.env.GATSBY_SUPABASE_KEY || process.env.SUPABASE_SERVICE_KEY
);

async function check() {
  const { data: hero } = await supabase.from('hero').select('*');
  console.log('Hero:', hero);
  
  const { data: about } = await supabase.from('about').select('*');
  console.log('About:', about);
}
check();
