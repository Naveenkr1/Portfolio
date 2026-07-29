require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const bcrypt = require('bcryptjs');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL or SUPABASE_SERVICE_KEY is missing in .env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function resetPassword() {
  const newPassword = process.argv[2];
  if (!newPassword) {
    console.log('Usage: node reset-admin-password.js <new_password>');
    process.exit(1);
  }

  try {
    console.log('Hashing new password...');
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    console.log('Updating admin password in Supabase...');
    
    // Check if admin user exists first
    const { data: existingAdmin, error: fetchError } = await supabase
      .from('admin')
      .select('*')
      .eq('username', 'admin')
      .maybeSingle();

    if (fetchError) {
      throw fetchError;
    }

    if (existingAdmin) {
      const { error: updateError } = await supabase
        .from('admin')
        .update({ password: hashedPassword })
        .eq('username', 'admin');
        
      if (updateError) throw updateError;
      console.log(`Successfully updated password for 'admin' to: "${newPassword}"`);
    } else {
      const { error: insertError } = await supabase
        .from('admin')
        .insert([{ username: 'admin', password: hashedPassword }]);
        
      if (insertError) throw insertError;
      console.log(`Successfully created 'admin' user with password: "${newPassword}"`);
    }
  } catch (err) {
    console.error('Error updating password:', err.message);
  }
}

resetPassword();
