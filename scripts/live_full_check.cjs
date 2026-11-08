// scripts/live_full_check.cjs
// 本番ドメインのライブ総合検査スクリプト
const https = require('https');
const http = require('http');

function fetch(url, useHttp) {
  return new Promise((resolve) => {
    const lib = useHttp ? http : https;
    const req = lib.get(url, { timeout: 12000 }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', e => resolve({ status: 'ERR', body: e.message, headers: {} }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', body: '', headers: {} }); });
  });
}

async function main() {
  let pass = 0, fail = 0, warn = 0;
  const errors = [];
  const warnings = [];

  // ===== 1. 接続・noindex・リダイレクト =====
  console.log('\n========================================');
  console.log('1. 接続・HTTPS・noindex・リダイレクト検査');
  console.log('========================================');

  const baseChecks = [
    { url: 'https://mizumawari-kripton.com/', expectStatus: 200, expectNoNoindex: true, label: '正規URL（apex）' },
    { url: 'https://www.mizumawari-kripton.com/', expectStatus: 301, expectLocation: 'https://mizumawari-kripton.com/', label: 'www → 正規（301）' },
    { url: 'http://mizumawari-kripton.com/', expectStatus: 301, expectLocation: 'https://mizumawari-kripton.com/', label: 'HTTP → HTTPS（301）' },
    { url: 'https://fluffy-dango-c39273.netlify.app/', expectStatus: 200, expectNoindexHeader: true, label: '仮サイト（noindex必須）' },
  ];

  for (const check of baseChecks) {
    const isHttp = check.url.startsWith('http://');
    const r = await fetch(check.url, isHttp);
    const xRobots = r.headers['x-robots-tag'] || '';
    const statusOk = r.status === check.expectStatus;
    const locationOk = check.expectLocation ? (r.headers['location'] || '').startsWith(check.expectLocation) : true;
    const noindexHeaderOk = check.expectNoindexHeader ? xRobots.includes('noindex') : true;
    const noNoindexOk = check.expectNoNoindex ? !xRobots.includes('noindex') : true;

    const ok = statusOk && locationOk && noindexHeaderOk && noNoindexOk;
    const icon = ok ? '✅' : '❌';
    if (ok) pass++; else { fail++; errors.push(check.label + ': ' + check.url); }

    console.log(`${icon} ${check.label}`);
    console.log(`   URL: ${check.url}`);
    console.log(`   Status: ${r.status} (期待: ${check.expectStatus}) ${statusOk ? '✅' : '❌'}`);
    if (check.expectLocation) console.log(`   Location: ${r.headers['location'] || '(なし)'} ${locationOk ? '✅' : '❌'}`);
    console.log(`   X-Robots-Tag: ${xRobots || '(なし)'} ${(noindexHeaderOk && noNoindexOk) ? '✅' : '❌'}`);
    console.log('');
  }

  // ===== 2. robots.txt =====
  console.log('========================================');
  console.log('2. robots.txt 検査');
  console.log('========================================');
  const robots = await fetch('https://mizumawari-kripton.com/robots.txt');
  const robotsOk = robots.status === 200
    && robots.body.includes('User-agent: *')
    && robots.body.includes('Allow: /')
    && robots.body.includes('https://mizumawari-kripton.com/sitemap-index.xml')
    && !robots.body.includes('Disallow: /');
  if (robotsOk) { pass++; console.log('✅ robots.txt 正常'); }
  else { fail++; errors.push('robots.txt 異常'); console.log('❌ robots.txt 異常'); }
  console.log('   Status:', robots.status);
  console.log('   内容:\n' + robots.body.trim().split('\n').map(l=>'   '+l).join('\n'));
  console.log('');

  // ===== 3. sitemap =====
  console.log('========================================');
  console.log('3. sitemap-index.xml / sitemap-0.xml 検査');
  console.log('========================================');
  const sitemapIndex = await fetch('https://mizumawari-kripton.com/sitemap-index.xml');
  const sitemap0 = await fetch('https://mizumawari-kripton.com/sitemap-0.xml');
  const sitemapUrls = [...sitemap0.body.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
  const oldDomainUrls = sitemapUrls.filter(u =>
    u.includes('xn--bbkyao7065bpyck41as89d') ||
    u.includes('kripton-ai.netlify') ||
    u.includes('fluffy-dango')
  );
  const sitemapOk = sitemapIndex.status === 200 && sitemap0.status === 200
    && sitemapUrls.length >= 85 && oldDomainUrls.length === 0;
  if (sitemapOk) { pass++; console.log('✅ サイトマップ正常'); }
  else { fail++; errors.push('サイトマップ異常'); console.log('❌ サイトマップ異常'); }
  console.log('   sitemap-index.xml Status:', sitemapIndex.status);
  console.log('   sitemap-0.xml Status:', sitemap0.status);
  console.log('   掲載URL総数:', sitemapUrls.length);
  console.log('   旧ドメイン混入:', oldDomainUrls.length === 0 ? 'なし ✅' : '⚠️ ' + oldDomainUrls.join(', '));
  console.log('   全URL新ドメイン確認（先頭5件）:');
  sitemapUrls.slice(0, 5).forEach(u => console.log('     ', u));
  console.log('');

  // ===== 4. 重要ページ実測（15ページサンプル） =====
  console.log('========================================');
  console.log('4. 重要ページ実測（新公式ドメイン）');
  console.log('========================================');
  const pages = [
    { path: '/', label: 'トップページ' },
    { path: '/about/', label: '会社案内' },
    { path: '/pricing/', label: '料金案内' },
    { path: '/faq/', label: 'よくある質問' },
    { path: '/contact/', label: 'お問い合わせ' },
    { path: '/works/', label: '施工事例一覧' },
    { path: '/works/toilet-048/', label: '施工事例（toilet-048）' },
    { path: '/works/boiler-011/', label: '施工事例（boiler-011）' },
    { path: '/works/kitchen001/', label: '施工事例（kitchen001）' },
    { path: '/services/water-leak/', label: 'サービス：水漏れ' },
    { path: '/services/frozen-pipes/', label: 'サービス：凍結' },
    { path: '/services/drain/', label: 'サービス：排水つまり' },
    { path: '/services/faucet/', label: 'サービス：蛇口' },
    { path: '/areas/nasushiobara/', label: '地域：那須塩原市' },
    { path: '/areas/nasu/', label: '地域：那須町' },
    { path: '/areas/ohtawara/', label: '地域：大田原市' },
    { path: '/toilet/', label: 'トイレ' },
    { path: '/kitchen/', label: 'キッチン' },
    { path: '/bath/', label: 'お風呂' },
  ];

  let pagePass = 0, pageFail = 0;
  for (const p of pages) {
    const url = 'https://mizumawari-kripton.com' + p.path;
    const r = await fetch(url, false);
    const xRobots = r.headers['x-robots-tag'] || '';
    const hasNoindex = xRobots.includes('noindex');
    const titleMatch = r.body.match(/<title>(.*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].slice(0, 45) : '(取得失敗)';
    const canonicalMatch = r.body.match(/rel="canonical"\s+href="([^"]+)"/);
    const canonical = canonicalMatch ? canonicalMatch[1] : '(なし)';
    const canonicalOk = canonical.startsWith('https://mizumawari-kripton.com');
    const ok = r.status === 200 && !hasNoindex && canonicalOk;
    if (ok) pagePass++; else { pageFail++; errors.push('ページ異常: ' + p.path + ' status=' + r.status); }
    const icon = ok ? '✅' : '❌';
    const noindexStr = hasNoindex ? '⚠️noindex' : 'OK';
    const canonStr = canonicalOk ? '✅' : '❌' + canonical;
    console.log(`${icon} [${r.status}] ${p.label} | noindex:${noindexStr} | canonical:${canonStr}`);
  }
  if (pageFail === 0) { pass++; console.log(`\n✅ 重要ページ全${pagePass}件: 全てHTTP200・noindexなし・canonical正常`); }
  else { fail++; console.log(`\n❌ 重要ページ検査: ${pageFail}件エラー`); }
  console.log('');

  // ===== 5. 施工事例サンプル実測 =====
  console.log('========================================');
  console.log('5. 施工事例サンプル実測（10件）');
  console.log('========================================');
  const worksSamples = [
    '/works/toilet001/', '/works/toilet-040/', '/works/toilet-048/',
    '/works/boiler001/', '/works/boiler-011/',
    '/works/kitchen001/', '/works/kitchen-005/',
    '/works/bath001/', '/works/sink-area001/', '/works/pump-001/'
  ];
  let worksPass = 0, worksFail = 0;
  for (const path of worksSamples) {
    const url = 'https://mizumawari-kripton.com' + path;
    const r = await fetch(url, false);
    const xRobots = r.headers['x-robots-tag'] || '';
    const hasNoindex = xRobots.includes('noindex');
    const hasJsonLd = r.body.includes('"@type":"Article"') || r.body.includes('"@type": "Article"');
    const ok = r.status === 200 && !hasNoindex;
    if (ok) worksPass++; else { worksFail++; errors.push('施工事例異常: ' + path); }
    const icon = ok ? '✅' : '❌';
    console.log(`${icon} [${r.status}] ${path} | noindex:${hasNoindex ? '⚠️' : 'OK'} | JSON-LD:${hasJsonLd ? '✅' : '❌'}`);
  }
  if (worksFail === 0) { pass++; console.log(`\n✅ 施工事例サンプル全${worksPass}件正常`); }
  else { fail++; console.log(`\n❌ 施工事例サンプル: ${worksFail}件エラー`); }
  console.log('');

  // ===== 6. 電話リンク・お問い合わせフォーム =====
  console.log('========================================');
  console.log('6. 電話リンク・お問い合わせフォーム検査');
  console.log('========================================');
  const top = await fetch('https://mizumawari-kripton.com/', false);
  const hasPhoneLink = top.body.includes('tel:');
  const contact = await fetch('https://mizumawari-kripton.com/contact/', false);
  const hasNetlifyForm = contact.body.includes('data-netlify') || contact.body.includes('netlify');
  const hasFormTag = contact.body.includes('<form');
  console.log('  電話リンク（tel:）:', hasPhoneLink ? '✅ あり' : '❌ なし');
  console.log('  お問い合わせフォーム（<form）:', hasFormTag ? '✅ あり' : '❌ なし');
  console.log('  Netlify Forms属性:', hasNetlifyForm ? '✅ data-netlify設定済み' : '❌ なし');
  if (hasPhoneLink && hasFormTag && hasNetlifyForm) { pass++; console.log('  ✅ 電話・フォーム: 正常'); }
  else { fail++; errors.push('電話リンク・フォーム異常'); console.log('  ❌ 電話・フォーム: 異常'); }
  console.log('');

  // ===== 7. JSON-LD構造化データ確認（トップ） =====
  console.log('========================================');
  console.log('7. JSON-LD構造化データ検査（トップ）');
  console.log('========================================');
  const topPage = await fetch('https://mizumawari-kripton.com/', false);
  const jsonLdMatches = [...topPage.body.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  console.log('  JSON-LDブロック数:', jsonLdMatches.length);
  let jsonLdOk = true;
  for (const m of jsonLdMatches) {
    try {
      const obj = JSON.parse(m[1]);
      const type = Array.isArray(obj) ? obj.map(o=>o['@type']).join(',') : obj['@type'];
      const urlVal = obj.url || (Array.isArray(obj) ? '' : '');
      const hasOldDomain = m[1].includes('xn--bbkyao7065bpyck41as89d') || m[1].includes('kripton-ai.netlify');
      console.log('  @type:', type, hasOldDomain ? '⚠️旧ドメイン混入' : '✅');
      if (hasOldDomain) { jsonLdOk = false; errors.push('JSON-LD旧ドメイン混入'); }
    } catch(e) {
      console.log('  ❌ JSON-LD解析エラー:', e.message);
      jsonLdOk = false;
    }
  }
  if (jsonLdOk && jsonLdMatches.length > 0) { pass++; console.log('  ✅ JSON-LD正常'); }
  else { fail++; }
  console.log('');

  // ===== 最終結果 =====
  console.log('========================================');
  console.log('最終検査結果サマリー');
  console.log('========================================');
  console.log(`PASS: ${pass} / FAIL: ${fail}`);
  if (errors.length > 0) {
    console.log('\n❌ エラー一覧:');
    errors.forEach(e => console.log('  -', e));
  }
  if (warnings.length > 0) {
    console.log('\n⚠️ 警告:');
    warnings.forEach(w => console.log('  -', w));
  }
  if (fail === 0) {
    console.log('\n🎉 最終判定: PASS - 旧制作業者に301転送を依頼できる状態です');
  } else {
    console.log('\n⛔ 最終判定: FAIL - 未解決エラーあり。上記エラーを確認してください');
  }
}

main().catch(e => { console.error('スクリプトエラー:', e); process.exit(1); });

