require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function cleanup() {
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
        auth: { autoRefreshToken: false, persistSession: false }
    });

    // Delete test user
    const { data: { users } } = await supabase.auth.admin.listUsers();
    for (const user of users) {
        if (user.email === 'testwarrior@lifeos.dev') {
            await supabase.auth.admin.deleteUser(user.id);
            console.log('Deleted test user:', user.email);
        }
    }

    // Also delete the old user from the custom Users table if it exists in Supabase Auth
    // (the old 'Ghanshyam Thakur' user was only in the custom table, not in Supabase Auth)
    
    console.log('\nCurrent Supabase Auth users:');
    const { data: { users: remaining } } = await supabase.auth.admin.listUsers();
    if (remaining.length === 0) {
        console.log('  (none - clean slate)');
    } else {
        remaining.forEach(u => console.log(' ', u.email, u.id));
    }
}

cleanup();
