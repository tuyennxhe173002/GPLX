const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

const idx = js.indexOf('xe lăn của người khuyết tật');

// Let's search backwards from idx for the nearest '=' before '{id:1,' or '{id:'
let arrayStart = -1;
for (let i = idx; i > 0; i--) {
  if (js.slice(i, i + 6) === '[{id:1' || js.slice(i, i + 6) === '[{id:') {
    // Check if it's the questions array (has 'content:')
    const sample = js.slice(i, i + 100);
    if (sample.includes('content:')) {
      arrayStart = i;
      break;
    }
  }
}

console.log('Question Array start index:', arrayStart);
if (arrayStart !== -1) {
  console.log('Var definition before start:', js.slice(Math.max(0, arrayStart - 50), arrayStart));
  console.log('First 300 chars of array:', js.slice(arrayStart, arrayStart + 300));

  // Find array end
  let depth = 0;
  let arrayEnd = arrayStart;
  for (let i = arrayStart; i < js.length; i++) {
    if (js[i] === '[') depth++;
    else if (js[i] === ']') {
      depth--;
      if (depth === 0) {
        arrayEnd = i + 1;
        break;
      }
    }
  }
  console.log('Question Array end index:', arrayEnd);
  console.log('Raw array length:', arrayEnd - arrayStart);

  const rawStr = js.slice(arrayStart, arrayEnd);
  const questions = new Function(`return ${rawStr}`)();
  console.log('Successfully parsed questions count:', questions.length);

  fs.writeFileSync('scratch/extracted_questions_raw.json', JSON.stringify(questions, null, 2));
  console.log('Saved scratch/extracted_questions_raw.json!');
}
