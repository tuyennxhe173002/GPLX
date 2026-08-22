const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

// Find the array containing questions in bundle.js
// Look for where the array of questions is defined
// Search for string patterns starting with [{id:1,content: or [{id:...,content:

const startStr = '[{id:1,content:';
let startIdx = js.indexOf(startStr);
if (startIdx === -1) {
  // try finding by regex
  const match = js.match(/\[\s*\{\s*id\s*:\s*1\s*,\s*content\s*:/);
  if (match) startIdx = match.index;
}

console.log('Start index of questions array:', startIdx);

if (startIdx !== -1) {
  // Find where this JSON array ends in js
  // We can track brackets or parse JSON slice
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < js.length; i++) {
    if (js[i] === '[') depth++;
    else if (js[i] === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  const rawArrayStr = js.slice(startIdx, endIdx);
  console.log('Raw array string length:', rawArrayStr.length);

  try {
    // Attempt eval or JSON parse (the object keys in bundle might be unquoted like id:1, content:"...")
    // Using Function to safely return the JS object array
    const questions = new Function(`return ${rawArrayStr}`)();
    console.log('Extracted questions count:', questions.length);
    console.log('First question sample:', JSON.stringify(questions[0], null, 2));
    console.log('Last question sample:', JSON.stringify(questions[questions.length - 1], null, 2));

    fs.writeFileSync('scratch/extracted_questions_raw.json', JSON.stringify(questions, null, 2));
  } catch (err) {
    console.error('Error evaluating questions array:', err.message);
  }
} else {
  console.log('Could not find startStr directly. Let us search for alternative patterns.');
}
