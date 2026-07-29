const fs = require('fs');
const content = fs.readFileSync('/Users/naveen/.gemini/antigravity-ide/brain/705e76e6-f425-470d-8586-6331b1633170/.system_generated/steps/177/content.md', 'utf8');

console.log('Total file length:', content.length);

const terms = ['Selected', 'Work', '.jpg', '.png', '.webp', 'cover', 'projects', 'featured', 'hover'];

terms.forEach(term => {
  const indices = [];
  let idx = 0;
  while ((idx = content.indexOf(term, idx)) !== -1) {
    indices.push(idx);
    idx += term.length;
  }
  console.log(`Term "${term}" found ${indices.length} times.`);
});
