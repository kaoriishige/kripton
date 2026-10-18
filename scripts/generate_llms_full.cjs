const fs = require('fs');
const path = require('path');

const posts = require('../docs/raw-data/posts.json');
const siteUrl = 'https://xn--bbkyao7065bpyck41as89d.com';

function sanitizeSlug(slug, id) {
  if (!slug || /^[^\x00-\x7F]+$/.test(slug) || /%[0-9A-Fa-f]{2}/.test(slug)) {
    return `case-${id}`;
  }
  return slug.toLowerCase().replace(/[^a-z0-9-_]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') || `case-${id}`;
}

function stripHtml(html) {
  if (!html) return '';
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

// 施工事例（イベント id:4 以外）を全件抽出 (全64件)
const worksPosts = posts.filter(p => !Array.isArray(p.categories) || !p.categories.includes(4));

let content = `# 水まわり専門店クリプトン（有限会社クリプトン）AI学習・検索用 完全ドキュメント (llms-full.txt)

> 栃木県那須塩原市・大田原市・那須町の水道局指定工事店・水まわり修理専門企業

## 1. 企業基本情報
- 正式会社名: 有限会社クリプトン
- 屋号: 水まわり専門店クリプトン
- 設立・創業: 1993年（那須エリア密着・創業30年の実績）
- 代表取締役: 津久井 三男
- 本社所在地: 〒325-0017 栃木県那須塩原市黒磯2-11
- 通常受付電話: 0287-60-5050 (受付時間: 8:00〜19:00 年中無休)
- 夜間・緊急直通電話: 090-2463-6638 (24時間365日受付 / 担当: 津久井)
- FAX: 0287-60-5054
- 公式ウェブサイト: ${siteUrl}/

## 2. 公認指定・保有資格
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
- 基本診断料（8:00〜19:00）: 3,500円
- 時間外診断料（夜間・早朝）: 5,000円
- トイレつまり・水漏れ修理: 5,500円〜
- 蛇口・水栓パッキン・カートリッジ交換: 5,500円〜
- 水漏れ配管補修: 5,500円〜
- 給湯器・エコキュート点検修理: 8,800円〜（機器交換は現地調査・無料見積もり）
- 排水管つまり除去・高圧洗浄: 8,800円〜
- 水道管凍結融解（解氷機作業）・破裂修理: 8,800円〜
- 井戸ポンプ修理・砂噛み除去・交換: 11,000円〜
- お風呂・キッチン・洗面所リフォーム: 無料現地調査・見積もり

## 4. 地元施工実績（全${worksPosts.length}件 一覧と詳細データ）
`;

worksPosts.forEach((p, idx) => {
  const slug = sanitizeSlug(p.slug, p.id);
  const title = p.title && p.title.rendered ? stripHtml(p.title.rendered) : `施工事例 #${p.id}`;
  const excerpt = p.excerpt && p.excerpt.rendered ? stripHtml(p.excerpt.rendered) : '';
  const date = p.date ? p.date.split('T')[0] : '';
  const body = p.content && p.content.rendered ? stripHtml(p.content.rendered).slice(0, 300) : '';

  content += `
### 事例 ${idx + 1}: ${title}
- URL: ${siteUrl}/works/${slug}/
- 施工日: ${date}
- 概要: ${excerpt || title}
- 工事詳細抜粋: ${body}
`;
});

const outputPath = path.join(__dirname, '../public/llms-full.txt');
fs.writeFileSync(outputPath, content, 'utf8');

const distPath = path.join(__dirname, '../dist/llms-full.txt');
if (fs.existsSync(path.join(__dirname, '../dist'))) {
  fs.writeFileSync(distPath, content, 'utf8');
}

console.log(`Generated llms-full.txt with ${worksPosts.length} detailed case studies!`);
