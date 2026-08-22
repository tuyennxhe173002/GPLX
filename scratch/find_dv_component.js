const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR TIP COMPONENT DV & EXAMPLE QUESTION RENDERING ---');

// Search for DV= or function DV
let pos = js.indexOf('DV=');
if (pos !== -1) {
  console.log('Found DV= at index:', pos);
  console.log(js.slice(pos, pos + 2500));
} else {
  console.log('DV= not found directly, searching for DV function');
}
