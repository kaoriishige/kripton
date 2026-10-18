const fs = require('fs');
const path = require('path');

const areas = [
  {
    filePath: 'src/pages/areas/nasushiobara/index.astro',
    areaId: 'nasushiobara',
    name: '那須塩原市',
    nameKana: 'なすしおばらし',
    catchphrase: '本社黒磯から最短30分で駆けつけ！黒磯・西那須野・塩原全域に対応',
    description: '有限会社クリプトンの本社所在地（黒磯）です。一般住宅から集合住宅、店舗、宿泊施設まで、那須塩原市指定給水装置工事事業者・指定排水設備工事店として地域密着で対応しております。',
    responseTime: '最短30分',
    features: [
      '本社黒磯から迅速出動（黒磯・西那須野・塩原全域対応）',
      '那須塩原市公認の給水装置工事指定事業者・排水設備指定工事店',
      '塩原温泉地区の寒冷地仕様配管修繕や凍結防止実績多数',
      '水道料金の漏水減免申請手続きに完全対応'
    ],
    localIssues: [
      '冬期のマイナス気温による給湯器・屋外露出配管の凍結破損',
      '築年数が経過した住宅の給水管経年劣化による床下水漏れ',
      '大雨時の屋外汚水マス・排水管の詰まりや悪臭'
    ],
    metaDescription: '那須塩原市の水まわり修理なら地元黒磯の指定工事店クリプトン。トイレつまり、水漏れ、給湯器故障に最短30分で急行。自社施工・明瞭見積もりで安心。'
  },
  {
    filePath: 'src/pages/areas/ohtawara/index.astro',
    areaId: 'ohtawara',
    name: '大田原市',
    nameKana: 'おおたわらし',
    catchphrase: '大田原市内も迅速出張！給排水指定工事店として明瞭会計で対応',
    description: '大田原市指定給水装置工事事業者・指定排水設備工事店です。蛇口の水漏れ1つから、トイレつまり、ボイラー故障、水まわり全体のリフォームまで、有資格者が自社施工で対応します。',
    responseTime: '最短30〜45分',
    features: [
      '大田原市公認の指定給水装置工事事業者・指定排水設備工事店',
      '出動前の明瞭な概算見積りと現地での確定診断徹底',
      '農業集落排水や浄化槽接続のご相談・修繕も可能',
      '土日祝日や夜間の緊急トラブルにも24時間365日対応'
    ],
    localIssues: [
      '浅井戸・深井戸ポンプの圧力低下やモーター停止不良',
      'トイレタンク内の部品劣化によるチョロチョロ漏水音',
      '真冬の屋外散水栓柱の凍結による破裂トラブル'
    ],
    metaDescription: '大田原市の水まわり修理・水道トラブルなら指定工事店のクリプトン。トイレつまり、蛇口水漏れ、ボイラー修理に最短30分で急行。安心の自社施工。'
  },
  {
    filePath: 'src/pages/areas/nasu/index.astro',
    areaId: 'nasu',
    name: '那須町',
    nameKana: 'なすまち',
    catchphrase: '那須高原の別荘地から町内全域まで！寒冷地・別荘特有のトラブルに精通',
    description: '那須町指定工事店として、一般定住住宅はもちろん、那須高原エリアの別荘・リゾート物件の冬期水抜き（水落とし）、シーズン前の通水確認、凍結破裂修理に豊富な実績があります。',
    responseTime: '最短30〜50分',
    features: [
      '那須町公認の指定給水装置工事事業者・指定排水設備工事店',
      '別荘オーナー様・管理会社様からの不在時依頼（写真付きメール報告対応）',
      '極寒期のマイナス気温下での配管解氷・破裂管バイパス工事実績多数',
      '温泉引き込み配管や特殊腐食環境への修繕対応'
    ],
    localIssues: [
      '冬期の不在期間中に起きた水道管・給湯器の凍結破裂',
      '水抜き栓の操作ミスやパッキン固着による常時漏水',
      '長期間未使用によるトラップ封水蒸発と悪臭・害虫侵入'
    ],
    metaDescription: '那須町・那須高原の水まわり修理なら町指定工事店のクリプトン。別荘の冬期水抜き、水道管凍結解氷、トイレつまり、給湯器修理に迅速対応。写真付き報告完備。'
  }
];

areas.forEach(a => {
  const fullPath = path.join(__dirname, '..', a.filePath);
  const dir = path.dirname(fullPath);
  fs.mkdirSync(dir, { recursive: true });

  const relativeImport = path.relative(dir, path.join(__dirname, '..', 'src', 'components', 'AreaDetailTemplate.astro')).replace(/\\/g, '/');

  const content = `---
import AreaDetailTemplate from '${relativeImport.startsWith('.') ? relativeImport : './' + relativeImport}';

const props = ${JSON.stringify(a, null, 2)};
---

<AreaDetailTemplate {...props} />
`;

  fs.writeFileSync(fullPath, content, 'utf8');
  console.log('Created:', a.filePath);
});
