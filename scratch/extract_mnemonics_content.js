const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- EXTRACTING MNEMONICS AND TIP DETAILS FROM BUNDLE.JS ---');

// Search for tip-details routes in JS bundle
// Search for component definitions rendering tip details
const tipKeywords = ['MẸO PHẦN CHỮ', 'MẸO BIỂN BÁO CẤM', 'MẸO BIỂN BÁO', 'MẸO CÂU HỎI SA HÌNH', 'Bị nghiêm cấm'];

tipKeywords.forEach(kw => {
  let pos = 0;
  while (true) {
    const idx = js.indexOf(kw, pos);
    if (idx === -1) break;
    console.log(`\n=== KEYWORD "${kw}" at index ${idx} ===`);
    console.log(js.slice(Math.max(0, idx - 200), Math.min(js.length, idx + 1000)));
    pos = idx + kw.length;
    if (pos > js.length - 100) break;
  }
});
