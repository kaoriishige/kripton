// scripts/inspect_full_instructions.cjs
const fs = require('fs');
const path = require('path');

console.log('=== クリプトン公式サイト 最終検証・修正指示 全項目徹底検査 ===\n');

// 1. all_cases.ts の読み込み
const casesTs = fs.readFileSync('src/data/all_cases.ts', 'utf8');
const marker = 'export const allCasesData: CaseStudy[] = ';
const start = casesTs.indexOf(marker) + marker.length;
const end = casesTs.lastIndexOf('];');
const allCases = JSON.parse(casesTs.substring(start, end + 1));

console.log(`[1] 施工事例マスター件数: ${allCases.length}件`);

// 項目1: 施工事例の地域不整合の検査
console.log('\n--- 項目1: 地域分類の整合性検査 ---');
let areaMismatches = [];
allCases.forEach(c => {
  const t = c.title || '';
  const m = c.municipality || '';
  const aId = c.relatedAreaId || '';

  let expectedArea = null;
  let expectedAreaId = null;
  if (t.includes('那須町')) {
    expectedArea = '那須町';
    expectedAreaId = 'nasu';
  } else if (t.includes('大田原市')) {
    expectedArea = '大田原市';
    expectedAreaId = 'ohtawara';
  } else if (t.includes('那須塩原市')) {
    expectedArea = '那須塩原市';
    expectedAreaId = 'nasushiobara';
  } else if (t.includes('矢板市')) {
    expectedArea = '矢板市';
    expectedAreaId = 'other';
  }

  if (expectedArea && (m !== expectedArea || aId !== expectedAreaId)) {
    areaMismatches.push({
      slug: c.slug,
      title: t,
      currentMunicipality: m,
      expectedMunicipality: expectedArea,
      currentAreaId: aId,
      expectedAreaId: expectedAreaId
    });
  }
});
console.log(`地域不整合検出: ${areaMismatches.length}件`);
areaMismatches.forEach(x => console.log(`  - [${x.slug}] ${x.title} => 現:${x.currentMunicipality}(${x.currentAreaId}), 予:${x.expectedMunicipality}(${x.expectedAreaId})`));

// 項目2: 本文・概要文の不要文字列・画像ファイル名の検査
console.log('\n--- 項目2: 本文・概要文・カード抜粋文の不要文字列検査 ---');
const fileRegex = /([a-zA-Z0-9_-]+\.(jpg|jpeg|png|webp|gif)|toilet-\d+|boiler-\d+|kitchen-\d+|sink-area\d+|wash-basin\d+|bath\d+|other-\d+|pump-\d+|kitchn-\d+)/i;
let leftoverStrings = [];
allCases.forEach(c => {
  ['summary', 'consultation', 'workDetails'].forEach(f => {
    if (c[f] && fileRegex.test(c[f])) {
      const match = c[f].match(fileRegex);
      leftoverStrings.push({ slug: c.slug, field: f, match: match[0], textSample: c[f].substring(0, 80) });
    }
  });
});
console.log(`不要文字列・ファイル名検出: ${leftoverStrings.length}件`);
leftoverStrings.forEach(x => console.log(`  - [${x.slug}] field: ${x.field}, match: ${x.match}`));

// 項目3: 自動補完された架空の施工内容・作業時間・有資格者断定の検査
console.log('\n--- 項目3: 自動補完・架空の作業時間・原因等の検査 ---');
let fabricatedItems = [];
allCases.forEach(c => {
  // 自動補完パターン
  const isFabricatedInvestigation = c.investigation && (c.investigation.includes('国家資格者') || c.investigation.includes('有資格者'));
  const isFabricatedDuration = c.workDuration && (c.workDuration.includes('通常1〜2時間目安') || c.workDuration.includes('約1〜2時間') || c.workDuration.includes('24時間') || c.workDuration.includes('365日'));
  const isFabricatedCause = c.cause && c.cause.includes('経年劣化および部材の摩耗・不具合');
  if (isFabricatedInvestigation || isFabricatedDuration || isFabricatedCause) {
    fabricatedItems.push({
      slug: c.slug,
      workDuration: c.workDuration,
      cause: c.cause,
      investigation: c.investigation
    });
  }
});
console.log(`自動補完・架空断定の疑いがある事例: ${fabricatedItems.length}件`);
if (fabricatedItems.length > 0) {
  console.log(`  サンプル: ${fabricatedItems[0].slug} -> Duration: "${fabricatedItems[0].workDuration}", Cause: "${fabricatedItems[0].cause}"`);
}

// 項目4: お客様の声（レビュー）原本検査
console.log('\n--- 項目4: お客様の声原本検査 ---');
const customerReviewsAstro = fs.readFileSync('src/components/CustomerReviews.astro', 'utf8');
console.log('CustomerReviews.astro 現状:', customerReviewsAstro.includes('Googleビジネスプロフィール') ? 'GBP公式レビューリンク誘導中' : '個別口コミ掲載中');

// 項目5: 応急処置の安全性（元栓を時計回りに回せば即座に止まる 等）
console.log('\n--- 項目5: 応急処置の安全性表現検査 ---');
const srcFiles = [];
function findAstro(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      findAstro(full);
    } else if (file.endsWith('.astro') || file.endsWith('.ts')) {
      srcFiles.push(full);
    }
  });
}
findAstro('src');

let unsafePhrases = [];
srcFiles.forEach(f => {
  const c = fs.readFileSync(f, 'utf8');
  if (c.includes('即座に止まる') || c.includes('時計回りに回せば') || c.includes('元栓を時計回り')) {
    unsafePhrases.push(f);
  }
});
console.log(`不安全な断定表現検出ファイル数: ${unsafePhrases.length}件`);
unsafePhrases.forEach(x => console.log('  -', x));
