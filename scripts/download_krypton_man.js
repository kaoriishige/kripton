const fs = require('fs');
const https = require('https');
const path = require('path');

const urls = [
  'https://xn--bbkyao7065bpyck41as89d.com/wp-content/uploads/2020/01/kripton-man4-1.jpg',
  'https://xn--bbkyao7065bpyck41as89d.com/wp-content/uploads/2020/01/kripton-man3-1.jpg',
  'https://xn--bbkyao7065bpyck41as89d.com/wp-content/uploads/2020/01/kripton-man2.jpg',
  'https://xn--bbkyao7065bpyck41as89d.com/wp-content/uploads/2020/01/kripton-man-1.jpg',
  'https://xn--bbkyao7065bpyck41as89d.com/wp-content/uploads/2020/01/cropped-kripton-man4-1.jpg'
];

const destDir = path.join(__dirname, '..', 'public', 'images', 'character');
fs.mkdirSync(destDir, { recursive: true });

function download(url) {
  return new Promise((resolve, reject) => {
    const filename = path.basename(url);
    const dest = path.join(destDir, filename);
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}: status ${res.statusCode}`));
      }
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log(`Saved: ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  for (const u of urls) {
    try {
      await download(u);
    } catch(e) {
      console.error(e.message);
    }
  }
}
run();
