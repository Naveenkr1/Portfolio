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

let output = '';
blocks.forEach(block => {
  if (block.toLowerCase().includes(':hover')) {
    output += '=== BLOCK START ===\n';
    output += block + '\n';
    output += '=== BLOCK END ===\n\n';
  }
});

fs.writeFileSync('scratch/hovers.txt', output, 'utf8');
console.log('Successfully wrote hovers to scratch/hovers.txt');
