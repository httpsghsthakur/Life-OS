const http = require('http');

const testData = JSON.stringify({
    email: 'testwarrior@lifeos.dev',
    password: 'warrior2026!'
});

const opts = {
    hostname: 'localhost',
    port: 5000,
    path: '/api/auth/login',
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(testData)
    }
};

console.log('Testing Supabase Auth login...\n');

const req = http.request(opts, res => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => {
        console.log('Status:', res.statusCode);
        try {
            const j = JSON.parse(body);
            console.log('Response:', JSON.stringify(j, null, 2));
        } catch (e) {
            console.log('Raw body:', body);
        }
    });
});

req.on('error', e => console.error('Connection Error:', e.message));
req.write(testData);
req.end();
