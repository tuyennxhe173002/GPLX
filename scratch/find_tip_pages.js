const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR ALL TIP DETAILS OBJECTS IN BUNDLE.JS ---');

// Search for arrays or objects containing tip details
// Look for strings like {id:"page-
let pos = 0;
const matches = [];
while (true) {
  const i = js.indexOf('page-1', pos);
  if (i === -1) break;
  matches.push(i);
  pos = i + 6;
}

console.log('Matches for page-1:', matches);
matches.forEach((m, idx) => {
  console.log(`\n=== Match ${idx} at ${m} ===`);
  console.log(js.slice(Math.max(0, m - 100), Math.min(js.length, m + 1500)));
});
