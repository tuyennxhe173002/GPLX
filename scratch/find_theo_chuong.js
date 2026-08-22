const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR THEO-CHUONG COMPONENT IN BUNDLE.JS ---');

let pos = js.indexOf('/theory/theo-chuong');
if (pos !== -1) {
  console.log('Found route at index:', pos);
  console.log(js.slice(Math.max(0, pos - 200), Math.min(js.length, pos + 500)));
}

// Search for string "Ôn tập theo chương"
let posTitle = js.indexOf('Ôn tập theo chương');
if (posTitle !== -1) {
  console.log('\nFound title "Ôn tập theo chương" at index:', posTitle);
  console.log(js.slice(Math.max(0, posTitle - 200), Math.min(js.length, posTitle + 2000)));
}
