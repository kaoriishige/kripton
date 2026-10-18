const fs = require('fs');
const https = require('https');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'raw-data', 'posts.json'), 'utf8'));
const media = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'raw-data', 'media.json'), 'utf8'));

// 出力先ディレクトリ
const destDir = path.join(__dirname, '..', 'public', 'images', 'works');
fs.mkdirSync(destDir, { recursive: true });

// 各投稿に紐付く主要な施工写真URLを収集
// 1. 本文中の画像URL
// 2. featured_media
// 3. media.jsonの中でpostに紐づいているもの
const urlToFilename = new Map();
const postToImages = {};

const imgRegex = /https?:\/\/[^\s"'<>]+\.(?:jpg|jpeg|png|webp)/gi;

posts.forEach(p => {
  const images = [];
  // 本文から
  const matches = (p.content?.rendered || '').match(imgRegex) || [];
  matches.forEach(u => {
    // xn--bbkyao7065bpyck41as89d.com 内の画像のみ
    if (u.includes('xn--bbkyao7065bpyck41as89d.com') || u.includes('wp-content')) {
      images.push(u);
    }
  });

  // media.json から紐付きを探索
  media.filter(m => m.post === p.id).forEach(m => {
    if (m.source_url) images.push(m.source_url);
  });

  // 重複除去
  const uniqueImages = [...new Set(images)];
  postToImages[p.id] = uniqueImages;

  uniqueImages.forEach(u => {
    try {
      const parsed = new URL(u);
      const filename = path.basename(parsed.pathname);
      urlToFilename.set(u, filename);
    } catch(e) {}
  });
});

console.log(`Total unique works images to download: ${urlToFilename.size}`);

function download(url, filename) {
  return new Promise((resolve) => {
    const dest = path.join(destDir, filename);
    if (fs.existsSync(dest) && fs.statSync(dest).size > 0) {
      return resolve({ success: true, cached: true });
    }
    const file = fs.createWriteStream(dest);
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, (res) => {
      if (res.statusCode !== 200) {
        file.close();
        fs.unlink(dest, () => {});
        return resolve({ success: false, status: res.statusCode });
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve({ success: true, cached: false });
      });
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      resolve({ success: false, error: err.message });
    });
  });
}

async function run() {
  const entries = Array.from(urlToFilename.entries());
  console.log(`Starting download of ${entries.length} images...`);
  let count = 0;
  let successCount = 0;

  for (const [url, filename] of entries) {
    const res = await download(url, filename);
    if (res.success) successCount++;
    count++;
    if (count % 20 === 0 || count === entries.length) {
      console.log(`Progress: ${count}/${entries.length} (Saved: ${successCount})`);
    }
  }

  // 投稿とダウンロード画像の対応マップを保存
  const mapData = {};
  for (const [pid, urls] of Object.entries(postToImages)) {
    mapData[pid] = urls.map(u => {
      const fn = path.basename(new URL(u).pathname);
      const exists = fs.existsSync(path.join(destDir, fn));
      return {
        originalUrl: u,
        localPath: exists ? `/images/works/${fn}` : null,
        filename: fn
      };
    }).filter(item => item.localPath !== null);
  }

  fs.writeFileSync(path.join(__dirname, '..', 'docs', 'raw-data', 'post-images-map.json'), JSON.stringify(mapData, null, 2), 'utf8');
  console.log('Download complete. Saved map to docs/raw-data/post-images-map.json');
}

run();
