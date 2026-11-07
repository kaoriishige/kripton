const fs = require('fs');
const path = require('path');

// 1. 旧WordPressの全URL一覧を読み込む
const oldInventoryCsv = fs.readFileSync('docs/old-url-inventory.csv', 'utf8');
const oldLines = oldInventoryCsv.split('\n').filter(l => l.trim().length > 0);

// 施工事例slug一覧
const casesFile = 'src/data/all_cases.ts';
const casesContent = fs.readFileSync(casesFile, 'utf8');
const match = casesContent.match(/export const allCasesData:\s*CaseStudy(?:Item)?\[\]\s*=\s*(\[[\s\S]*?\]);/);
const cases = match ? eval(match[1]) : [];
const caseSlugs = new Set(cases.map(c => c.slug));

console.log('Total case studies:', cases.length);

// マッピング定義
// 旧ドメイン: https://xn--bbkyao7065bpyck41as89d.com
// 新ドメイン: https://mizumawari-kripton.com

const mappingTable = [];

// 固定ページ
const staticPageMap = {
  '/': '/',
  '/pump/': '/pump/',
  '/other-reform/': '/other-reform/',
  '/inspection/': '/inspection/',
  '/eco-cute/': '/eco-cute/',
  '/about/': '/about/',
  '/privacy/': '/privacy/',
  '/emergency/': '/contact/',
  '/contact/': '/contact/',
  '/flow/': '/flow/',
  '/feature/': '/feature/',
  '/toilet/': '/toilet/',
  '/washroom/': '/washroom/',
  '/bath/': '/bath/',
  '/ketchen/': '/kitchen/'
};

// イベント・お知らせ記事（内容に関連する新ページへ）
const eventPageMap = {
  '/event-20251204/': '/services/frozen-pipes/', // 冬季水道管凍結注意
  '/event-20231122/': '/services/frozen-pipes/', // 水道管凍結注意
  '/event-20260113/': '/eco-cute/',              // 給湯器発火寸前
  '/kuriputon-matsuri-2026/': '/about/',         // クリプトン祭
  '/event-20250530/': '/kitchen/',               // キッチン＆バス展示会
  '/event-20241123-2/': '/about/',               // クリプトンおまつり
  '/event-20241123/': '/about/',                 // クリプトンおまつリ
  '/event-20240614/': '/kitchen/',               // キッチン＆バス展示会
  '/event-20230916/': '/about/',                 // クリプトン特別感謝祭
  '/event-20220701/': '/other-reform/',          // エアコン清掃
  '/event-20200701/': '/pricing/',               // 夏のキャンペーン
  '/event-20191101/': '/kitchen/',               // クリナップ70周年感謝フェア
  '/event-20190701/': '/toilet/',                // 水洗トイレ交換フェア
  '/event-20181202/': '/about/',                 // わくわく感謝祭
  '/event-20180629/': '/about/',                 // 体感フェア
  '/event-20180325/': '/about/',                 // 感謝祭
  '/event-20171125/': '/about/',                 // わくわく感謝祭
  '/event-20170401/': '/bath/',                  // 展示会
  '/event-20161126/': '/about/'                  // リフォーム祭り
};

for (let i = 1; i < oldLines.length; i++) {
  const line = oldLines[i];
  const parts = [];
  let inQuote = false;
  let cur = '';
  for (let c = 0; c < line.length; c++) {
    const ch = line[c];
    if (ch === '"') inQuote = !inQuote;
    else if (ch === ',' && !inQuote) { parts.push(cur); cur = ''; }
    else cur += ch;
  }
  parts.push(cur);

  const oldUrl = parts[0].replace(/"/g, '');
  const title = parts[1].replace(/"/g, '');
  const type = parts[2].replace(/"/g, '');
  const slug = parts[3].replace(/"/g, '');

  let oldPath = '/' + slug;
  if (!oldPath.endsWith('/') && slug !== '') oldPath += '/';
  if (oldPath === '//') oldPath = '/';

  let newPath = '';
  let note = '';

  if (staticPageMap[oldPath]) {
    newPath = staticPageMap[oldPath];
    note = '固定ページ移行';
  } else if (eventPageMap[oldPath]) {
    newPath = eventPageMap[oldPath];
    note = 'イベント/告知記事（関連サービス・会社案内へ転送）';
  } else if (caseSlugs.has(slug)) {
    newPath = `/works/${slug}/`;
    note = '施工事例（1対1完全対応）';
  } else if (slug === 'トイレ修理の値段は？６項目を徹底調査してみた' || oldUrl.includes('%e3%83%88%e3%82%a4%e3%83%ac')) {
    newPath = '/works/case-316/';
    note = '施工事例（日本語スラッグ対応）';
  } else {
    newPath = '/';
    note = 'その他トップ転送';
  }

  mappingTable.push({
    oldUrl,
    oldPath,
    title,
    type,
    slug,
    newPath,
    newUrl: `https://mizumawari-kripton.com${newPath}`,
    note
  });
}

console.log('Mapping table generated, count:', mappingTable.length);

// 2. docs/old-to-new-url-map.csv を更新
const csvRows = [
  'OldUrl,OldTitle,Type,NewUrl,Action,301RedirectRequired,Note'
];
mappingTable.forEach(row => {
  const req = row.newPath !== '/' || row.oldPath !== '/' ? 'Yes' : 'No';
  csvRows.push(`"${row.oldUrl}","${row.title}","${row.type}","${row.newPath}","URL移行・正規化","${req}","${row.note}"`);
});
fs.writeFileSync('docs/old-to-new-url-map.csv', csvRows.join('\n'), 'utf8');

// 3. public/_redirects を更新
const redirectRules = [
  '# 旧サンプルURLのリダイレクト',
  '/works/sample  /works/  301!',
  '/services/sample  /#services  301!',
  '',
  '# 旧WordPress 固定ページURLの正規化',
  '/ketchen/  /kitchen/  301',
  '/emergency/  /contact/  301',
  '',
  '# 旧WordPress イベント・お知らせ記事（内容に関連する新ページへ個別転送）'
];

for (const [k, v] of Object.entries(eventPageMap)) {
  redirectRules.push(`${k}  ${v}  301`);
}

redirectRules.push('');
redirectRules.push('# 旧施工事例（全64件）を新施工事例URLへ301転送');
redirectRules.push('/%e3%83%88%e3%82%a4%e3%83%ac%e4%bf%ae%e7%90%86%e3%81%ae%e5%80%a4%e6%ae%b5%e3%81%af%ef%bc%9f%ef%bc%96%e9%a0%85%e7%9b%ae%e3%82%92%e5%be%b9%e5%ba%95%e8%aa%bf%e6%9f%bb%e3%81%97%e3%81%a6%e3%81%bf%e3%81%9f/  /works/case-316/  301');
redirectRules.push('/%25e3%2583%2588%25e3%2582%25a4%25e3%2583%25ac%25e4%25bf%25ae%25e7%2590%2586%25e3%2581%25ae%25e5%2580%25a4%25e6%25ae%25b5%25e3%2581%25af%25ef%25bc%259f%25ef%25bc%2596%25e9%25a0%2585%25e7%259b%25ae%25e3%2582%2592%25e5%25be%25b9%25e5%25ba%2595%25e8%25aa%25bf%25e6%259f%25bb%25e3%2581%2597%25e3%2581%25a6%25e3%2581%25bf%25e3%2581%259f/  /works/case-316/  301');

cases.forEach(c => {
  if (c.slug !== 'case-316') {
    redirectRules.push(`/${c.slug}/  /works/${c.slug}/  301`);
  }
});

redirectRules.push('');
redirectRules.push('# 404フォールバック');
redirectRules.push('/*  /404.html  404');

fs.writeFileSync('public/_redirects', redirectRules.join('\n'), 'utf8');

// 4. 旧業者提出用 .htaccess 記述生成
const htaccessLines = [
  '# =========================================================================',
  '# 水まわり専門店クリプトン 旧ドメイン → 新ドメイン 301リダイレクト設定 (.htaccess)',
  '# 旧ドメイン: https://xn--bbkyao7065bpyck41as89d.com/ (水まわり専門店クリプトン.com)',
  '# 新ドメイン: https://mizumawari-kripton.com/',
  '# =========================================================================',
  '',
  '<IfModule mod_rewrite.c>',
  'RewriteEngine On',
  'RewriteBase /',
  '',
  '# --- 1. 固定ページ・主要サービスページ転送 ---'
];

mappingTable.filter(r => r.type === '固定ページ').forEach(r => {
  if (r.oldPath === '/') return;
  const oldPattern = '^' + r.oldPath.replace(/^\//, '').replace(/\/$/, '') + '/?$';
  htaccessLines.push(`RewriteRule ${oldPattern} https://mizumawari-kripton.com${r.newPath} [R=301,L]`);
});

htaccessLines.push('');
htaccessLines.push('# --- 2. イベント・告知記事転送（関連サービス・会社案内へ） ---');
mappingTable.filter(r => r.type === '投稿記事' && r.note.includes('イベント')).forEach(r => {
  const oldPattern = '^' + r.oldPath.replace(/^\//, '').replace(/\/$/, '') + '/?$';
  htaccessLines.push(`RewriteRule ${oldPattern} https://mizumawari-kripton.com${r.newPath} [R=301,L]`);
});

htaccessLines.push('');
htaccessLines.push('# --- 3. 施工事例（全64件 1対1完全個別転送） ---');
mappingTable.filter(r => r.type === '投稿記事' && r.note.includes('施工事例')).forEach(r => {
  if (r.oldUrl.includes('%e3%83%88%e3%82%a4%e3%83%ac')) {
    htaccessLines.push(`RewriteRule ^.*%e3%83%88%e3%82%a4%e3%83%ac.*$ https://mizumawari-kripton.com/works/case-316/ [R=301,L]`);
    htaccessLines.push(`RewriteRule ^.*トイレ修理の値段は.*$ https://mizumawari-kripton.com/works/case-316/ [R=301,NE,L]`);
  } else {
    const oldPattern = '^' + r.oldPath.replace(/^\//, '').replace(/\/$/, '') + '/?$';
    htaccessLines.push(`RewriteRule ${oldPattern} https://mizumawari-kripton.com${r.newPath} [R=301,L]`);
  }
});

htaccessLines.push('');
htaccessLines.push('# --- 4. トップページおよび上記以外の未指定URLのフォールバック転送 ---');
htaccessLines.push('RewriteRule ^(.*)$ https://mizumawari-kripton.com/$1 [R=301,L]');
htaccessLines.push('</IfModule>');

fs.writeFileSync('docs/301-redirect-rules-for-old-vendor.txt', htaccessLines.join('\n'), 'utf8');

// 5. 旧業者提出用 Markdown 転送対応表ドキュメント生成
const mdReport = [
  '# 旧公式ドメインから新公式ドメインへの 301リダイレクト対応表',
  '',
  '- **旧公式ドメイン**: `https://xn--bbkyao7065bpyck41as89d.com/` (水まわり専門店クリプトン.com)',
  '- **新公式ドメイン**: `https://mizumawari-kripton.com/`',
  '- **作成日**: 2026年11月7日',
  '- **目的**: 旧制作業者様にて旧サーバー（Apache/.htaccessまたはNginx等）で新サイトへ301恒久転送を実施いただくための設定資料',
  '',
  '## 転送設計の基本方針',
  '1. **施工事例（64件）**: 旧WordPressの個別URLから、新サイトの対応する各施工事例詳細ページ（`/works/[slug]/`）へ1対1で301転送します。',
  '2. **固定ページ**: 会社案内、問い合わせ、各水まわり設備ページ等の対応ページへ1対1で転送します。',
  '3. **イベント・告知記事**: 冬季水道管凍結注意は凍結専門ページへ、給湯器注意は給湯器ページへ、展示会・おまつり等は会社案内や関連ページへ適切に引き継ぎます（無関係なページへの一括トップ転送は行いません）。',
  '',
  '## 301リダイレクト対応表 一覧（全98URL）',
  '',
  '| No | 旧URL | ページ種別 | ページタイトル | 新URL（転送先） | 転送区分 |',
  '|:---|:---|:---|:---|:---|:---|'
];

mappingTable.forEach((r, idx) => {
  mdReport.push(`| ${idx + 1} | \`${r.oldUrl}\` | ${r.type} | ${r.title} | \`${r.newUrl}\` | ${r.note} |`);
});

mdReport.push('');
mdReport.push('## Apache用 .htaccess 記述例（コピペ用）');
mdReport.push('```apache');
mdReport.push(htaccessLines.join('\n'));
mdReport.push('```');

fs.writeFileSync('docs/301-redirect-mapping-table.md', mdReport.join('\n'), 'utf8');

console.log('Successfully generated all migration & 301 redirect files!');

