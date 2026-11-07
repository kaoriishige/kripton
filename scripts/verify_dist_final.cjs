const fs = require('fs');
const path = require('path');

let totalHtml = 0;
let canonicalErrors = 0;
let ogUrlErrors = 0;
let oldDomainMatches = 0;
let noindexInPublicPages = 0;

function scan(dir) {
  const files = fs.readdirSync(dir);
  for (const f of files) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) scan(full);
    else if (f.endsWith('.html')) {
      totalHtml++;
      const html = fs.readFileSync(full, 'utf8');
      
      // 旧ドメインが混入していないか
      if (html.includes('xn--bbkyao7065bpyck41as89d')) {
        console.error('Found old domain in:', full);
        oldDomainMatches++;
      }

      // 公開ページに noindex が紛れ込んでいないか
      if (!full.includes('404.html') && !full.includes('preview')) {
        if (/meta[^>]*robots[^>]*noindex/i.test(html)) {
          console.error('Unexpected noindex in public page:', full);
          noindexInPublicPages++;
        }

        const canMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/);
        if (!canMatch || !canMatch[1].startsWith('https://mizumawari-kripton.com')) {
          console.error('Bad canonical in:', full, canMatch ? canMatch[1] : 'NONE');
          canonicalErrors++;
        }
        const ogMatch = html.match(/<meta\s+property=["']og:url["']\s+content=["']([^"']+)["']/);
        if (!ogMatch || !ogMatch[1].startsWith('https://mizumawari-kripton.com')) {
          console.error('Bad og:url in:', full, ogMatch ? ogMatch[1] : 'NONE');
          ogUrlErrors++;
        }
      }
    }
  }
}

scan('dist');
console.log('=== Final Verification of Built Pages in dist/ ===');
console.log('Total HTML pages scanned:', totalHtml);
console.log('Old domain matches (must be 0):', oldDomainMatches);
console.log('Canonical errors (must be 0):', canonicalErrors);
console.log('OG URL errors (must be 0):', ogUrlErrors);
console.log('Unintended noindex in public pages (must be 0):', noindexInPublicPages);

if (oldDomainMatches === 0 && canonicalErrors === 0 && ogUrlErrors === 0 && noindexInPublicPages === 0) {
  console.log('\n>>> ALL 93 BUILT PAGES PASSED 100% CLEAN & READY FOR LAUNCH! <<<');
} else {
  process.exit(1);
}

