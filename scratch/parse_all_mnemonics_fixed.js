const fs = require('fs');
const js = fs.readFileSync('scratch/bundle.js', 'utf8');

function getArrayByName(name) {
  const target = `${name}=[` ;
  const idx = js.indexOf(target);
  if (idx === -1) {
    console.log(`Target ${target} not found!`);
    return [];
  }

  const startIdx = idx + name.length + 1; // At '['
  let depth = 0;
  let endIdx = startIdx;
  for (let i = startIdx; i < js.length; i++) {
    if (js[i] === '[') depth++;
    else if (js[i] === ']') {
      depth--;
      if (depth === 0) {
        endIdx = i + 1;
        break;
      }
    }
  }

  const raw = js.slice(startIdx, endIdx);
  try {
    const arr = new Function(`return ${raw}`)();
    console.log(`Parsed ${name}: ${arr.length} items`);
    return arr;
  } catch (err) {
    console.error(`Error parsing ${name}:`, err.message);
    return [];
  }
}

const dV = getArrayByName('dV');
const kV = getArrayByName('kV');
const PV = getArrayByName('PV');
const VV = getArrayByName('VV');
const iK = getArrayByName('iK');

const fullDataset = {
  categories: [
    { id: 1, title: "MẸO PHẦN CHỮ", color: "#357f7a", tips: dV },
    { id: 2, title: "MẸO BIỂN BÁO CẤM", color: "#d90404", tips: kV },
    { id: 3, title: "MẸO BIỂN BÁO NGUY HIỂM", color: "#d5a500", tips: PV },
    { id: 4, title: "MẸO BIỂN BÁO CHỈ DẪN BIỂN BÁO HIỆU LỆNH THI HÀNH", color: "#257ba7", tips: VV },
    { id: 5, title: "MẸO CÂU HỎI SA HÌNH", color: "#7830bd", tips: iK }
  ]
};

fs.writeFileSync('scratch/all_mnemonics_categories.json', JSON.stringify(fullDataset, null, 2));
console.log('Saved scratch/all_mnemonics_categories.json');
