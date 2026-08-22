const fs = require('fs');

const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- URL MATCHES ---');
const urls = js.match(/https?:\/\/[^\s"'`}]+/g) || [];
console.log([...new Set(urls)]);

console.log('\n--- API MATCHES ---');
const apis = js.match(/\/api\/[a-zA-Z0-9_\-/]+/g) || [];
console.log([...new Set(apis)]);

console.log('\n--- JSON / QUESTION DATA ASSETS ---');
const jsonFiles = js.match(/[\w-]+\.json/g) || [];
console.log([...new Set(jsonFiles)]);

console.log('\n--- ROUTE PATHS ---');
const routes = js.match(/path:\s*["'][^"']+["']/g) || [];
console.log([...new Set(routes)].slice(0, 30));
