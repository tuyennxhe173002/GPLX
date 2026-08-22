const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

console.log('--- PARSING ALL 5 TIP CATEGORIES ---');

function extractArray(varName) {
  const startStr = `${varName}=[`;
  const startIdx = js.indexOf(startStr);
  if (startIdx === -1) {
    console.error(`Could not find ${varName}=[` );
    return [];
  }

  // Find array end
  let depth = 0;
  let endIdx = startIdx + varName.length + 1;
  for (let i = startIdx + varName.length + 1; i < js.length; i++) {
    if (js[i] === '[') depth++;
    else if (js[i] === ']') {
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
      depth--;
    }
  }

  const rawStr = js.slice(startIdx + varName.length + 1, endIdx);
  try {
    const arr = new Function(`return ${rawStr}`)();
    console.log(`Successfully parsed ${varName}: ${arr.length} items`);
    return arr;
  } catch (err) {
    console.error(`Failed to parse ${varName}:`, err.message);
    return [];
  }
}

const cat1 = extractArray('dV'); // Mẹo phần chữ
const cat2 = extractArray('kV'); // Mẹo biển báo cấm
const cat3 = extractArray('PV'); // Mẹo biển báo nguy hiểm
const cat4 = extractArray('VV'); // Mẹo biển báo chỉ dẫn
const cat5 = extractArray('iK'); // Mẹo sa hình

const fullDataset = {
  categories: [
    { id: 1, title: "MẸO PHẦN CHỮ", color: "#357f7a", tips: cat1 },
    { id: 2, title: "MẸO BIỂN BÁO CẤM", color: "#d90404", tips: cat2 },
    { id: 3, title: "MẸO BIỂN BÁO NGUY HIỂM", color: "#d5a500", tips: cat3 },
    { id: 4, title: "MẸO BIỂN BÁO CHỈ DẪN BIỂN BÁO HIỆU LỆNH THI HÀNH", color: "#257ba7", tips: cat4 },
    { id: 5, title: "MẸO CÂU HỎI SA HÌNH", color: "#7830bd", tips: cat5 }
  ]
};

fs.writeFileSync('scratch/all_mnemonics_categories.json', JSON.stringify(fullDataset, null, 2));
console.log('Saved scratch/all_mnemonics_categories.json successfully!');
