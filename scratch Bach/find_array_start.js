const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

const target = 'xe lăn của người khuyết tật';
const idx = js.indexOf(target);
console.log('Index:', idx);
if (idx !== -1) {
  // Let's find backwards to the start of the array '['
  const arrayStart = js.lastIndexOf('[', idx);
  console.log('Array start index:', arrayStart);
  console.log('Snippet before array start:', js.slice(Math.max(0, arrayStart - 100), arrayStart));
  console.log('Snippet after array start:', js.slice(arrayStart, arrayStart + 500));
}
