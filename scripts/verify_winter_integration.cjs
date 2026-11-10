// scripts/verify_winter_integration.cjs
const fs = require('fs');
const path = require('path');

console.log('=== 冬対策ページ＆トップお知らせ 総合検証 ===\n');

let pass = 0, fail = 0;

function check(label, condition) {
  if (condition) {
    console.log(`✅ PASS: ${label}`);
    pass++;
  } else {
    console.log(`❌ FAIL: ${label}`);
    fail++;
  }
}

// 1. トップページの検証
const topHtmlPath = path.join(__dirname, '../dist/index.html');
const topHtml = fs.readFileSync(topHtmlPath, 'utf8');
check('トップページに冬の凍結注意見出しが存在', topHtml.includes('那須地域の冬、') && topHtml.includes('水道管の凍結にご注意ください'));
check('トップページに指定の説明文が存在', topHtml.includes('寒さが厳しくなる前に、水道管・給湯器の凍結対策を。万が一、凍ってしまった場合の対処方法もご案内します。'));
check('トップページに「冬の水まわり対策を見る」ボタンが存在', topHtml.includes('冬の水まわり対策を見る'));
check('トップページに16:9メイン画像が配置されている', topHtml.includes('/images/winter/winter-kripton-hero.webp'));
check('クイック移動バーに「冬の凍結対策」が存在', topHtml.includes('jump-chip-winter'));

// 2. 専用ページ（/winter/index.html）の検証
const winterHtmlPath = path.join(__dirname, '../dist/winter/index.html');
check('/winter/index.html が生成されている', fs.existsSync(winterHtmlPath));
const winterHtml = fs.readFileSync(winterHtmlPath, 'utf8');
check('H1タイトルが設定されている', /<h1[^>]*>[\s\S]*?那須地域の冬の水まわり対策/.test(winterHtml));
check('meta descriptionが設定されている', /<meta name="description" content="那須塩原市・大田原市・那須町/.test(winterHtml));
check('canonicalURLが正規化されている', winterHtml.includes('rel="canonical" href="https://mizumawari-kripton.com/winter/"'));
check('Article構造化データが存在', winterHtml.includes('"@type":"Article"'));
check('FAQPage構造化データが存在', winterHtml.includes('"@type":"FAQPage"'));
check('BreadcrumbList構造化データが存在', winterHtml.includes('"@type":"BreadcrumbList"'));

// 掲載必須項目の検証
check('① 凍結する原因が記載されている', winterHtml.includes('マイナス4℃以下') && winterHtml.includes('なぜ那須の冬は水道管が凍結するのか'));
check('② 凍結しやすい場所が記載されている', winterHtml.includes('屋外の露出配管') && winterHtml.includes('建物の北側'));
check('③ 自宅でできる予防が記載されている', winterHtml.includes('保温材を巻く') && winterHtml.includes('チョロチョロ水出し'));
check('④ 給湯器の予防が記載されている', winterHtml.includes('電源プラグは絶対に抜かない') && winterHtml.includes('追い焚き配管'));
check('⑤ 凍った時の対処法（熱湯厳禁）が記載されている', winterHtml.includes('熱湯を直接かけてはいけません') && winterHtml.includes('guide-defrost-safety.webp'));
check('⑥ 破裂時の応急処置が記載されている', winterHtml.includes('メーターボックス内の元栓') && winterHtml.includes('guide-burst-emergency.webp'));
check('⑦ 別荘の水抜きが記載されている', winterHtml.includes('那須高原の別荘') && winterHtml.includes('不凍栓'));
check('⑧ 実際の施工事例が掲載されている', winterHtml.includes('boiler-011') && winterHtml.includes('boiler-009'));
check('⑨ 点検・修理の料金表が掲載されている', winterHtml.includes('8,000円〜') && winterHtml.includes('10,000円〜'));
check('⑩ 緊急電話導線（090-2463-6638）が配置されている', winterHtml.includes('tel:090-2463-6638'));
check('⑪ SSGformへの導線（/contact/）が配置されている', winterHtml.includes('/contact/'));

// 3. 画像ファイルの存在確認
const imagesToCheck = [
  '../public/images/character/kripton-man-official.png',
  '../public/images/character/kripton-man-official.webp',
  '../public/images/winter/winter-kripton-hero.webp',
  '../public/images/winter/guide-defrost-safety.webp',
  '../public/images/winter/guide-burst-emergency.webp',
  '../public/images/works/boiler-011-1-scaled.jpg',
  '../public/images/works/boiler-009-1-scaled.jpg',
  '../public/images/works/004-1-1.jpg'
];
imagesToCheck.forEach(img => {
  const p = path.join(__dirname, img);
  check(`画像存在: ${path.basename(img)}`, fs.existsSync(p));
});

// 4. サイトマップの検証
const sitemapPath = path.join(__dirname, '../public/sitemap-0.xml');
const sitemap = fs.readFileSync(sitemapPath, 'utf8');
check('サイトマップに /winter/ が登録されている', sitemap.includes('https://mizumawari-kripton.com/winter/'));

console.log(`\n========================================`);
console.log(`検証完了: PASS = ${pass} / FAIL = ${fail}`);
console.log(`========================================`);

if (fail > 0) {
  process.exit(1);
}

