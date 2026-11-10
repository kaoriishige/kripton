// scripts/generate_winter_assets.cjs
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const outDir = path.join(__dirname, '../public/images/winter');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function main() {
  console.log('Generating winter assets...');

  // 1. 公式クリプトンマンのWebP化
  const characterPath = path.join(__dirname, '../public/images/character/kripton-man-official.png');
  await sharp(characterPath)
    .webp({ quality: 90 })
    .toFile(path.join(__dirname, '../public/images/character/kripton-man-official.webp'));
  console.log('✅ Generated kripton-man-official.webp');

  // 2. 16:9 メイン画像 (1280 x 720)
  // 那須地域の冬景色（雪山・冬空・雪結晶）と公式クリプトンマンの合成
  const heroWidth = 1280;
  const heroHeight = 720;

  // 背景SVG（那須の冬空、雪の積もった那須連山、雪の結晶、注意マーク）
  const heroSvg = `
  <svg width="${heroWidth}" height="${heroHeight}" viewBox="0 0 ${heroWidth} ${heroHeight}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#0a2540" />
        <stop offset="50%" stop-color="#123B65" />
        <stop offset="100%" stop-color="#2D72AD" />
      </linearGradient>
      <linearGradient id="mountainGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#FFFFFF" />
        <stop offset="60%" stop-color="#D6E8F6" />
        <stop offset="100%" stop-color="#8BB3D6" />
      </linearGradient>
      <linearGradient id="mountainGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#EDF5FB" />
        <stop offset="70%" stop-color="#B8D7ED" />
        <stop offset="100%" stop-color="#5B8FAF" />
      </linearGradient>
      <linearGradient id="groundGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#F0F7FD" />
        <stop offset="100%" stop-color="#D0E3F3" />
      </linearGradient>
      <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur stdDeviation="8" result="blur" />
        <feComposite in="SourceGraphic" in2="blur" operator="over" />
      </filter>
    </defs>

    <!-- 冬の夜明け〜朝の澄んだ空 -->
    <rect width="${heroWidth}" height="${heroHeight}" fill="url(#skyGrad)" />

    <!-- 輝く月と冬の光 -->
    <circle cx="180" cy="120" r="45" fill="#FFF8E7" opacity="0.85" filter="url(#glow)" />
    <circle cx="180" cy="120" r="80" fill="#FFEAA7" opacity="0.2" filter="url(#glow)" />

    <!-- 雪の結晶群 -->
    <g fill="#FFFFFF" opacity="0.4" font-family="sans-serif">
      <text x="80" y="80" font-size="28">❄</text>
      <text x="320" y="110" font-size="20">❄</text>
      <text x="500" y="70" font-size="34">❄</text>
      <text x="680" y="140" font-size="22">❄</text>
      <text x="820" y="80" font-size="26">❄</text>
      <text x="1000" y="120" font-size="30">❄</text>
      <text x="1180" y="90" font-size="24">❄</text>
      <text x="220" y="240" font-size="18">❄</text>
      <text x="440" y="200" font-size="26">❄</text>
      <text x="620" y="270" font-size="16">❄</text>
      <text x="750" y="220" font-size="22">❄</text>
    </g>

    <!-- 奥の那須連山（雪山） -->
    <polygon points="0,520 180,340 380,480 600,300 840,490 1050,330 1280,470 1280,720 0,720" fill="url(#mountainGrad2)" opacity="0.7" />

    <!-- 手前の那須連山（白銀の峰） -->
    <polygon points="0,580 120,440 280,560 490,380 720,540 920,400 1150,530 1280,450 1280,720 0,720" fill="url(#mountainGrad1)" />

    <!-- 銀世界の雪原 -->
    <path d="M0,580 Q320,540 640,600 T1280,570 L1280,720 L0,720 Z" fill="url(#groundGrad)" />

    <!-- 左側テキストエリア（視認性を高める半透明グラデーション座布団） -->
    <rect x="50" y="60" width="680" height="600" rx="20" fill="#0A2540" fill-opacity="0.82" stroke="#4A90E2" stroke-width="2" />

    <!-- バッジ -->
    <rect x="90" y="100" width="280" height="38" rx="19" fill="#E53935" />
    <text x="230" y="125" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">🚨 那須地域 冬季限定お知らせ</text>

    <!-- キャッチコピー -->
    <text x="90" y="185" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="34" font-weight="900" fill="#FFFFFF">
      那須地域の冬、
    </text>
    <text x="90" y="235" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="34" font-weight="900" fill="#FFD54F">
      水道管の凍結にご注意ください
    </text>

    <!-- サブテキスト -->
    <text x="90" y="295" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="18" fill="#E2EEF8">
      那須塩原市・大田原市・那須町の冬は氷点下4℃以下へ。
    </text>
    <text x="90" y="325" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="18" fill="#E2EEF8">
      寒さが厳しくなる前に、水道管・給湯器の凍結対策を！
    </text>
    <text x="90" y="355" font-family="'Noto Sans JP', 'Hiragino Sans', sans-serif" font-size="18" fill="#E2EEF8">
      万が一、凍ってしまった場合の安全な対処法も徹底解説。
    </text>

    <!-- ポイントボックス3つ -->
    <g transform="translate(90, 395)">
      <rect x="0" y="0" width="180" height="90" rx="10" fill="#123B65" stroke="#2D72AD" stroke-width="1.5" />
      <text x="90" y="32" font-family="'Noto Sans JP', sans-serif" font-size="14" font-weight="bold" fill="#FFB74D" text-anchor="middle">❄️ 凍結の目安</text>
      <text x="90" y="62" font-family="'Noto Sans JP', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">-4℃以下</text>

      <rect x="195" y="0" width="180" height="90" rx="10" fill="#123B65" stroke="#2D72AD" stroke-width="1.5" />
      <text x="285" y="32" font-family="'Noto Sans JP', sans-serif" font-size="14" font-weight="bold" fill="#FF5252" text-anchor="middle">⚠️ 熱湯は厳禁</text>
      <text x="285" y="62" font-family="'Noto Sans JP', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle">配管破裂の恐れ</text>

      <rect x="390" y="0" width="200" height="90" rx="10" fill="#123B65" stroke="#2D72AD" stroke-width="1.5" />
      <text x="490" y="32" font-family="'Noto Sans JP', sans-serif" font-size="14" font-weight="bold" fill="#64B5F6" text-anchor="middle">🏠 別荘・長期不在</text>
      <text x="490" y="62" font-family="'Noto Sans JP', sans-serif" font-size="16" font-weight="900" fill="#FFFFFF" text-anchor="middle">完全水抜き必須</text>
    </g>

    <!-- 誘導ボタン風装飾 -->
    <rect x="90" y="525" width="340" height="54" rx="27" fill="#FF9E2C" />
    <text x="260" y="559" font-family="'Noto Sans JP', sans-serif" font-size="20" font-weight="900" fill="#FFFFFF" text-anchor="middle">冬の水まわり対策を見る ➔</text>
    <text x="90" y="615" font-family="'Noto Sans JP', sans-serif" font-size="13" fill="#B0BEC5">水道局指定工事店 有限会社クリプトン（24時間受付 090-2463-6638）</text>
  </svg>
  `;

  // クリプトンマンキャラクターのリサイズ（高さ約 580px）
  const charResized = await sharp(characterPath)
    .resize({ height: 580, fit: 'inside' })
    .toBuffer();

  const heroBg = Buffer.from(heroSvg);

  // キャラクターを右側（X: 800, Y: 100）に合成
  await sharp(heroBg)
    .composite([
      {
        input: charResized,
        top: 90,
        left: 770
      }
    ])
    .webp({ quality: 90 })
    .toFile(path.join(outDir, 'winter-kripton-hero.webp'));

  console.log('✅ Generated winter-kripton-hero.webp (1280x720, 16:9)');

  // 3. 正しい解氷方法の解説図 (800x500)
  const defrostSvg = `
  <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="#F4F9FD" />
    <rect x="20" y="20" width="760" height="460" rx="12" fill="#FFFFFF" stroke="#BFDBF7" stroke-width="2" />
    
    <text x="400" y="65" font-family="'Noto Sans JP', sans-serif" font-size="24" font-weight="bold" fill="#123B65" text-anchor="middle">【解説図】水道管が凍った場合の正しい対処手順</text>
    <line x1="60" y1="85" x2="740" y2="85" stroke="#E2E8F0" stroke-width="2" />

    <!-- NGセクション -->
    <rect x="50" y="110" width="330" height="340" rx="10" fill="#FFF5F5" stroke="#FEB2B2" stroke-width="2" />
    <rect x="70" y="130" width="120" height="32" rx="16" fill="#E53E3E" />
    <text x="130" y="152" font-family="'Noto Sans JP', sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">✕ 絶対NG</text>
    <text x="70" y="195" font-family="'Noto Sans JP', sans-serif" font-size="20" font-weight="900" fill="#9B2C2C">熱湯を直接かける</text>
    
    <text x="70" y="240" font-family="'Noto Sans JP', sans-serif" font-size="14" fill="#4A5568" line-height="1.6">
      <tspan x="70" dy="0">• 急激な温度変化で配管が膨張！</tspan>
      <tspan x="70" dy="28">• 銅管や蛇口・バルブが破裂します</tspan>
      <tspan x="70" dy="28">• 破裂すると壁内や床下で大規模漏水に</tspan>
      <tspan x="70" dy="28">• 修理費用が高額化する最大の原因です</tspan>
    </text>
    <rect x="70" y="380" width="290" height="50" rx="8" fill="#FED7D7" />
    <text x="215" y="411" font-family="'Noto Sans JP', sans-serif" font-size="15" font-weight="bold" fill="#C53030" text-anchor="middle">⚠️ 沸騰した熱湯は絶対にかけないで！</text>

    <!-- OKセクション -->
    <rect x="420" y="110" width="330" height="340" rx="10" fill="#F0FFF4" stroke="#9AE6B4" stroke-width="2" />
    <rect x="440" y="130" width="120" height="32" rx="16" fill="#38A169" />
    <text x="500" y="152" font-family="'Noto Sans JP', sans-serif" font-size="16" font-weight="bold" fill="#FFFFFF" text-anchor="middle">◯ 正しい方法</text>
    <text x="440" y="195" font-family="'Noto Sans JP', sans-serif" font-size="20" font-weight="900" fill="#22543D">ぬるま湯 または ドライヤー</text>

    <text x="440" y="240" font-family="'Noto Sans JP', sans-serif" font-size="14" fill="#4A5568">
      <tspan x="440" dy="0">1. 蛇口を少し開けておく</tspan>
      <tspan x="440" dy="28">2. 凍結配管にタオルを巻く</tspan>
      <tspan x="440" dy="28">3. 人肌〜50℃のぬるま湯をゆっくりかける</tspan>
      <tspan x="440" dy="28">4. またはドライヤーの温風を当てる</tspan>
      <tspan x="440" dy="28">5. 水が出たら蛇口を閉めて確認</tspan>
    </text>
    <rect x="440" y="380" width="290" height="50" rx="8" fill="#C6F6D5" />
    <text x="585" y="411" font-family="'Noto Sans JP', sans-serif" font-size="15" font-weight="bold" fill="#22543D" text-anchor="middle">✓ じっくり時間をかけて自然に解凍</text>
  </svg>
  `;
  await sharp(Buffer.from(defrostSvg))
    .webp({ quality: 90 })
    .toFile(path.join(outDir, 'guide-defrost-safety.webp'));
  console.log('✅ Generated guide-defrost-safety.webp');

  // 4. 水道管破裂時の応急止水手順図 (800x500)
  const burstSvg = `
  <svg width="800" height="500" viewBox="0 0 800 500" xmlns="http://www.w3.org/2000/svg">
    <rect width="800" height="500" fill="#FFFBF5" />
    <rect x="20" y="20" width="760" height="460" rx="12" fill="#FFFFFF" stroke="#FED7AA" stroke-width="2" />

    <text x="400" y="65" font-family="'Noto Sans JP', sans-serif" font-size="24" font-weight="bold" fill="#9A3412" text-anchor="middle">【緊急時】水道管が破裂したときの応急処置手順</text>
    <line x1="60" y1="85" x2="740" y2="85" stroke="#FED7AA" stroke-width="2" />

    <!-- STEP 1 -->
    <rect x="50" y="110" width="210" height="330" rx="10" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5" />
    <circle cx="155" cy="150" r="24" fill="#EA580C" />
    <text x="155" y="158" font-family="'Noto Sans JP', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">1</text>
    <text x="155" y="205" font-family="'Noto Sans JP', sans-serif" font-size="17" font-weight="bold" fill="#9A3412" text-anchor="middle">元栓ボックスを探す</text>
    <text x="70" y="245" font-family="'Noto Sans JP', sans-serif" font-size="13" fill="#431407">
      <tspan x="70" dy="0">屋外の地面にある</tspan>
      <tspan x="70" dy="24">「量水器」「水道メーター」</tspan>
      <tspan x="70" dy="24">と書かれた青いプラスチック製</tspan>
      <tspan x="70" dy="24">または鉄のフタを開けます。</tspan>
    </text>

    <!-- STEP 2 -->
    <rect x="295" y="110" width="210" height="330" rx="10" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5" />
    <circle cx="400" cy="150" r="24" fill="#EA580C" />
    <text x="400" y="158" font-family="'Noto Sans JP', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">2</text>
    <text x="400" y="205" font-family="'Noto Sans JP', sans-serif" font-size="17" font-weight="bold" fill="#9A3412" text-anchor="middle">バルブを右に回す</text>
    <text x="315" y="245" font-family="'Noto Sans JP', sans-serif" font-size="13" fill="#431407">
      <tspan x="315" dy="0">中にあるハンドル（止水栓）</tspan>
      <tspan x="315" dy="24">を時計回り（右）へ最後まで</tspan>
      <tspan x="315" dy="24">回し切ります。</tspan>
      <tspan x="315" dy="24">家全体の水が完全に止まります。</tspan>
    </text>

    <!-- STEP 3 -->
    <rect x="540" y="110" width="210" height="330" rx="10" fill="#FFF7ED" stroke="#FDBA74" stroke-width="1.5" />
    <circle cx="645" cy="150" r="24" fill="#EA580C" />
    <text x="645" y="158" font-family="'Noto Sans JP', sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" text-anchor="middle">3</text>
    <text x="645" y="205" font-family="'Noto Sans JP', sans-serif" font-size="17" font-weight="bold" fill="#9A3412" text-anchor="middle">クリプトンへ連絡</text>
    <text x="560" y="245" font-family="'Noto Sans JP', sans-serif" font-size="13" fill="#431407">
      <tspan x="560" dy="0">水が止まったら、</tspan>
      <tspan x="560" dy="24">水道局指定工事店クリプトンへ</tspan>
      <tspan x="560" dy="24">お電話ください。</tspan>
      <tspan x="560" dy="24">緊急直通：090-2463-6638</tspan>
      <tspan x="560" dy="24">（24時間365日受付）</tspan>
    </text>
  </svg>
  `;
  await sharp(Buffer.from(burstSvg))
    .webp({ quality: 90 })
    .toFile(path.join(outDir, 'guide-burst-emergency.webp'));
  console.log('✅ Generated guide-burst-emergency.webp');

  console.log('All winter assets generated successfully!');
}

main().catch(console.error);

