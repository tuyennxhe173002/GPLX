const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- EXTRACTING COMPONENTS TV, _V, zV, nK, fK ---');

const compNames = ['TV', '_V', 'zV', 'nK', 'fK'];

compNames.forEach((name, idx) => {
  console.log(`\n=================== COMPONENT ${name} (for /tip-details/${idx + 1}) ===================`);
  
  // Search for function TV( or const TV= or TV=()=>
  const targets = [`function ${name}(`, `const ${name}=`, `${name}=()=>`, `${name}=function`];
  let foundPos = -1;
  for (const t of targets) {
    const p = js.indexOf(t);
    if (p !== -1) {
      foundPos = p;
      break;
    }
  }

  if (foundPos !== -1) {
    console.log(`Found ${name} at index ${foundPos}:`);
    console.log(js.slice(foundPos, foundPos + 1500));
  } else {
    console.log(`Could not find direct definition for ${name}`);
  }
});
