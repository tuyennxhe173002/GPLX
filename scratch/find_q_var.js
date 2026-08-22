const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

const target = 'xe lăn của người khuyết tật';
const idx = js.indexOf(target);

// Search backwards from idx for the variable definition of questions
let p = idx;
while (p > 0) {
  // Look for assignment like X=[{id:1,content: or something similar
  const slice = js.slice(p - 100, p);
  if (slice.includes('[{id:1,content:') || slice.includes('=[{id:1,')) {
    console.log('Match found around index:', p);
    console.log('Context:', js.slice(p - 100, p + 200));
    break;
  }
  p--;
}
