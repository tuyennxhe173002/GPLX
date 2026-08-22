const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

const target = 'xe lăn của người khuyết tật';
const idx = js.indexOf(target);

let arrayStart = -1;
for (let i = idx; i > 0; i--) {
  if (js.slice(i, i + 10) === '[{"id":1,"' || js.slice(i, i + 8) === '[{"id":1') {
    arrayStart = i;
    break;
  }
}

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

const rawStr = js.slice(arrayStart, arrayEnd);

try {
  const questions = new Function(`return ${rawStr}`)();
  console.log('SUCCESS with Function! Questions count:', questions.length);
  console.log('Question 1:', JSON.stringify(questions[0], null, 2));
  console.log('Question 600:', JSON.stringify(questions[questions.length - 1], null, 2));

  fs.writeFileSync('scratch/extracted_questions_raw.json', JSON.stringify(questions, null, 2));
  console.log('Saved scratch/extracted_questions_raw.json');
} catch (err) {
  console.error('Function eval failed:', err.message);

  // Let's inspect position 34569 where JSON.parse failed
  console.log('Context around pos 34569:');
  console.log(rawStr.slice(34500, 34650));
}
