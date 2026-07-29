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

console.log(`Analyzing ${blocks.length} CSS blocks...`);

// We want to find any hover selector and print the block
blocks.forEach((block, index) => {
  // Check if this block contains ':hover'
  // Webflow often writes: .class:hover { ... }
  // Let's find matches
  const matches = block.match(/\.[a-zA-Z0-9_-]+:hover/gi);
  if (matches) {
    console.log(`Block ${index + 1}:`);
    console.log(block);
    console.log('--------------------------------------------------');
  }
});
