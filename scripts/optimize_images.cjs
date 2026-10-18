const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

// Sharpのファイルキャッシュを完全無効化（Windowsのロック防止）
sharp.cache(false);

const targetDir = path.join(__dirname, '../public/images/works');

async function optimizeImages() {
  if (!fs.existsSync(targetDir)) return;
  const files = fs.readdirSync(targetDir);
  console.log(`Scanning ${files.length} images for optimization...`);

  let optimizedCount = 0;
  let totalSavedBytes = 0;

  for (const file of files) {
    const ext = path.extname(file).toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext)) continue;

    const filePath = path.join(targetDir, file);
    const stats = fs.statSync(filePath);

    // 200KB以上の重い画像をターゲット
    if (stats.size > 200 * 1024) {
      const origSize = stats.size;
      try {
        const inputBuffer = fs.readFileSync(filePath);
        let image = sharp(inputBuffer);
        const metadata = await image.metadata();

        if (metadata.width && metadata.width > 1200) {
          image = image.resize(1200, null, { withoutEnlargement: true });
        }

        let outputBuffer;
        if (ext === '.png') {
          outputBuffer = await image.png({ quality: 80, compressionLevel: 8 }).toBuffer();
        } else {
          outputBuffer = await image.jpeg({ quality: 80, progressive: true, mozjpeg: true }).toBuffer();
        }

        if (outputBuffer.length < origSize) {
          // 一時ファイル経由でアトミックに上書き
          const tempPath = filePath + '.tmp';
          fs.writeFileSync(tempPath, outputBuffer);
          fs.renameSync(tempPath, filePath);

          const saved = origSize - outputBuffer.length;
          totalSavedBytes += saved;
          optimizedCount++;
          if (optimizedCount % 20 === 0 || saved > 1024 * 1024) {
            console.log(`[${optimizedCount}] ${file}: ${(origSize/1024).toFixed(0)}KB -> ${(outputBuffer.length/1024).toFixed(0)}KB (saved ${(saved/1024).toFixed(0)}KB)`);
          }
        }
      } catch (err) {
        console.error(`Error on ${file}:`, err.message);
      }
    }
  }

  console.log(`SUCCESS: Optimized ${optimizedCount} images. Total saved: ${(totalSavedBytes / 1024 / 1024).toFixed(2)} MB!`);
}

optimizeImages();
