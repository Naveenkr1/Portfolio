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
  const data = await res.json();
  console.log('Blocks length:', data.blocks ? data.blocks.length : 0);
  console.log('Metadata title:', data.metadata ? data.metadata.title : 'none');
}
test();
