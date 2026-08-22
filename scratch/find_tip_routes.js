const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR ROUTE DEFINITIONS FOR /tip-details/ ---');

const routes = js.match(/path:\s*["']\/tip-details\/\d+["'][^}]*/g) || [];
console.log('Routes found:', routes);

// Search for variables assigned after dV or other tip arrays
// Look for where tip-details/2 component is defined
for (let id = 1; id <= 5; id++) {
  const matchStr = `"/tip-details/${id}"`;
  const idx = js.indexOf(matchStr);
  console.log(`\n=== Route for ID ${id} at index ${idx} ===`);
  if (idx !== -1) {
    console.log(js.slice(Math.max(0, idx - 150), Math.min(js.length, idx + 300)));
  }
}
