require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const url = process.env.SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const anonKey = process.env.SUPABASE_ANON_KEY;

console.log('SUPABASE_URL:', url);
console.log('ANON_KEY starts with:', anonKey ? anonKey.substring(0, 30) + '...' : 'MISSING');
console.log('SERVICE_KEY starts with:', serviceKey ? serviceKey.substring(0, 30) + '...' : 'MISSING');

async function test() {
    // Test with service role key
    const supabase = createClient(url, serviceKey, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    console.log('\n--- Testing admin.createUser ---');
    const { data, error } = await supabase.auth.admin.createUser({
        email: 'testwarrior@lifeos.dev',
        password: 'warrior2026!',
        user_metadata: { username: 'TestWarrior' },
        email_confirm: true
    });

    if (error) {
        console.error('ERROR:', error.message);
        console.error('STATUS:', error.status);
        console.error('FULL:', JSON.stringify(error, null, 2));
    } else {
        console.log('SUCCESS! User created:', data.user.id);
        console.log('Email:', data.user.email);
    }
}

test();
