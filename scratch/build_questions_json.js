const fs = require('fs');

const rawQuestions = JSON.parse(fs.readFileSync('scratch/extracted_questions_raw.json', 'utf8'));

// Helper to determine chapter code by question number
function getChapterCode(qNum) {
  if (qNum <= 166) return 'CONCEPT_RULES';
  if (qNum <= 192) return 'TRANSPORT_OPERATION';
  if (qNum <= 213) return 'CULTURE_ETHICS';
  if (qNum <= 269) return 'DRIVING_TECHNIQUE';
  if (qNum <= 304) return 'VEHICLE_STRUCTURE';
  if (qNum <= 486) return 'ROAD_SIGNS';
  return 'SA_HINH';
}

const formattedQuestions = rawQuestions.map(q => {
  const qNum = q.number || q.id;
  const chapterCode = getChapterCode(qNum);
  
  const hasImg = q.imageName && q.imageName.trim() !== '';
  const imageUrl = hasImg ? `/uploads/${q.imageName.trim()}` : null;
  const questionType = hasImg ? 'IMAGE' : 'TEXT';

  const answers = (q.options || []).map((opt, idx) => ({
    label: (idx + 1).toString(),
    content: opt.trim(),
    isCorrect: idx === q.correctAnswerIndex
  }));

  return {
    questionNumber: qNum,
    chapterCode: chapterCode,
    content: q.content.trim(),
    imageUrl: imageUrl,
    questionType: questionType,
    isCritical: Boolean(q.isCritical),
    hasAnimation: false,
    answers: answers,
    explanation: q.explain && q.explain.trim() !== '' ? q.explain.trim() : null
  };
});

// Sort by questionNumber
formattedQuestions.sort((a, b) => a.questionNumber - b.questionNumber);

// Validate
console.log('Total questions formatted:', formattedQuestions.length);

const criticalCount = formattedQuestions.filter(q => q.isCritical).length;
console.log('Critical questions count:', criticalCount);

const validTypes = new Set(['TEXT', 'IMAGE']);
formattedQuestions.forEach(q => {
  if (q.questionNumber < 1 || q.questionNumber > 600) throw new Error(`Invalid qNum: ${q.questionNumber}`);
  if (!q.content) throw new Error(`Empty content at ${q.questionNumber}`);
  if (!validTypes.has(q.questionType)) throw new Error(`Invalid type ${q.questionType}`);
  const corrects = q.answers.filter(a => a.isCorrect);
  if (corrects.length !== 1) throw new Error(`Question ${q.questionNumber} has ${corrects.length} correct answers!`);
});

console.log('All validations passed!');

// Write to backend/src/main/resources/data/questions.json
const destPath = 'backend/src/main/resources/data/questions.json';
fs.writeFileSync(destPath, JSON.stringify(formattedQuestions, null, 2));
console.log(`Successfully written ${formattedQuestions.length} questions to ${destPath}`);
