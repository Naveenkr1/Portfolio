const fs = require('fs');
const content = fs.readFileSync('/Users/naveen/.gemini/antigravity-ide/brain/705e76e6-f425-470d-8586-6331b1633170/.system_generated/steps/177/content.md', 'utf8');

const regex = /<img[^>]+>/g;
const matches = content.match(regex) || [];

console.log(`Found ${matches.length} img tags:`);
matches.forEach((m, idx) => {
  console.log(`${idx+1}: ${m}`);
});
