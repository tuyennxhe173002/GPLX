const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

// Find occurrences of id:1, or content:
let pos = 0;
const results = [];
while (true) {
  const idx = js.indexOf('"Khái niệm „đường bộ"', pos);
  if (idx === -1) break;
  results.push(idx);
  pos = idx + 10;
}

console.log('Occurrences of question 1 content string:', results);
results.forEach((idx, i) => {
  console.log(`\n--- Result ${i} (idx: ${idx}) ---`);
  console.log(js.slice(Math.max(0, idx - 100), Math.min(js.length, idx + 300)));
});
