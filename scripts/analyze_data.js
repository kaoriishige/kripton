const fs = require('fs');
const path = require('path');

const dataDir = path.join(__dirname, '..', 'docs', 'raw-data');
const docsDir = path.join(__dirname, '..', 'docs');

const pages = JSON.parse(fs.readFileSync(path.join(dataDir, 'pages.json'), 'utf8'));
const posts = JSON.parse(fs.readFileSync(path.join(dataDir, 'posts.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(dataDir, 'categories.json'), 'utf8'));
const tags = JSON.parse(fs.readFileSync(path.join(dataDir, 'tags.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(dataDir, 'media.json'), 'utf8'));

const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

// 1. docs/old-url-inventory.csv
// URL, Type, ID, Title, Slug, Date, Modified, Status, Category/Parent, Excerpt/Summary
let inventoryCsv = 'URL,Type,ID,Title,Slug,PublishedDate,ModifiedDate,Status,Categories\n';
function escapeCsv(str) {
  if (!str) return '""';
  return '"' + String(str).replace(/"/g, '""').replace(/\r?\n/g, ' ') + '"';
}

pages.forEach(p => {
  inventoryCsv += [
    escapeCsv(p.link),
    '固定ページ (Page)',
    p.id,
    escapeCsv(p.title.rendered),
    escapeCsv(p.slug),
    p.date,
    p.modified,
    p.status,
    p.parent ? `Parent: ${p.parent}` : 'None'
  ].join(',') + '\n';
});

posts.forEach(p => {
  const cats = (p.categories || []).map(cid => catMap[cid] || cid).join('; ');
  inventoryCsv += [
    escapeCsv(p.link),
    '投稿 (Post)',
    p.id,
    escapeCsv(p.title.rendered),
    escapeCsv(p.slug),
    p.date,
    p.modified,
    p.status,
    escapeCsv(cats)
  ].join(',') + '\n';
});

fs.writeFileSync(path.join(docsDir, 'old-url-inventory.csv'), inventoryCsv, 'utf8');

// 2. docs/image-migration-audit.csv
// ID, Title, SourceUrl, MediaDetails(width, height, fileSize), AltText, PostParent, AttachedTo
let imageCsv = 'MediaID,Title,SourceUrl,MimeType,Width,Height,AltText,AttachedPostID,Date\n';
media.forEach(m => {
  const details = m.media_details || {};
  imageCsv += [
    m.id,
    escapeCsv(m.title ? m.title.rendered : ''),
    escapeCsv(m.source_url),
    m.mime_type,
    details.width || '',
    details.height || '',
    escapeCsv(m.alt_text || ''),
    m.post || '',
    m.date
  ].join(',') + '\n';
});
fs.writeFileSync(path.join(docsDir, 'image-migration-audit.csv'), imageCsv, 'utf8');

console.log('Generated old-url-inventory.csv and image-migration-audit.csv');

// Analyze content types & structure
console.log('\n--- Categories Breakdown ---');
const catCount = {};
posts.forEach(p => {
  (p.categories || []).forEach(cid => {
    const name = catMap[cid] || cid;
    catCount[name] = (catCount[name] || 0) + 1;
  });
});
console.table(catCount);

console.log('\n--- Pages Summary ---');
pages.forEach(p => {
  console.log(`- [${p.id}] ${p.title.rendered} (${p.slug}) -> ${p.link}`);
});
