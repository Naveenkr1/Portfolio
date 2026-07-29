const http = require('http');

async function test() {
  // login
  const resLogin = await fetch('http://localhost:3001/api/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password: 'Sage6969@' })
  });
  const cookie = resLogin.headers.get('set-cookie');
  console.log('Login status:', resLogin.status);
  
  const endpoints = [
    '/api/homepage/hero',
    '/api/homepage/about',
    '/api/featured',
    '/api/jobs',
    '/api/case-studies',
    '/api/resume',
    '/api/play-projects'
  ];

  for (const ep of endpoints) {
    const res = await fetch('http://localhost:3001' + ep, {
      headers: { 'cookie': cookie }
    });
    console.log(ep, res.status);
    if (!res.ok) {
      const text = await res.text();
      console.log('Error in', ep, text);
    }
  }
}
test();
