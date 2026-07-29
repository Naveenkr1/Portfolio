const fs = require('fs');
const content = fs.readFileSync('/Users/naveen/.gemini/antigravity-ide/brain/705e76e6-f425-470d-8586-6331b1633170/.system_generated/steps/177/content.md', 'utf8');

const regex = /work|select|project/gi;
let match;
const matches = [];

while ((match = regex.exec(content)) !== null) {
  matches.push({
    word: match[0],
    index: match.index,
    context: content.slice(Math.max(0, match.index - 50), Math.min(content.length, match.index + 50)).replace(/\s+/g, ' ')
  });
}

console.log(`Found ${matches.length} matches:`);
matches.slice(0, 30).forEach((m, idx) => {
  console.log(`${idx+1}: [${m.word}] @ ${m.index} -> ${m.context}`);
});
