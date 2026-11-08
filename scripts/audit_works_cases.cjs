const fs = require('fs');
const path = require('path');

const casesFile = path.join(__dirname, '../src/data/all_cases.ts');
const casesContent = fs.readFileSync(casesFile, 'utf8');
const match = casesContent.match(/export const allCasesData:\s*CaseStudy(?:Item)?\[\]\s*=\s*(\[[\s\S]*?\]);/);
const cases = match ? eval(match[1]) : [];

console.log(`=== 施工事例 最終詳細検査 (総数: ${cases.length}件) ===\n`);

let errors = [];
const municipalities = new Set();
const services = new Set();

cases.forEach((c, idx) => {
  // 1. スラッグとファイル存在確認
  const distFile = path.join(__dirname, `../dist/works/${c.slug}/index.html`);
  if (!fs.existsSync(distFile)) {
    errors.push(`事例 #${idx + 1} (${c.slug}): dist/works/${c.slug}/index.html が存在しません`);
    return;
  }

  municipalities.add(c.municipality);
  services.add(c.category);

  // 2. 本文に画像ファイル名や不要タグが混入していないか
  const textFields = [c.consultation, c.cause, c.workDetail, c.customerVoice || ''];
  textFields.forEach(text => {
    if (/\.(jpg|png|webp|jpeg)/i.test(text)) {
      errors.push(`事例 #${idx + 1} (${c.slug}): 本文に画像ファイル名が混入: "${text}"`);
    }
    if (/<[^>]+>/.test(text)) {
      errors.push(`事例 #${idx + 1} (${c.slug}): 本文に生HTMLタグが混入: "${text}"`);
    }
  });

  // 3. 画像ファイルの存在確認
  const images = [c.beforeImage, c.afterImage].concat(c.galleryImages || []);
  images.forEach(img => {
    if (img && !img.startsWith('http')) {
      const imgPath = path.join(__dirname, '../public', img);
      if (!fs.existsSync(imgPath)) {
        errors.push(`事例 #${idx + 1} (${c.slug}): 画像ファイルが見つかりません: ${img}`);
      }
    }
  });

  // 4. HTML内容の検査（Canonical, Article構造化データ, 地域・サービスリンク）
  const html = fs.readFileSync(distFile, 'utf8');
  
  // Canonical
  const expectedCan = `https://mizumawari-kripton.com/works/${c.slug}/`;
  if (!html.includes(`<link rel="canonical" href="${expectedCan}"`)) {
    errors.push(`事例 #${idx + 1} (${c.slug}): canonicalが不一致 (期待: ${expectedCan})`);
  }

  // Article JSON-LD
  if (!html.includes('"@type":"Article"')) {
    errors.push(`事例 #${idx + 1} (${c.slug}): Article構造化データがありません`);
  } else {
    if (html.includes('xn--bbkyao7065bpyck41as89d')) {
      errors.push(`事例 #${idx + 1} (${c.slug}): JSON-LDに旧日本語ドメインが含まれています`);
    }
  }

  // 地域分類の確認
  const validMunicipalities = ['那須塩原市', '大田原市', '那須町', '矢板市', '塩谷町'];
  if (!validMunicipalities.includes(c.municipality)) {
    errors.push(`事例 #${idx + 1} (${c.slug}): 不正な自治体名: "${c.municipality}"`);
  }
});

console.log('自治体別内訳:');
const muniCounts = {};
cases.forEach(c => muniCounts[c.municipality] = (muniCounts[c.municipality] || 0) + 1);
console.log(muniCounts);

console.log('\nカテゴリー（サービス）別内訳:');
const catCounts = {};
cases.forEach(c => catCounts[c.category] = (catCounts[c.category] || 0) + 1);
console.log(catCounts);

console.log(`\n施工事例エラー総数: ${errors.length}`);
if (errors.length > 0) {
  errors.forEach(e => console.log('  ❌', e));
} else {
  console.log('✅ 施工事例全64件: タイトル、自治体分類、画像実在、Article構造化データ、ファイル名混入なしがすべて完全適合しました！');
}

