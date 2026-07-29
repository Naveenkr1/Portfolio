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
  const data = await res.json();
  console.log('blocks is array?', Array.isArray(data.blocks));
  if (Array.isArray(data.blocks)) console.log('blocks length:', data.blocks.length);
  else console.log('blocks type:', typeof data.blocks, Object.keys(data.blocks));
}
test();
