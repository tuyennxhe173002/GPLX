const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR OTHER TIP CATEGORY ARRAYS IN BUNDLE.JS ---');

const tipArrays = js.match(/[\w$]+\s*=\s*\[\s*\{\s*id:\s*["']page-[\s\S]{1,1000}/g) || [];
console.log('Found tip array declarations:', tipArrays.length);

tipArrays.forEach((a, i) => {
  console.log(`\n=== Tip Array ${i} ===`);
  console.log(a.slice(0, 300));
});

// Search for tip-details page components:
for (let id = 1; id <= 5; id++) {
  const kw = `path:"/tip-details/${id}"`;
  console.log(`Route ${kw}:`, js.includes(kw));
}
