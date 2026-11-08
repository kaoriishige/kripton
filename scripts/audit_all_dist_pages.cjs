const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

// 全HTMLファイルを再帰的に取得
function getHtmlFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getHtmlFiles(fullPath));
    } else if (file.endsWith('.html')) {
      results.push(fullPath);
    }
  });
  return results;
}

const htmlFiles = getHtmlFiles(distDir);
console.log(`=== 全HTMLファイル検査 (総数: ${htmlFiles.length}件) ===`);

let passCount = 0;
let errors = [];

// サイトマップの読み込み
const sitemapContent = fs.readFileSync('public/sitemap-0.xml', 'utf8');
const sitemapUrls = new Set([...sitemapContent.matchAll(/<loc>(https:\/\/mizumawari-kripton\.com([^<]*))<\/loc>/g)].map(m => m[2]));

htmlFiles.forEach(file => {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  let urlPath = '/' + relPath.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (!urlPath.endsWith('/') && urlPath !== '') urlPath += '/';
  if (urlPath === '//') urlPath = '/';

  const html = fs.readFileSync(file, 'utf8');

  // 1. Title
  const titleMatch = html.match(/<title>([^<]*)<\/title>/i);
  if (!titleMatch || !titleMatch[1].trim()) {
    errors.push(`${relPath}: titleタグが空または存在しません`);
  }

  // 2. Meta description
  const descMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']*)["']/i);
  if (!descMatch || !descMatch[1].trim()) {
    errors.push(`${relPath}: meta descriptionが空または存在しません`);
  }

  // 3. H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  if (!h1Match || !h1Match[1].trim()) {
    errors.push(`${relPath}: h1タグが存在しないか空です`);
  }

  // 4. Canonical
  if (!relPath.includes('404.html') && !relPath.includes('preview')) {
    const canMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']*)["']/i);
    const expectedCan = `https://mizumawari-kripton.com${urlPath}`;
    if (!canMatch || canMatch[1] !== expectedCan) {
      errors.push(`${relPath}: canonical不一致 (期待: ${expectedCan}, 実際: ${canMatch ? canMatch[1] : 'なし'})`);
    }

    // 5. 不要なnoindex
    if (/meta[^>]*robots[^>]*noindex/i.test(html)) {
      errors.push(`${relPath}: 公開ページに不要なnoindexが存在します`);
    }
  }

  // 6. JSON-LD構造化データ構文
  const jsonLds = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  jsonLds.forEach((j, idx) => {
    try {
      const parsed = JSON.parse(j[1].trim());
      if (!parsed['@context'] || !parsed['@type']) {
        errors.push(`${relPath}: JSON-LD #${idx} @contextまたは@typeが欠落`);
      }
    } catch (e) {
      errors.push(`${relPath}: JSON-LD #${idx} 構文エラー: ${e.message}`);
    }
  });

  // 7. 旧ドメインの混入
  if (html.includes('xn--bbkyao7065bpyck41as89d')) {
    errors.push(`${relPath}: 旧日本語ドメインが残存しています`);
  }
});

console.log(`検査完了: エラー件数: ${errors.length}`);
if (errors.length > 0) {
  console.log('検出されたエラー:');
  errors.slice(0, 20).forEach(e => console.log('  ❌', e));
} else {
  console.log('✅ 全93HTMLページのTitle, Meta, H1, Canonical, JSON-LD, ドメイン検証がすべて正常です！');
}

