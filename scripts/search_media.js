const fs = require('fs');
const media = JSON.parse(fs.readFileSync('docs/raw-data/media.json', 'utf8'));

console.log('Total media items:', media.length);
const matches = [];
for (const m of media) {
  const text = (m.title?.rendered || '') + ' ' + (m.source_url || '') + ' ' + (m.alt_text || '');
  if (/krypton|クリプトン|マン|man|hero|ヒーロー|ロゴ|logo|character|イラスト|chara/i.test(text)) {
    matches.push(m);
  }
}

console.log('Matching character/hero/logo media:', matches.length);
matches.forEach(m => {
  console.log(`[${m.id}] ${m.title?.rendered} | alt: ${m.alt_text} | url: ${m.source_url}`);
});
