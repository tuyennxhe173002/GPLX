const fs = require('fs');

const tips = JSON.parse(fs.readFileSync('scratch/mnemonics_dataset.json', 'utf8'));

console.log('Total tips:', tips.length);

tips.forEach((t, i) => {
  console.log(`Tip ${i + 1} (${t.id}): ${t.text} [type: ${t.type || 'standard'}] (examples: ${t.exampleQuestions ? t.exampleQuestions.length : 0})`);
});
