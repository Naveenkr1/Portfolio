const fs = require('fs');
const content = fs.readFileSync('/Users/naveen/.gemini/antigravity-ide/brain/705e76e6-f425-470d-8586-6331b1633170/.system_generated/steps/177/content.md', 'utf8');

const printContext = (term) => {
  let idx = 0;
  let count = 0;
  console.log(`=== CONTEXTS FOR "${term}" ===`);
  while ((idx = content.indexOf(term, idx)) !== -1) {
    count++;
    const start = Math.max(0, idx - 150);
    const end = Math.min(content.length, idx + 150);
    console.log(`${count}: ...${content.slice(start, end).replace(/\s+/g, ' ')}...`);
    idx += term.length;
  }
  console.log('\n');
};

printContext('cover');
printContext('.png');
