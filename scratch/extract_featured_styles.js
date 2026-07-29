const fs = require('fs');
const js = fs.readFileSync('scratch/chunk2.js', 'utf8');

// Find the styled-component block for projects/featured section
const term = 'displayName:"featured__StyledProject"';
const idx = js.indexOf(term);

if (idx !== -1) {
  const start = idx - 100;
  const end = idx + 2000;
  console.log('=== FEATURED PROJECT STYLE CONTEXT ===');
  console.log(js.slice(start, end));
} else {
  console.log('Term not found!');
}
