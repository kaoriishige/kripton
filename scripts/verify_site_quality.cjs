const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '..', 'dist');
const sitemapPath = path.join(distDir, 'sitemap-0.xml');

console.log('=== 水まわり専門店クリプトン 公式サイト 最終実測検証 ===\n');

// 1. サイトマップ検査
if (!fs.existsSync(sitemapPath)) {
  console.error('❌ sitemap-0.xml が存在しません！');
  process.exit(1);
}

const sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
const locMatches = [...sitemapContent.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);

console.log(`【1. サイトマップ検査】`);
console.log(`サイトマップ記載URL数: ${locMatches.length} 件`);

let missingPages = 0;
const domainBase = 'https://xn--bbkyao7065bpyck41as89d.com';

const checkedPages = [];

locMatches.forEach(url => {
  let relativePath = url.replace(domainBase, '');
  if (relativePath === '' || relativePath === '/') {
    relativePath = 'index.html';
  } else {
    relativePath = relativePath.endsWith('/') ? `${relativePath}index.html` : `${relativePath}/index.html`;
  }
  const cleanRel = relativePath.replace(/^\/+/, '');
  const filePath = path.join(distDir, cleanRel);
  if (!fs.existsSync(filePath)) {
    console.error(`❌ 実在しないページ: ${url} -> ${filePath}`);
    missingPages++;
  } else {
    checkedPages.push({ url, filePath, relativePath: cleanRel });
  }
});

if (missingPages === 0) {
  console.log(`✅ 全 ${locMatches.length} 件のサイトマップURLに対応する実在 HTML ファイルが確認されました。\n`);
} else {
  console.error(`❌ ${missingPages} 件のページが見つかりませんでした。\n`);
}

// 2. canonical URL & JSON-LD 構文検査
console.log(`【2. canonical URL & JSON-LD 構造化データ構文検査】`);
let canonicalErrors = 0;
let jsonLdErrors = 0;
let jsonLdCount = 0;

checkedPages.forEach(({ url, filePath }) => {
  const html = fs.readFileSync(filePath, 'utf8');
  
  // canonical check
  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["'](.*?)["']/i);
  if (!canonicalMatch) {
    console.warn(`⚠️ canonicalタグなし: ${url}`);
    canonicalErrors++;
  } else {
    const canonicalHref = canonicalMatch[1];
    // 末尾スラッシュ正規化
    const normUrl = url.endsWith('/') ? url : url + '/';
    const normCanonical = canonicalHref.endsWith('/') ? canonicalHref : canonicalHref + '/';
    if (normUrl !== normCanonical) {
      console.warn(`⚠️ canonical不一致: 期待=${normUrl}, 実際=${normCanonical}`);
      canonicalErrors++;
    }
  }

  // JSON-LD check
  const jsonLdMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["']>(.*?)<\/script>/gis)];
  jsonLdMatches.forEach((m, idx) => {
    jsonLdCount++;
    try {
      const parsed = JSON.parse(m[1].trim());
      if (!parsed['@context'] || !parsed['@type']) {
        console.warn(`⚠️ 不完全なJSON-LD (${url}): @context または @type がありません`);
        jsonLdErrors++;
      }
    } catch (e) {
      console.error(`❌ JSON-LDパースエラー (${url}) #${idx}:`, e.message);
      jsonLdErrors++;
    }
  });
});

console.log(`Canonicalエラー: ${canonicalErrors} 件`);
console.log(`検査したJSON-LDスクリプト総数: ${jsonLdCount} 件 (エラー: ${jsonLdErrors} 件)`);
if (canonicalErrors === 0 && jsonLdErrors === 0) {
  console.log(`✅ 全ページの Canonical URL および JSON-LD 構文が正常であることを実測確認しました。\n`);
}

// 3. 404ページ & リダイレクト & ヘッダー検査
console.log(`【3. 404ページ・リダイレクト・Netlifyヘッダー検査】`);
const file404 = path.join(distDir, '404.html');
if (fs.existsSync(file404)) {
  console.log(`✅ dist/404.html が存在します (${fs.statSync(file404).size} bytes)`);
} else {
  console.error(`❌ dist/404.html が存在しません`);
}

const fileHeaders = path.join(distDir, '_headers');
if (fs.existsSync(fileHeaders)) {
  const headersContent = fs.readFileSync(fileHeaders, 'utf8');
  console.log(`✅ dist/_headers が存在します。内容:\n${headersContent.trim()}`);
  if (headersContent.includes('X-Robots-Tag: noindex, nofollow')) {
    console.log(`✅ Netlify仮環境用の noindex, nofollow が正しく配備されています。`);
  } else {
    console.warn(`⚠️ X-Robots-Tag: noindex, nofollow が見つかりません`);
  }
} else {
  console.error(`❌ dist/_headers が存在しません`);
}

const fileRedirects = path.join(distDir, '_redirects');
if (fs.existsSync(fileRedirects)) {
  const redirectsContent = fs.readFileSync(fileRedirects, 'utf8');
  const redirectLines = redirectsContent.split('\n').filter(l => l.trim().length > 0);
  console.log(`✅ dist/_redirects が存在します (${redirectLines.length} 件の転送ルール設定済み)\n`);
} else {
  console.error(`❌ dist/_redirects が存在しません\n`);
}

// 4. 内部リンク切れ（Broken Links）検査
console.log(`【4. 内部リンク切れ（全ページ走査）検査】`);
let brokenLinks = 0;
let checkedLinksCount = 0;

checkedPages.forEach(({ url, filePath }) => {
  const html = fs.readFileSync(filePath, 'utf8');
  const linkMatches = [...html.matchAll(/href=["'](\/[^"'#\s]*)(#[^"']*)?["']/g)];
  
  linkMatches.forEach(lm => {
    let targetPath = lm[1];
    if (targetPath.startsWith('/images/') || targetPath.startsWith('/favicon') || targetPath.startsWith('/sitemap') || targetPath.startsWith('/robots') || targetPath.startsWith('/llms') || targetPath.startsWith('/_astro/')) {
      // 静的アセット
      const cleanPath = targetPath.split('?')[0].replace(/^\/+/, '');
      const assetPath = path.join(distDir, cleanPath);
      if (!fs.existsSync(assetPath)) {
        console.error(`❌ 静的アセットリンク切れ (${url}): ${targetPath}`);
        brokenLinks++;
      }
    } else {
      // ページリンク
      let targetFile;
      if (targetPath === '/' || targetPath === '') {
        targetFile = path.join(distDir, 'index.html');
      } else {
        const clean = targetPath.endsWith('/') ? targetPath.slice(0, -1) : targetPath;
        const cleanRel = clean.replace(/^\/+/, '');
        targetFile = path.join(distDir, cleanRel, 'index.html');
      }
      if (!fs.existsSync(targetFile)) {
        console.error(`❌ 内部ページリンク切れ (${url}): ${targetPath}`);
        brokenLinks++;
      }
    }
    checkedLinksCount++;
  });
});

console.log(`検査した内部リンク総数: ${checkedLinksCount} 件 (リンク切れ: ${brokenLinks} 件)`);
if (brokenLinks === 0) {
  console.log(`✅ 内部リンク切れは 0件 でした。\n`);
}

console.log('=== 実測検証完了 ===');
