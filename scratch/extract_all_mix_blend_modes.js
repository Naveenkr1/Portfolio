const fs = require('fs');
const js = fs.readFileSync('scratch/chunk2.js', 'utf8');

const term = "mix-blend-mode";
let idx = 0;
let count = 0;
console.log(`=== ALL OCCURRENCES OF mix-blend-mode IN chunk2.js ===`);
while ((idx = js.indexOf(term, idx)) !== -1) {
  count++;
  console.log(`\n--- OCCURRENCE ${count} (at index ${idx}) ---`);
  const start = Math.max(0, idx - 400);
  const end = Math.min(js.length, idx + 400);
  console.log(js.slice(start, end));
  idx += term.length;
}
