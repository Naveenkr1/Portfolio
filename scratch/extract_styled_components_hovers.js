const fs = require('fs');
const content = fs.readFileSync('/Users/naveen/.gemini/antigravity-ide/brain/705e76e6-f425-470d-8586-6331b1633170/.system_generated/steps/177/content.md', 'utf8');

// Extract the second style tag (styled-components)
const styleRegex = /<style data-styled="" data-styled-version="5.3.5">([\s\S]*?)<\/style>/gi;
const match = styleRegex.exec(content);

if (!match) {
  console.log('Styled-components style tag not found!');
  process.exit(1);
}

const css = match[1];
fs.writeFileSync('scratch/styled_components.css', css, 'utf8');
console.log(`Saved styled-components CSS (${css.length} chars) to scratch/styled_components.css`);

// Now parse this CSS
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

console.log(`Parsed ${blocks.length} blocks from styled-components.`);

const keywords = ['hover', 'transform', 'transition', 'scale', 'opacity', 'filter', 'mix-blend-mode'];

blocks.forEach((block, idx) => {
  const lower = block.toLowerCase();
  const hasKeyword = keywords.some(kw => lower.includes(kw));
  if (hasKeyword) {
    console.log(`--- BLOCK ${idx+1} ---`);
    console.log(block);
  }
});
