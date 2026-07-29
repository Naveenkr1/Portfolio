const fs = require('fs');

const search = (filepath) => {
  const code = fs.readFileSync(filepath, 'utf8');
  console.log(`=== SEARCHING ${filepath} (size: ${code.length}) ===`);
  
  const terms = ["Some Things I've Built", "Selected Work", "Featured", "StyledProject", "mix-blend-mode", "grayscale", "contrast", "brightness"];
  
  terms.forEach(term => {
    const indices = [];
    let idx = 0;
    while ((idx = code.indexOf(term, idx)) !== -1) {
      indices.push(idx);
      idx += term.length;
    }
    console.log(`Term "${term}" found ${indices.length} times.`);
    
    // Print first match context
    if (indices.length > 0) {
      const start = Math.max(0, indices[0] - 150);
      const end = Math.min(code.length, indices[0] + 150);
      console.log(`  Context: ...${code.slice(start, end).replace(/\s+/g, ' ')}...`);
    }
  });
  console.log('\n');
};

search('scratch/chunk1.js');
search('scratch/chunk2.js');
