const fs = require('fs');
const questions = JSON.parse(fs.readFileSync('scratch/extracted_questions_raw.json', 'utf8'));

// Check questions in chapter 5 to see if some are vehicle structure and some are road signs
const ch5 = questions.filter(q => q.chapterId === 5);
console.log('Chapter 5 sample q1:', ch5[0].number, ch5[0].content);
console.log('Chapter 5 sample q50:', ch5[49] ? `${ch5[49].number} ${ch5[49].content}` : 'N/A');
console.log('Chapter 5 sample q150:', ch5[149] ? `${ch5[149].number} ${ch5[149].content}` : 'N/A');

const ch6 = questions.filter(q => q.chapterId === 6);
console.log('Chapter 6 sample q1:', ch6[0].number, ch6[0].content);
