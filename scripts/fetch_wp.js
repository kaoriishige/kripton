const fs = require('fs');
const https = require('https');
const path = require('path');

async function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, json: JSON.parse(data) });
        } catch(e) {
          resolve({ status: res.statusCode, headers: res.headers, text: data });
        }
      });
    }).on('error', reject);
  });
}

async function fetchAll(endpoint) {
  let page = 1;
  let all = [];
  const base = 'https://xn--bbkyao7065bpyck41as89d.com/wp-json/wp/v2';
  while(true) {
    const url = `${base}/${endpoint}?per_page=100&page=${page}`;
    console.log(`Requesting ${url}...`);
    const res = await fetchJson(url);
    if (res.status !== 200 || !Array.isArray(res.json)) {
      console.log(`Finished ${endpoint} with status ${res.status}`);
      break;
    }
    all = all.concat(res.json);
    const totalPages = parseInt(res.headers['x-wp-totalpages'] || '1', 10);
    const totalItems = parseInt(res.headers['x-wp-total'] || all.length, 10);
    console.log(`${endpoint}: page ${page}/${totalPages} fetched (${all.length}/${totalItems} items)`);
    if (page >= totalPages) break;
    page++;
  }
  return all;
}

async function run() {
  const dataDir = path.join(__dirname, '..', 'docs', 'raw-data');
  fs.mkdirSync(dataDir, { recursive: true });

  console.log('Fetching pages...');
  const pages = await fetchAll('pages');
  fs.writeFileSync(path.join(dataDir, 'pages.json'), JSON.stringify(pages, null, 2), 'utf-8');

  console.log('Fetching posts...');
  const posts = await fetchAll('posts');
  fs.writeFileSync(path.join(dataDir, 'posts.json'), JSON.stringify(posts, null, 2), 'utf-8');

  console.log('Fetching categories...');
  const categories = await fetchAll('categories');
  fs.writeFileSync(path.join(dataDir, 'categories.json'), JSON.stringify(categories, null, 2), 'utf-8');

  console.log('Fetching tags...');
  const tags = await fetchAll('tags');
  fs.writeFileSync(path.join(dataDir, 'tags.json'), JSON.stringify(tags, null, 2), 'utf-8');

  console.log('Fetching media...');
  const media = await fetchAll('media');
  fs.writeFileSync(path.join(dataDir, 'media.json'), JSON.stringify(media, null, 2), 'utf-8');

  console.log('--- Summary ---');
  console.log('Pages:', pages.length);
  console.log('Posts:', posts.length);
  console.log('Categories:', categories.length);
  console.log('Tags:', tags.length);
  console.log('Media:', media.length);
}

run().catch(console.error);
