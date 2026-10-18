// scripts/generate_url_mapping_table.cjs
const fs = require('fs');
const posts = JSON.parse(fs.readFileSync('docs/raw-data/posts.json', 'utf8'));

let markdown = '# 既存WordPress公開URLと新サイトURL 完全対応表\n\n';
markdown += '| No | 旧WordPress URL | 新サイトURL | リダイレクト種別 | 備考・ステータス |\n';
markdown += '|:---:|---|---|:---:|---|\n';

// 固定ページ
const staticPages = [
  { old: '/', new: '/', type: '301 / 直接移行', note: 'トップページ' },
  { old: '/about/', new: '/about/', type: '301 / 直接移行', note: '会社概要' },
  { old: '/contact/', new: '/contact/', type: '301 / 直接移行', note: 'お問い合わせ' },
  { old: '/emergency/', new: '/contact/', type: '301 リダイレクト', note: '緊急受付・電話案内' },
  { old: '/ketchen/', new: '/kitchen/', type: '301 リダイレクト', note: '旧タイポURL' },
  { old: '/works/', new: '/works/', type: '301 / 直接移行', note: '施工事例一覧' },
];

let counter = 1;
staticPages.forEach(p => {
  markdown += `| ${counter++} | \`${p.old}\` | [${p.new}](${p.new}) | ${p.type} | ${p.note} |\n`;
});

posts.forEach(p => {
  const isCase = !p.slug.startsWith('event-') && !p.slug.startsWith('kuriputon-matsuri-');
  let newSlug = p.slug;
  if (p.slug.includes('%') || String(p.id) === '316') {
    newSlug = 'case-316';
  }
  const oldUrl = `/${p.slug}/`;
  const newUrl = isCase ? `/works/${newSlug}/` : `/news/${newSlug}/`;
  const note = isCase ? `施工事例 (${p.title.rendered.substring(0, 20)}...)` : `イベント・お知らせ (${p.title.rendered.substring(0, 15)}...)`;
  markdown += `| ${counter++} | \`${oldUrl}\` | [${newUrl}](${newUrl}) | 301 リダイレクト | ${note} |\n`;
});

fs.writeFileSync('docs/wordpress_url_mapping.md', markdown, 'utf8');
console.log(`URL対応表生成完了: 計 ${counter - 1} 件を docs/wordpress_url_mapping.md に保存しました！`);
