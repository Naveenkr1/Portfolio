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

const targets = ['link-block-2', 'image-6', 'image-3', 'column-7'];

targets.forEach(target => {
  console.log(`=== RULES FOR "${target}" ===`);
  blocks.forEach((block, idx) => {
    if (block.includes(target)) {
      console.log(`Block ${idx+1}:`);
      console.log(block);
      console.log('---');
    }
  });
  console.log('\n');
});
