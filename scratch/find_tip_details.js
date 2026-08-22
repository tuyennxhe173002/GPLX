const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR TIP DETAILS COMPONENTS & CONTENT ---');

// Search for tip-details/1 or tip 1 content in bundle.js
for (let id = 1; id <= 5; id++) {
  const target = `tip-details/${id}`;
  let pos = js.indexOf(target);
  console.log(`\n=== TARGET: ${target} (idx: ${pos}) ===`);

  // Search for component definitions or strings matching tip details
  const kw = `id:${id}`;
  let idx = 0;
  while (true) {
    const p = js.indexOf(kw, idx);
    if (p === -1) break;
    // Print context
    const snippet = js.slice(Math.max(0, p - 50), Math.min(js.length, p + 300));
    if (snippet.includes('title') || snippet.includes('meo') || snippet.includes('Mẹo') || snippet.includes('chữ') || snippet.includes('biển')) {
      console.log(`Snippet around ${kw} at ${p}:`);
      console.log(snippet);
    }
    idx = p + kw.length;
    if (idx > js.length - 100) break;
  }
}
