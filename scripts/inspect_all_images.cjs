const fs = require('fs');
const path = require('path');

const media = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'raw-data', 'media.json'), 'utf8'));
console.log('Total media in WordPress:', media.length);

const types = {};
let hasAlt = 0;
let attachedCount = 0;

for (const m of media) {
  const url = m.source_url || '';
  const ext = (url.split('.').pop() || 'unknown').toLowerCase();
  types[ext] = (types[ext] || 0) + 1;
  if (m.alt_text && m.alt_text.trim()) hasAlt++;
  if (m.post) attachedCount++;
}

console.log('Extensions:', types);
console.log('With alt text:', hasAlt);
console.log('Attached to posts/pages:', attachedCount);

// 施工写真の分類（トイレ、キッチン、給湯器、お風呂など）
const categories = {
  toilet: 0,
  kitchen: 0,
  bath: 0,
  boiler: 0,
  character: 0,
  flyer_event: 0,
  other: 0
};

media.forEach(m => {
  const text = (m.title?.rendered + ' ' + m.source_url + ' ' + (m.alt_text || '')).toLowerCase();
  if (/toilet|トイレ|便器|ウォシュレット|シャワートイレ/.test(text)) {
    categories.toilet++;
  } else if (/kitchen|キッチン|台所|流し|水栓/.test(text)) {
    categories.kitchen++;
  } else if (/bath|風呂|浴室|ユニットバス|シャワー/.test(text)) {
    categories.bath++;
  } else if (/boiler|ボイラー|給湯器|エコキュート/.test(text)) {
    categories.boiler++;
  } else if (/kripton|クリプトン|man|マン|hero/.test(text)) {
    categories.character++;
  } else if (/チラシ|イベント|展示会|おまつり/.test(text)) {
    categories.flyer_event++;
  } else {
    categories.other++;
  }
});

console.log('\n--- Image Categories Breakdown ---');
console.table(categories);

console.log('\n--- Sample Real Works Photos (First 5) ---');
media.slice(0, 5).forEach(m => {
  console.log(`[ID:${m.id}] ${m.title?.rendered} | Alt: "${m.alt_text}" | URL: ${m.source_url}`);
});
