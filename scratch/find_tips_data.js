const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR Xz AND TIP DETAILS DATA ---');

// Search for Xz=[
const idxXz = js.indexOf('Xz=[');
console.log('Xz=[ index:', idxXz);
if (idxXz !== -1) {
  console.log('Snippet around Xz:');
  console.log(js.slice(idxXz, idxXz + 1000));
}

// Search for tip-details routes or tip objects
const matches = js.match(/[\w$]+\s*=\s*\[\s*\{\s*id:\s*1,\s*title:[\s\S]{1,1000}/g) || [];
console.log('Sample matched tip arrays count:', matches.length);
matches.slice(0, 5).forEach((m, i) => {
  console.log(`\n--- Array ${i} ---`);
  console.log(m.slice(0, 500));
});
