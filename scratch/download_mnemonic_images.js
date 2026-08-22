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
          if (!url.startsWith('http')) url = `https://daotaolaixebd.com/app/uploads/${url}`;
          imageUrls.push(url);
        }
      }
      findImages(obj[key]);
    }
  }
}

findImages(dataset);

const uniqueUrls = [...new Set(imageUrls)];
console.log(`Found ${uniqueUrls.length} unique mnemonic images to download...`);

const fePublic = path.join(__dirname, '../frontend/public');

async function downloadAll() {
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  for (const url of uniqueUrls) {
    try {
      const parsedUrl = new URL(url);
      const relPath = parsedUrl.pathname; // e.g. /images/csgt.png or /app/uploads/1747...
      
      let localRelPath = relPath;
      if (relPath.startsWith('/app/uploads/')) {
        localRelPath = relPath.replace('/app/uploads/', '/uploads/');
      }

      const destFile = path.join(fePublic, localRelPath);
      const destDir = path.dirname(destFile);

      if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

      if (fs.existsSync(destFile)) {
        skipped++;
        continue;
      }

      const res = await fetch(url);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const buffer = Buffer.from(await res.arrayBuffer());

      fs.writeFileSync(destFile, buffer);
      downloaded++;
    } catch (err) {
      console.error(`Failed to download ${url}:`, err.message);
      failed++;
    }
  }

  console.log(`Finished downloading mnemonic images! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

downloadAll();
