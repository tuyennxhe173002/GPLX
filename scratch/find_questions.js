const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

// Find references to questions or 600
console.log('--- SEARCHING QUESTION DATA PATTERNS ---');
const idx = js.indexOf('questionNumber') !== -1 ? js.indexOf('questionNumber') : js.indexOf('cau_hoi') !== -1 ? js.indexOf('cau_hoi') : js.indexOf('600');

console.log('Contains questionNumber:', js.includes('questionNumber'));
console.log('Contains cauHoi:', js.includes('cauHoi') || js.includes('cau_hoi'));
console.log('Contains id:', js.includes('id:'));

// Search for where questions data is loaded or defined
const matches = js.match(/[\w$]+\s*=\s*\[\s*\{\s*(?:id|questionNumber|number|code):[\s\S]{1,500}/g) || [];
console.log('Sample matched arrays count:', matches.length);
matches.slice(0, 5).forEach((m, i) => {
  console.log(`\n--- Array ${i} ---`);
  console.log(m.slice(0, 300));
});
