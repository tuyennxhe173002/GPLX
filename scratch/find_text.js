const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- SEARCHING FOR VIETNAMESE QUESTION TEXT ---');
const phrases = ['dùng cho các phương tiện', 'vạch kẻ đường', 'điểm liệt', 'Giải thích', 'Đáp án'];

for (const phrase of phrases) {
  let idx = js.indexOf(phrase);
  console.log(`Phrase "${phrase}": found at index ${idx}`);
  if (idx !== -1) {
    console.log('Snippet:', js.slice(Math.max(0, idx - 150), Math.min(js.length, idx + 400)));
  }
}
