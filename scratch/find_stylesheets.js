const fs = require('fs');
const content = fs.readFileSync('/Users/naveen/.gemini/antigravity-ide/brain/705e76e6-f425-470d-8586-6331b1633170/.system_generated/steps/177/content.md', 'utf8');

// Find all stylesheet link tags
const linkRegex = /<link[^>]*rel=["']stylesheet["'][^>]*>/gi;
const linkMatches = content.match(linkRegex) || [];
console.log('Stylesheet links:');
linkMatches.forEach((m, idx) => console.log(`${idx+1}: ${m}`));

// Find all style tags (print first 100 characters of each)
const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
let match;
let count = 0;
console.log('\nStyle tags:');
while ((match = styleRegex.exec(content)) !== null) {
  count++;
  console.log(`${count}: tag attributes: ${match[0].slice(0, 150)}...`);
  console.log(`Body size: ${match[1].length} chars`);
}
