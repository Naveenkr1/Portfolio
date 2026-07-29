const fs = require('fs');
const js = fs.readFileSync('scratch/chunk2.js', 'utf8');

const term = "mix-blend-mode:multiply";
let idx = js.indexOf(term);
if (idx !== -1) {
  const start = Math.max(0, idx - 800);
  const end = Math.min(js.length, idx + 800);
  console.log(`=== FULL STYLING CODE CONTEXT IN chunk2.js ===`);
  console.log(js.slice(start, end));
} else {
  console.log('Term not found!');
}
