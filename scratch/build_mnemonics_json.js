const fs = require('fs');
const path = require('path');

const rawDataset = JSON.parse(fs.readFileSync('scratch/all_mnemonics_categories.json', 'utf8'));

// Sanitize URLs in dataset so they point to local paths /images/... or /uploads/...
function sanitizeUrls(obj) {
  if (!obj) return obj;
  if (typeof obj === 'string') {
    let s = obj;
    s = s.replace(/https?:\/\/daotaolaixebd\.com\/app\/uploads\//g, '/uploads/');
    s = s.replace(/https?:\/\/daotaolaixebd\.com\/images\//g, '/images/');
    s = s.replace(/https?:\/\/daotaolaixebd\.com\/meo\//g, '/meo/');
    return s;
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeUrls);
  }
  if (typeof obj === 'object') {
    const res = {};
    for (const k in obj) {
      res[k] = sanitizeUrls(obj[k]);
    }
    return res;
  }
  return obj;
}

const sanitizedDataset = sanitizeUrls(rawDataset);

const destPath = path.join(__dirname, '../frontend/src/features/mnemonics/data/mnemonics.json');
const destDir = path.dirname(destPath);
if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

fs.writeFileSync(destPath, JSON.stringify(sanitizedDataset, null, 2));
console.log(`Successfully written mnemonics dataset to ${destPath}`);
