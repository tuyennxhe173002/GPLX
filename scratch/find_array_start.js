const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

const target = 'xe lăn của người khuyết tật';
const idx = js.indexOf(target);
console.log('Index:', idx);
if (idx !== -1) {
  // Let's find backwards to the start of the big array
  // We can search for the variable declaration, e.g. const X = [ or var X = [ or X=[
  let pos = idx;
  while (pos > 0) {
    if (js[pos] === '[' && (js[pos-1] === '=' || js[pos-1] === ' ')) {
      console.log('Found potential array start at pos:', pos);
      console.log('Context before:', js.slice(Math.max(0, pos - 50), pos));
      console.log('Context after:', js.slice(pos, pos + 300));
      break;
    }
    pos--;
  }
}
