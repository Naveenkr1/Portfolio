const fetch = require('node-fetch');

async function testCreate() {
  const url = 'https://portfolio-2-0-a96ua7blb-naveenkr1s-projects.vercel.app/api/case-studies';
  console.log('Testing create endpoint:', url);
  
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test Study', slug: 'test-study-' + Date.now() })
  });
  
  const text = await res.text();
  console.log('Status:', res.status);
  console.log('Response:', text);
}
testCreate();
