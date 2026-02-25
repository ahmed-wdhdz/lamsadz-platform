const http = require('http');
const req = http.request('http://localhost:3000/api/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
}, (res) => {
    let body = '';
    res.on('data', c => body += c);
    res.on('end', () => console.log('Response:', res.statusCode, body));
});
req.write(JSON.stringify({
    name: 'ahmed',
    email: 'ahmedahmed48dzdz@gmail.com',
    password: 'Password123!',
    role: 'WORKSHOP'
}));
req.end();
