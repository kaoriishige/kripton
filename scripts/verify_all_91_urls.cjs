// scripts/verify_all_91_urls.cjs
const fs = require('fs');
const path = require('path');

console.log('=== 全91URLのHTTPステータス・Canonical・内部リンク実測検査 ===\n');

const sitemapContent = fs.readFileSync('public/sitemap-0.xml', 'utf8');
const urls = [...sitemapContent.matchAll(/<loc>(https:\/\/xn--bbkyao7065bpyck41as89d\.com([^<]*))<\/loc>/g)];

console.log(`検査対象URL総数: ${urls.length}件\n`);

let statusPass = 0;
let statusFail = 0;
let canonicalPass = 0;
let canonicalFail = 0;
let linkPass = 0;
let linkFail = 0;

const missingFiles = [];
const brokenCanonical = [];
const brokenLinks = [];

// 全HTMLファイルの存在マップを作成
const allDistFiles = new Set();
function scanDist(dir) {
  fs.readdirSync(dir).forEach(file => {
    const full = path.join(dir, file);
    if (fs.statSync(full).isDirectory()) {
      scanDist(full);
    } else {
      const rel = path.relative('dist', full).replace(/\\/g, '/');
      allDistFiles.add('/' + rel);
    }
  });
}
scanDist('dist');

urls.forEach(([, fullUrl, urlPath]) => {
  let relativePath = urlPath.replace(/^\//, '');
  if (relativePath === '' || relativePath.endsWith('/')) {
    relativePath += 'index.html';
  } else if (!relativePath.endsWith('.html')) {
    relativePath += '/index.html';
  }
  const distFile = path.join('dist', relativePath);

  // 1. HTTPステータス / 実ファイル存在検査
  if (fs.existsSync(distFile)) {
    statusPass++;
    const html = fs.readFileSync(distFile, 'utf8');

    // 2. Canonical検査
    const canonicalMatch = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
    if (canonicalMatch && canonicalMatch[1] === fullUrl) {
      canonicalPass++;
    } else {
      canonicalFail++;
      brokenCanonical.push({ url: fullUrl, expected: fullUrl, actual: canonicalMatch ? canonicalMatch[1] : 'NONE' });
    }

    // 3. 内部リンク検査（href="/" や href="/works/..." 等）
    const hrefMatches = [...html.matchAll(/href="(\/[^"#?]*)"/g)].map(m => m[1]);
    hrefMatches.forEach(href => {
      // # や tel: や mailto: は除外済み
      let checkPath = href;
      if (checkPath === '/') checkPath = '/index.html';
      else if (checkPath.endsWith('/')) checkPath += 'index.html';
      else if (!checkPath.endsWith('.html') && !checkPath.includes('.')) checkPath += '/index.html';

      // 静的アセット等のチェック
      if (!allDistFiles.has(checkPath) && !allDistFiles.has(href)) {
        // 重複除外
        if (!brokenLinks.some(b => b.source === fullUrl && b.target === href)) {
          brokenLinks.push({ source: fullUrl, target: href });
        }
      }
    });
  } else {
    statusFail++;
    missingFiles.push(fullUrl);
  }
});

console.log(`[1] 実在・HTTPステータス検査: 合格 ${statusPass} / 欠落 ${statusFail}`);
if (missingFiles.length > 0) {
  missingFiles.slice(0, 5).forEach(m => console.log('   - 欠落:', m));
}

console.log(`[2] Canonical絶対URL検査: 合格 ${canonicalPass} / 不一致 ${canonicalFail}`);
if (brokenCanonical.length > 0) {
  brokenCanonical.slice(0, 5).forEach(b => console.log(`   - 不一致: ${b.url} -> 実際:${b.actual}`));
}

console.log(`[3] 内部リンク検査: リンク切れ検出 ${brokenLinks.length}件`);
if (brokenLinks.length > 0) {
  brokenLinks.slice(0, 10).forEach(b => console.log(`   - リンク切れ: [${b.source}] -> ${b.target}`));
}

console.log('\n==================================================');
const isSuccess = statusFail === 0 && canonicalFail === 0 && brokenLinks.length === 0;
console.log(`全91URL総合検証結果: ${isSuccess ? 'PASS (全件完全適合)' : 'FAIL'}`);
console.log('==================================================');

if (!isSuccess) {
  process.exit(1);
}
