const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR QUESTION OBJECTS ---');
// Let's find phrases like 'đường bộ' or 'phương tiện' or 'người điều khiển'
const matches = [];
let pos = 0;
while (true) {
  const i = js.indexOf('dapAn', pos);
  if (i === -1) break;
  matches.push(i);
  pos = i + 5;
}
console.log('dapAn occurrences:', matches.length);

if (matches.length > 0) {
  console.log('\nSample snippet near dapAn:');
  console.log(js.slice(matches[0] - 100, matches[0] + 500));
}

// Let's search for objects with answer array or question text
const qMatches = js.match(/\{id:\d+,[^}]*cauHoi:[^}]*\}/g) || [];
console.log('cauHoi matches count:', qMatches.length);

// Let's search for json files or chunks loaded dynamically
const chunks = js.match(/["'][a-zA-Z0-9_-]+\.js["']/g) || [];
console.log('JS Chunks in bundle:', [...new Set(chunks)]);
