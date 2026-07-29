const fs = require('fs');
const content = fs.readFileSync('/Users/naveen/.gemini/antigravity-ide/brain/705e76e6-f425-470d-8586-6331b1633170/.system_generated/steps/177/content.md', 'utf8');

// Find occurrences of common portfolio section titles, case-insensitive
const keywords = ['work', 'project', 'featured', 'selected'];
const matches = [];

keywords.forEach(keyword => {
  let index = 0;
  while ((index = content.toLowerCase().indexOf(keyword, index)) !== -1) {
    matches.push({ keyword, index });
    index += keyword.length;
  }
});

console.log(`Found ${matches.length} keyword matches.`);

// Print surrounding HTML for a few matches
matches.slice(0, 10).forEach((match, idx) => {
  const start = Math.max(0, match.index - 200);
  const end = Math.min(content.length, match.index + 400);
  console.log(`--- MATCH ${idx+1} (${match.keyword} at index ${match.index}) ---`);
  console.log(content.slice(start, end).replace(/\n/g, ' '));
  console.log('\n');
});
