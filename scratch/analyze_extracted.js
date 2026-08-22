const fs = require('fs');

const questions = JSON.parse(fs.readFileSync('scratch/extracted_questions_raw.json', 'utf8'));

const questionsWithImages = questions.filter(q => q.imageName && q.imageName.trim() !== '');
console.log('Total questions:', questions.length);
console.log('Questions with images:', questionsWithImages.length);

const imageNames = [...new Set(questionsWithImages.map(q => q.imageName.trim()))];
console.log('Unique image names:', imageNames.length);
console.log('Sample image names:', imageNames.slice(0, 10));

// Check chapters distribution
const chapterCounts = {};
questions.forEach(q => {
  chapterCounts[q.chapterId] = (chapterCounts[q.chapterId] || 0) + 1;
});
console.log('Chapter distribution:', chapterCounts);

// Check critical questions count
const criticalCount = questions.filter(q => q.isCritical).length;
console.log('Critical questions (câu điểm liệt) count:', criticalCount);
