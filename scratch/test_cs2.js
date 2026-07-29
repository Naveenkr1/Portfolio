const http = require('http');
async function test() {
  const resLogin = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'Sage6969@' })
  });
  const cookie = resLogin.headers.get('set-cookie');
  const res = await fetch('http://localhost:3001/api/case-studies/bbbjbjbj', {
    headers: { 'cookie': cookie }
  });
  console.log('Status:', res.status);
  const text = await res.text();
  console.log('Body:', text.substring(0, 200));
}
test();
