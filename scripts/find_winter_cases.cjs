const fs = require('fs');
const content = fs.readFileSync('src/data/all_cases.ts', 'utf8');

// allCasesDataの定義から末尾のセミコロンまでをeval
const arrayMatch = content.match(/export const allCasesData: CaseStudyItem\[\] = (\[[\s\S]*?\]);/);
if (!arrayMatch) {
  console.log('Match failed');
  process.exit(1);
}

// evalを使ってJSオブジェクトとして取得
const cases = eval(arrayMatch[1]);
console.log('Total cases:', cases.length);

const winterCases = cases.filter(c => 
  /凍結|ボイラー|給湯|配管|水抜き|解氷/.test(c.title + ' ' + c.category + ' ' + c.summary)
);

console.log('Winter related cases count:', winterCases.length);
winterCases.forEach(c => {
  console.log(`[${c.slug}] (${c.municipality} / ${c.category}) ${c.title}`);
  console.log(`  beforeImage: ${c.beforeImage}`);
  console.log(`  allImages: ${c.allImages.filter(img => !img.includes('kripton-man')).join(', ')}`);
});
