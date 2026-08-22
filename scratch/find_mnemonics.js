const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR MNEMONICS IN BUNDLE.JS ---');

const idx = js.indexOf('mnemonics');
console.log('mnemonics index in bundle.js:', idx);

// Search for strings containing mnemonic keywords, tips, or tip details
const keywords = ['Mẹo ghi nhớ', 'MẸO GHI NHỚ', 'Mẹo thi', 'mnemonics', 'tip-details'];

keywords.forEach(kw => {
  let pos = 0;
  const matches = [];
  while (true) {
    const i = js.indexOf(kw, pos);
    if (i === -1) break;
    matches.push(i);
    pos = i + kw.length;
  }
  console.log(`Keyword "${kw}": ${matches.length} matches`);
  if (matches.length > 0) {
    console.log(`Snippet near first match:`);
    console.log(js.slice(Math.max(0, matches[0] - 100), Math.min(js.length, matches[0] + 400)));
  }
});
