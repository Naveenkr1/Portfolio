const fs = require('fs');
const js = fs.readFileSync('scratch/chunk2.js', 'utf8');

// Find the styled-component block for projects/featured section's image styling
// In Gatsby Styled Components it's often inside the same block but let's search for ".project-image"
const term = '.project-image';
let idx = 0;
let count = 0;
while ((idx = js.indexOf(term, idx)) !== -1) {
  count++;
  console.log(`=== OCCURRENCE ${count} FOR "${term}" ===`);
  const start = Math.max(0, idx - 200);
  const end = Math.min(js.length, idx + 1000);
  console.log(js.slice(start, end));
  idx += term.length;
}
