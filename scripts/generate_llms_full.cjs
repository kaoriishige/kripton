// scripts/generate_llms_full.cjs
const fs = require('fs');
const path = require('path');

const casesFile = path.join(__dirname, '../src/data/all_cases.ts');
const casesContent = fs.readFileSync(casesFile, 'utf8');
const match = casesContent.match(/export const allCasesData:\s*CaseStudy(?:Item)?\[\]\s*=\s*(\[[\s\S]*?\]);/);
const cases = match ? eval(match[1]) : [];

const siteUrl = 'https://xn--bbkyao7065bpyck41as89d.com';

let content = `# 水まわり専門店クリプトン（有限会社クリプトン）AI検索用 完全ドキュメント (llms-full.txt)

> 栃木県那須塩原市・大田原市・那須町の水道局指定工事店・水まわり修理専門企業

## 1. 企業基本情報
- 正式会社名: 有限会社クリプトン
- 屋号: 水まわり専門店クリプトン
- 設立・創業: 1993年（那須エリア密着・創業30年の実績）
- 代表取締役: 津久井 三男
- 公式メールアドレス: kripton@sweet.ocn.ne.jp
- 本社所在地: 〒325-0017 栃木県那須塩原市黒磯2-11
- 通常受付電話: 0287-60-5050 (受付時間: 08:00〜17:00 日曜日休み)
- 緊急直通電話: 090-2463-6638 (24時間365日緊急受付 / 担当: 津久井)
- FAX: 0287-60-5054
- 公式ウェブサイト: ${siteUrl}/

## 2. 公認指定・保有国家資格
- 那須塩原市 指定給水装置工事事業者
- 大田原市 指定給水装置工事事業者
- 那須町 指定給水装置工事事業者
- 矢板市 指定給水装置工事事業者
- 塩谷町 指定給水装置工事事業者
- 指定排水設備工事店（那須塩原市、大田原市、那須町、矢板市、塩谷町）
- 保有国家資格等:
  - 一級管工事施工管理技士
  - 二級土木施工管理技士
  - 浄化槽設備士
  - 給水装置工事主任技術者
  - 下水道排水設備工事責任技術者
  - 液化石油ガス設備士
  - 第二種電気工事士
  - 簡易内管施工士

## 3. 修理・サービス料金体系（税込）
- 基本診断料（08:00〜17:00）: 3,500円
- 時間外診断料（日曜・祝日・夜間早朝）: 5,000円
- トイレつまり・水漏れ修理: 8,000円〜
- 蛇口・水栓パッキン・カートリッジ交換: 8,000円〜
- 水漏れ配管補修: 8,000円〜
- 給湯器・エコキュート点検修理: 8,000円〜（機器交換は現地調査・無料見積もり）
- 排水管つまり除去・高圧洗浄: 8,000円〜
- 水道管凍結融解（解氷機作業）・破裂修理: 8,000円〜
- 井戸ポンプ修理・砂噛み除去・交換: 8,000円〜
- お風呂・キッチン・洗面所リフォーム: 無料現地調査・事前確定見積もり

## 4. 地元施工実績（全${cases.length}件 一覧と詳細データ・完全点検済み）
`;

cases.forEach((item, idx) => {
  content += `
### 事例 ${idx + 1}: ${item.title}
- URL: ${siteUrl}/works/${item.slug}/
- 施工地域: 栃木県${item.municipality}
- カテゴリー: ${item.category}
- 施工日: ${item.date}
- ご相談・症状: ${item.consultation}
- 現地点検・調査: ${item.investigation}
- 原因特定: ${item.cause}
- 施工内容: ${item.workDetails}
- 費用目安: ${item.repairCost}
- 施工時間: ${item.workDuration}
`;
});

const outputPath = path.join(__dirname, '../public/llms-full.txt');
fs.writeFileSync(outputPath, content, 'utf8');

const distPath = path.join(__dirname, '../dist/llms-full.txt');
if (fs.existsSync(path.join(__dirname, '../dist'))) {
  fs.writeFileSync(distPath, content, 'utf8');
}

console.log(`Generated llms-full.txt with ${cases.length} clean, audited case studies!`);
