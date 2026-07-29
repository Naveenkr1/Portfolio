const fs = require('fs');
const js = fs.readFileSync('scratch/naveen_design_index_js.js', 'utf8');

console.log('JS Bundle Size:', js.length, 'characters');

// Let's find occurrences of classNames or strings related to the layout
const terms = ['Selected', 'Work', 'project', 'image', 'hover', 'img', 'cover', 'card'];

terms.forEach(term => {
  const indices = [];
  let idx = 0;
  while ((idx = js.indexOf(term, idx)) !== -1) {
    indices.push(idx);
    idx += term.length;
  }
  console.log(`Term "${term}" found ${indices.length} times.`);
});
