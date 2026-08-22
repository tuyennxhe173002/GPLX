const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- EXTRACTING COMPLETE MNEMONICS DATASET ---');

// Find start of dV array
const startStr = 'dV=[';
const startIdx = js.indexOf(startStr);
console.log('startIdx of dV:', startIdx);

if (startIdx !== -1) {
  // Find where dV array ends (before ,gV=)
  const endIdx = js.indexOf('],gV=', startIdx);
  console.log('endIdx of dV:', endIdx);

  const rawArrayStr = js.slice(startIdx + 3, endIdx + 1);
  console.log('Raw dV string length:', rawArrayStr.length);

  try {
    const tips = new Function(`return ${rawArrayStr}`)();
    console.log('SUCCESS! Total tip sections extracted:', tips.length);
    console.log('Sample tip 1:', JSON.stringify(tips[0], null, 2));

    fs.writeFileSync('scratch/mnemonics_dataset.json', JSON.stringify(tips, null, 2));
    console.log('Saved scratch/mnemonics_dataset.json!');
  } catch (err) {
    console.error('Eval failed:', err.message);
    // Sanitize string if needed
  }
}
