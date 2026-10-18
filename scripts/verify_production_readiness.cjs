// scripts/verify_production_readiness.cjs
const fs = require('fs');
const path = require('path');

console.log('==================================================');
console.log('クリプトン公式サイト Netlify・検索設定 実測検査');
console.log('==================================================\n');

let passCount = 0;
let failCount = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`[PASS] ${message}`);
    passCount++;
  } else {
    console.error(`[FAIL] ${message}`);
    failCount++;
  }
}

// 1. サイトマップと実在ファイルの一致検査
console.log('--- 1. サイトマップ (sitemap-0.xml) と実在HTMLの一致検査 ---');
const sitemapPath = 'public/sitemap-0.xml';
assert(fs.existsSync(sitemapPath), 'sitemap-0.xml が存在する');

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const urls = [...sitemapContent.matchAll(/<loc>(https:\/\/xn--bbkyao7065bpyck41as89d\.com([^<]*))<\/loc>/g)];
console.log(`サイトマップ登録URL数: ${urls.length}件`);

let missingPages = [];
urls.forEach(([, fullUrl, urlPath]) => {
  let relativePath = urlPath.replace(/^\//, '');
  if (relativePath === '' || relativePath.endsWith('/')) {
    relativePath += 'index.html';
  } else if (!relativePath.endsWith('.html')) {
    relativePath += '/index.html';
  }
  const distFile = path.join('dist', relativePath);
  if (!fs.existsSync(distFile)) {
    missingPages.push({ fullUrl, distFile });
  }
});
assert(missingPages.length === 0, `サイトマップの全URLに対応する実在HTMLファイルが存在する (未存在: ${missingPages.length}件)`);
if (missingPages.length > 0) {
  missingPages.slice(0, 5).forEach(m => console.error(`  Missing: ${m.fullUrl} -> ${m.distFile}`));
}

// 2. Canonical URL の検査
console.log('\n--- 2. Canonical URL 実測検査 ---');
let canonicalErrors = [];
let sampleFiles = ['dist/index.html', 'dist/about/index.html', 'dist/toilet/index.html', 'dist/areas/nasu/index.html', 'dist/works/toilet-048/index.html'];
sampleFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const html = fs.readFileSync(f, 'utf8');
    const match = html.match(/<link\s+rel="canonical"\s+href="([^"]+)"/);
    if (!match) {
      canonicalErrors.push({ file: f, error: 'canonical tag not found' });
    } else if (!match[1].startsWith('https://xn--bbkyao7065bpyck41as89d.com')) {
      canonicalErrors.push({ file: f, error: `Invalid canonical domain: ${match[1]}` });
    }
  }
});
assert(canonicalErrors.length === 0, `主要ページのCanonicalが正式ドメイン (https://xn--bbkyao7065bpyck41as89d.com/) で完全記述されている`);

// 3. JSON-LD 構造化データの構文と内容検査
console.log('\n--- 3. JSON-LD 構造化データ構文・内容実測検査 ---');
let jsonLdErrors = [];
sampleFiles.forEach(f => {
  if (fs.existsSync(f)) {
    const html = fs.readFileSync(f, 'utf8');
    const matches = [...html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
    if (matches.length === 0) {
      jsonLdErrors.push({ file: f, error: 'No JSON-LD found' });
    } else {
      matches.forEach((m, idx) => {
        try {
          const parsed = JSON.parse(m[1]);
          if (!parsed['@context'] || !parsed['@type']) {
            jsonLdErrors.push({ file: f, error: `JSON-LD #${idx} missing @context or @type` });
          }
        } catch (e) {
          jsonLdErrors.push({ file: f, error: `JSON-LD #${idx} syntax error: ${e.message}` });
        }
      });
    }
  }
});
assert(jsonLdErrors.length === 0, `JSON-LD構造化データがすべての対象ページで構文エラーなく正常に抽出可能 (エラー: ${jsonLdErrors.length}件)`);

// 施工事例 (toilet-048) の Article 構造化データの詳細検査
const t048Html = fs.readFileSync('dist/works/toilet-048/index.html', 'utf8');
const t048Matches = [...t048Html.matchAll(/<script\s+type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/gi)];
let hasArticle = false;
t048Matches.forEach(m => {
  try {
    const data = JSON.parse(m[1]);
    if (data['@type'] === 'Article') {
      hasArticle = true;
      assert(data.headline && data.headline.includes('那須塩原市H邸'), 'Article.headline に正確なタイトルが含まれる');
      assert(data.author && data.author.name === '津久井 三男', 'Article.author に代表取締役（津久井 三男）が明記');
      assert(data.publisher && data.publisher.name === '有限会社クリプトン', 'Article.publisher に有限会社クリプトンが明記');
      assert(Array.isArray(data.image) && data.image[0].startsWith('http'), 'Article.image が完全絶対URLで指定されている');
    }
  } catch (e) {}
});
assert(hasArticle, '施工事例ページに Article 構造化データが正常に出力されている');

// 4. Netlify リダイレクトと noindex 保護ヘッダーの検査
console.log('\n--- 4. Netlify _headers と _redirects 検査 ---');
const headersPath = 'public/_headers';
assert(fs.existsSync(headersPath), '_headers ファイルが存在する');
const headersContent = fs.readFileSync(headersPath, 'utf8');
assert(headersContent.includes('X-Robots-Tag: noindex, nofollow'), 'Netlify仮サイト用の X-Robots-Tag: noindex 保護ヘッダーが設定されている');

const redirectsPath = 'public/_redirects';
assert(fs.existsSync(redirectsPath), '_redirects ファイルが存在する');
const redirectsContent = fs.readFileSync(redirectsPath, 'utf8');
assert(redirectsContent.includes('/works/sample  /works/  301!'), '旧サンプルURLのリダイレクトが設定されている');
assert(redirectsContent.includes('/services/sample  /#services  301!'), 'サービスサンプルURLのリダイレクトが設定されている');
assert(redirectsContent.includes('/*  /404.html  404'), '404フォールバックリダイレクトが設定されている');

// 5. llms-full.txt の検査
console.log('\n--- 5. llms-full.txt の整合性実測検査 ---');
const llmsPath = 'public/llms-full.txt';
assert(fs.existsSync(llmsPath), 'llms-full.txt が存在する');
const llmsContent = fs.readFileSync(llmsPath, 'utf8');
assert(llmsContent.includes('津久井 三男'), 'llms-full.txt に代表取締役（津久井 三男）が記載されている');
assert(llmsContent.includes('有限会社クリプトン'), 'llms-full.txt に正式社名が記載されている');
assert(!llmsContent.includes('toilet-046-5.jpg'), 'llms-full.txt に不要な画像ファイル名が一切混入していない');

console.log('\n==================================================');
console.log(`実測検査結果: 合格 ${passCount}件 / 不合格 ${failCount}件`);
console.log('==================================================');

if (failCount > 0) {
  process.exit(1);
}
