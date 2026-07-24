require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function testLogin() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

    // Assuming we created testwarrior@lifeos.dev earlier, let's see if we can log in
    // Or we'll just try to create and then login
    
    console.log('Testing Supabase login...');
    const { data, error } = await supabase.auth.signInWithPassword({
        email: 'testwarrior@lifeos.dev',
        password: 'warrior2026!'
    });

    if (error) {
        console.error('Login Error:', error.message);
    } else {
        console.log('Login Success! User ID:', data.user.id);
    }
}

testLogin();
