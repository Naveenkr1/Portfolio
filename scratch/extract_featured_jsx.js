const fs = require('fs');
const js = fs.readFileSync('scratch/chunk2.js', 'utf8');

const term = '"Selected Work"';
const idx = js.indexOf(term);

if (idx !== -1) {
  const start = idx - 200;
  const end = idx + 2000;
  console.log('=== SELECTED WORK JSX CONTEXT ===');
  console.log(js.slice(start, end));
} else {
  console.log('Term not found!');
}
