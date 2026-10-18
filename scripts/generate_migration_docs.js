const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'docs', 'raw-data');
const docsDir = path.join(__dirname, '..', 'docs');

const pages = JSON.parse(fs.readFileSync(path.join(dataDir, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

function escapeCsv(str) {
  if (!str) return '""';
  return '"' + String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
}

// 1. docs/old-to-new-url-map.csv
// OldUrl, OldTitle, Type, NewUrl, Action, 301RedirectRequired, Note
let mapCsv = 'OldUrl,OldTitle,Type,NewUrl,Action,301RedirectRequired,Note\n';

const pageSlugToNew = {
  'top': '/',
  'about': '/about/',
  'emergency': '/emergency/',
  'feature': '/feature/',
  'flow': '/flow/',
  'inspection': '/inspection/',
  'contact': '/contact/',
  'privacy': '/privacy/',
  'toilet': '/services/toilet/',
  'bath': '/services/bath/',
  'ketchen': '/services/kitchen/',
  'washroom': '/services/washroom/',
  'eco-cute': '/services/eco-cute/',
  'pump': '/services/pump/',
  'other-reform': '/services/other-reform/'
};

pages.forEach(p => {
  const newPath = pageSlugToNew[p.slug] || `/${p.slug}/`;
  const isRedirect = (p.slug === 'top' || p.link === 'https://xn--bbkyao7065bpyck41as89d.com/') ? 'No' : 'Yes';
  mapCsv += [
    escapeCsv(p.link),
    escapeCsv(p.title.rendered),
    '固定ページ',
    escapeCsv(newPath),
    'URL整理・リニューアル移植',
    isRedirect,
    escapeCsv(`旧スラッグ: ${p.slug}`)
  ].join(',') + '\n';
});

posts.forEach(p => {
  const cats = (p.categories || []).map(cid => catMap[cid] || cid).join('; ');
  let newPath = '';
  let action = '';
  if (cats.includes('イベント情報')) {
    newPath = `/news/${p.slug}/`;
    action = 'お知らせ・イベント記事として移植';
  } else {
    newPath = `/works/${p.slug}/`;
    action = '施工事例として移植';
  }
  mapCsv += [
    escapeCsv(p.link),
    escapeCsv(p.title.rendered),
    '投稿記事',
    escapeCsv(newPath),
    action,
    'Yes',
    escapeCsv(`カテゴリ: ${cats}`)
  ].join(',') + '\n';
});

fs.writeFileSync(path.join(docsDir, 'old-to-new-url-map.csv'), mapCsv, 'utf8');

// 2. docs/content-migration-audit.csv
// ID, ContentType, OldTitle, OldUrl, NewUrl, MigrationStatus, DataCompleteness, ActionRequired
let auditCsv = 'ID,ContentType,OldTitle,OldUrl,NewUrl,MigrationStatus,DataCompleteness,ActionRequired\n';

pages.forEach(p => {
  const newPath = pageSlugToNew[p.slug] || `/${p.slug}/`;
  auditCsv += [
    p.id,
    '固定ページ',
    escapeCsv(p.title.rendered),
    escapeCsv(p.link),
    escapeCsv(newPath),
    '抽出完了・新デザインへ移植準備',
    'HTML・テキスト取得済（100%）',
    '新UIコンポーネントへの当て込み・最新確認'
  ].join(',') + '\n';
});

posts.forEach(p => {
  const cats = (p.categories || []).map(cid => catMap[cid] || cid).join('; ');
  const isNews = cats.includes('イベント情報');
  const newPath = isNews ? `/news/${p.slug}/` : `/works/${p.slug}/`;
  auditCsv += [
    p.id,
    isNews ? 'お知らせ' : '施工事例',
    escapeCsv(p.title.rendered),
    escapeCsv(p.link),
    escapeCsv(newPath),
    '抽出完了・Markdown変換準備',
    'HTML・テキスト・画像リンク取得済（100%）',
    'Astro Content Collectionスキーマへマッピング'
  ].join(',') + '\n';
});

fs.writeFileSync(path.join(docsDir, 'content-migration-audit.csv'), auditCsv, 'utf8');

console.log('Generated old-to-new-url-map.csv and content-migration-audit.csv');
