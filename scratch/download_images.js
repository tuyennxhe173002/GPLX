const fs = require('fs');
const path = require('path');

const questions = JSON.parse(fs.readFileSync('backend/src/main/resources/data/questions.json', 'utf8'));

const images = questions
  .filter(q => q.imageUrl)
  .map(q => path.basename(q.imageUrl));

const uniqueImages = [...new Set(images)];

console.log(`Found ${uniqueImages.length} unique images to download...`);

const feDir = path.join(__dirname, '../frontend/public/uploads');
const beDir = path.join(__dirname, '../backend/src/main/resources/static/uploads');

if (!fs.existsSync(feDir)) fs.mkdirSync(feDir, { recursive: true });
if (!fs.existsSync(beDir)) fs.mkdirSync(beDir, { recursive: true });

async function downloadAll() {
  let downloaded = 0;
  let skipped = 0;
  let failed = 0;

  // Process in batches of 10 concurrently
  const batchSize = 10;
  for (let i = 0; i < uniqueImages.length; i += batchSize) {
    const batch = uniqueImages.slice(i, i + batchSize);
    await Promise.all(batch.map(async (imgName) => {
      const fePath = path.join(feDir, imgName);
      const bePath = path.join(beDir, imgName);

      if (fs.existsSync(fePath) && fs.existsSync(bePath)) {
        skipped++;
        return;
      }

      const url = `https://daotaolaixebd.com/app/uploads/${imgName}`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const buffer = Buffer.from(await res.arrayBuffer());

        fs.writeFileSync(fePath, buffer);
        fs.writeFileSync(bePath, buffer);
        downloaded++;
      } catch (err) {
        console.error(`Failed to download ${imgName}:`, err.message);
        failed++;
      }
    }));

    if ((i + batchSize) % 50 === 0 || i + batchSize >= uniqueImages.length) {
      console.log(`Progress: ${Math.min(i + batchSize, uniqueImages.length)} / ${uniqueImages.length}`);
    }
  }

  console.log(`Done! Downloaded: ${downloaded}, Skipped: ${skipped}, Failed: ${failed}`);
}

downloadAll();
