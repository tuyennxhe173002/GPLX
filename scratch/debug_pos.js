const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

const idx = js.indexOf('xe lăn của người khuyết tật');
console.log('Target idx:', idx);

// Search backwards from idx for 'content:'
let pos = idx;
while (pos > 0) {
  const cIdx = js.lastIndexOf('content:', pos);
  if (cIdx === -1) break;
  console.log('cIdx:', cIdx);
  console.log('Snippet around cIdx:', js.slice(Math.max(0, cIdx - 30), cIdx + 50));
  pos = cIdx - 1;
  if (idx - pos > 5000) break; // check first 5 nearest content:
}
