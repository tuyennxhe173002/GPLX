const fs = require('fs');
const path = require('path');

const dataset = JSON.parse(fs.readFileSync('scratch/all_mnemonics_categories.json', 'utf8'));

const imageUrls = [];

function findImages(obj) {
  if (!obj) return;
  if (typeof obj === 'string') {
    const matches = obj.match(/https?:\/\/[^\s"']+\.(?:png|jpg|jpeg|gif|webp)/gi) || [];
    imageUrls.push(...matches);
    const relMatches = obj.match(/\/images\/[^\s"']+\.(?:png|jpg|jpeg|gif|webp)/gi) || [];
    relMatches.forEach(m => imageUrls.push(`https://daotaolaixebd.com${m}`));
    const meoMatches = obj.match(/\/meo\/[^\s"']+\.(?:png|jpg|jpeg|gif|webp)/gi) || [];
    meoMatches.forEach(m => imageUrls.push(`https://daotaolaixebd.com${m}`));
  } else if (Array.isArray(obj)) {
    obj.forEach(findImages);
  } else if (typeof obj === 'object') {
    for (const key in obj) {
      if (key === 'imageUrl' || key === 'imageName' || key === 'src') {
        if (typeof obj[key] === 'string' && obj[key].trim()) {
          let url = obj[key].trim();
          if (url.startsWith('/')) url = `https://daotaolaixebd.com${url}`;
          imageUrls.push(url);
        }
      }
      findImages(obj[key]);
    }
  }
}

findImages(dataset);

const uniqueUrls = [...new Set(imageUrls)];
console.log('Total unique mnemonic images found:', uniqueUrls.length);
console.log('Sample image URLs:', uniqueUrls.slice(0, 15));
