const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');
const siteUrl = 'https://xn--bbkyao7065bpyck41as89d.com';

function getAllHtmlFiles(dir, fileList = []) {
  if (!fs.existsSync(dir)) return fileList;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllHtmlFiles(fullPath, fileList);
    } else if (file.endsWith('.html')) {
      fileList.push(fullPath);
    }
  }
  return fileList;
}

const htmlFiles = getAllHtmlFiles(distDir);
console.log(`Generating sitemap for ${htmlFiles.length} pages...`);

const urls = [];
const today = new Date().toISOString().split('T')[0];

htmlFiles.forEach(file => {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  let urlPath = '/' + relPath.replace(/index\.html$/, '').replace(/\.html$/, '');
  if (!urlPath.endsWith('/') && urlPath !== '') urlPath += '/';
  if (urlPath === '//') urlPath = '/';

  // Exclude preview or sample if desired, but keep preview internal if needed
  if (urlPath.includes('/preview/')) return;

  let priority = '0.7';
  let changefreq = 'weekly';

  if (urlPath === '/') {
    priority = '1.0';
    changefreq = 'daily';
  } else if (urlPath.startsWith('/services/') || urlPath.startsWith('/toilet/') || urlPath.startsWith('/pricing/')) {
    priority = '0.9';
    changefreq = 'weekly';
  } else if (urlPath.startsWith('/areas/')) {
    priority = '0.9';
    changefreq = 'weekly';
  } else if (urlPath.startsWith('/works/')) {
    priority = '0.8';
    changefreq = 'weekly';
  }

  urls.push({
    loc: `${siteUrl}${urlPath}`,
    lastmod: today,
    changefreq,
    priority
  });
});

const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

const sitemapIndexXml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${siteUrl}/sitemap-0.xml</loc>
    <lastmod>${today}</lastmod>
  </sitemap>
</sitemapindex>`;

// Save to dist and public
fs.writeFileSync(path.join(distDir, 'sitemap-0.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(distDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf8');
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), sitemapXml, 'utf8');

const publicDir = path.join(__dirname, '../public');
fs.writeFileSync(path.join(publicDir, 'sitemap-0.xml'), sitemapXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'sitemap-index.xml'), sitemapIndexXml, 'utf8');
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), sitemapXml, 'utf8');

console.log(`Successfully generated sitemaps with ${urls.length} indexed URLs!`);
