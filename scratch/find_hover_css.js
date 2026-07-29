const fs = require('fs');
const css = fs.readFileSync('scratch/naveen_design_styles.css', 'utf8');

// Parse CSS by balancing braces
const blocks = [];
let currentBlock = '';
let braceCount = 0;

for (let i = 0; i < css.length; i++) {
  const char = css[i];
  currentBlock += char;
  
  if (char === '{') {
    braceCount++;
  } else if (char === '}') {
    braceCount--;
    if (braceCount === 0) {
      blocks.push(currentBlock.trim());
      currentBlock = '';
    }
  }
}

const keywords = ['scale', 'translate', 'zoom', 'transition', 'transform', 'filter', 'opacity'];
const matches = [];

blocks.forEach(block => {
  const lower = block.toLowerCase();
  if (lower.includes(':hover') && keywords.some(kw => lower.includes(kw))) {
    matches.push(block);
  }
});

console.log(`Found ${matches.length} hover rules with transitions/transforms.`);
matches.forEach((m, idx) => {
  console.log(`--- MATCH ${idx+1} ---`);
  console.log(m.slice(0, 500) + (m.length > 500 ? '...' : ''));
});
