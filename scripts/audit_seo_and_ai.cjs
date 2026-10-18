const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, '../dist');

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
console.log(`Auditing ${htmlFiles.length} HTML files...`);

const report = {
  totalHtmlPages: htmlFiles.length,
  missingTitle: [],
  missingDescription: [],
  missingCanonical: [],
  missingOgTags: [],
  missingJsonLd: [],
  multipleH1: [],
  noH1: [],
  imagesWithoutAlt: 0,
  totalImages: 0,
  telLinks: {
    validTelCount: 0,
    invalidTelCount: 0
  }
};

htmlFiles.forEach(file => {
  const relPath = path.relative(distDir, file).replace(/\\/g, '/');
  const html = fs.readFileSync(file, 'utf8');

  // Title check
  const titleMatch = html.match(/<title[^>]*>(.*?)<\/title>/is);
  if (!titleMatch || !titleMatch[1].trim()) {
    report.missingTitle.push(relPath);
  }

  // Description check
  const descMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/is);
  if (!descMatch || !descMatch[1].trim()) {
    report.missingDescription.push(relPath);
  }

  // Canonical check
  const canMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/is);
  if (!canMatch || !canMatch[1].trim()) {
    report.missingCanonical.push(relPath);
  }

  // OGP check
  const ogTitle = html.match(/<meta[^>]*property=["']og:title["']/is);
  const ogImage = html.match(/<meta[^>]*property=["']og:image["']/is);
  if (!ogTitle || !ogImage) {
    report.missingOgTags.push(relPath);
  }

  // JSON-LD check
  const jsonLdMatch = html.match(/<script[^>]*type=["']application\/ld\+json["'][^>]*>(.*?)<\/script>/is);
  if (!jsonLdMatch) {
    report.missingJsonLd.push(relPath);
  }

  // H1 check
  const h1Matches = html.match(/<h1[^>]*>.*?<\/h1>/gis) || [];
  if (h1Matches.length === 0) {
    report.noH1.push(relPath);
  } else if (h1Matches.length > 1) {
    report.multipleH1.push(`${relPath} (${h1Matches.length})`);
  }

  // Image alt check
  const imgMatches = html.matchAll(/<img\s+([^>]*?)>/gis);
  for (const match of imgMatches) {
    report.totalImages++;
    const attrs = match[1];
    if (!attrs.includes('alt=') || attrs.match(/alt=["']\s*["']/)) {
      report.imagesWithoutAlt++;
    }
  }

  // Tel link check
  const telMatches = html.matchAll(/href=["']tel:([^"']+)["']/gis);
  for (const match of telMatches) {
    const num = match[1].replace(/[-]/g, '');
    if (num === '0287605050' || num === '09024636638') {
      report.telLinks.validTelCount++;
    } else {
      report.telLinks.invalidTelCount++;
    }
  }
});

// Check AI files
const hasRobots = fs.existsSync(path.join(__dirname, '../public/robots.txt'));
const hasLlms = fs.existsSync(path.join(__dirname, '../public/llms.txt'));
const hasRedirects = fs.existsSync(path.join(__dirname, '../public/_redirects'));

console.log('--- AUDIT RESULTS ---');
console.log(`Total Pages: ${report.totalHtmlPages}`);
console.log(`Missing Title: ${report.missingTitle.length}`);
console.log(`Missing Description: ${report.missingDescription.length}`);
console.log(`Missing Canonical: ${report.missingCanonical.length}`);
console.log(`Missing OGP: ${report.missingOgTags.length}`);
console.log(`Missing JSON-LD: ${report.missingJsonLd.length}`);
console.log(`No H1: ${report.noH1.length}`);
console.log(`Multiple H1: ${report.multipleH1.length}`);
console.log(`Total Images Scanned: ${report.totalImages}`);
console.log(`Images Missing Alt: ${report.imagesWithoutAlt}`);
console.log(`Valid Tel Links: ${report.telLinks.validTelCount}`);
console.log(`Invalid Tel Links: ${report.telLinks.invalidTelCount}`);
console.log(`Robots.txt exists: ${hasRobots}`);
console.log(`llms.txt exists: ${hasLlms}`);
console.log(`_redirects exists: ${hasRedirects}`);

fs.writeFileSync(path.join(__dirname, '../docs/seo-ai-audit-results.json'), JSON.stringify({
  report,
  hasRobots,
  hasLlms,
  hasRedirects,
  timestamp: new Date().toISOString()
}, null, 2));
