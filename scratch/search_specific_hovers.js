const fs = require('fs');
const css = fs.readFileSync('scratch/naveen_design_styles.css', 'utf8');

// Balanced brace parser to get all CSS blocks
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

// Find any block containing 'hover' and 'image' or 'img'
blocks.forEach((block, index) => {
  const lower = block.toLowerCase();
  if (lower.includes('hover') && (lower.includes('image') || lower.includes('img') || lower.includes('pic'))) {
    console.log(`Block ${index + 1}:`);
    console.log(block);
    console.log('--------------------------------------------------');
  }
});
