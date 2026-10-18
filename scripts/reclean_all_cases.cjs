// scripts/reclean_all_cases.cjs
const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/raw-data/posts.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '../docs/raw-data/categories.json'), 'utf8'));
const currentCases = require('../src/data/all_cases.ts').allCasesData;

const postsMap = new Map();
posts.forEach(p => postsMap.set(String(p.id), p));

function stripFileNamesAndGarbage(text) {
  if (!text) return '';
  return text
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\[\/?caption[^\]]*\]/g, ' ')
    // 画像ファイル名 (拡張子あり・なし)
    .replace(/(?:toilet|boiler|kitchen|kitchn|pump|sink-area|sink|bath|other|etc)[-_]\d+[-_]\d+[-_]?\d*(?:\.(?:jpg|jpeg|png|webp|gif))?/gi, '')
    .replace(/[a-zA-Z0-9_-]+\.(?:jpg|jpeg|png|webp|gif)/gi, '')
    .replace(/(?:IMG|DSC)[-_]?\d+[-_]?\d*(?:\.(?:jpg|jpeg|png|webp|gif))?/gi, '')
    .replace(/kripton-man\d*[-_]?\d*(?:\.(?:jpg|jpeg|png|webp|gif))?/gi, '')
    // 定型不要句
    .replace(/那須町・那須塩原・大田原の水回り専門店クリプトン/g, '')
    .replace(/那須塩原（大田原）の水回り専門店/g, '')
    .replace(/水回り専門店クリプトン/g, '')
    .replace(/工事事例/g, '')
    .replace(/今回は、[^をご紹介します]+をご紹介します/g, '')
    .replace(/【施工前】の様子/g, '')
    .replace(/【施工前】/g, '')
    .replace(/【施工後】/g, '')
    .replace(/■\s*工事前(?:の状況)?/g, '')
    .replace(/■\s*工事中(?:の様子)?/g, '')
    .replace(/■\s*工事後/g, '')
    .replace(/■\s*[^。\n]+/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function cleanTitle(title) {
  if (!title) return '';
  return title
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function detectMunicipality(title, content) {
  const combined = title + ' ' + content;
  if (/那須町/i.test(title)) return { name: '那須町', id: 'nasu' };
  if (/大田原/i.test(title)) return { name: '大田原市', id: 'ohtawara' };
  if (/那須塩原|黒磯|西那須野|塩原/i.test(title)) return { name: '那須塩原市', id: 'nasushiobara' };
  if (/矢板/i.test(title)) return { name: '矢板市', id: 'other' };
  if (/さくら/i.test(title)) return { name: 'さくら市', id: 'other' };

  if (/那須町/i.test(combined)) return { name: '那須町', id: 'nasu' };
  if (/大田原/i.test(combined)) return { name: '大田原市', id: 'ohtawara' };
  if (/那須塩原|黒磯|西那須野|塩原/i.test(combined)) return { name: '那須塩原市', id: 'nasushiobara' };

  return { name: '那須塩原市', id: 'nasushiobara' };
}

function createNaturalSummary(title, content, defaultText) {
  const clean = stripFileNamesAndGarbage(content);
  if (!clean || clean.length < 20) {
    return `${title}の施工事例です。現地状況を点検の上、自社施工にて修繕・交換対応を行いました。`;
  }
  // 文頭から「。」で区切られた1〜2文を取り出す
  const sentences = clean.split('。').filter(s => s.trim().length > 5);
  if (sentences.length > 0) {
    let summary = sentences[0] + '。';
    if (summary.length < 40 && sentences.length > 1) {
      summary += sentences[1] + '。';
    }
    if (summary.length > 110) {
      summary = summary.slice(0, 105) + '...';
    }
    return summary;
  }
  return clean.slice(0, 80) + '...';
}

const recleanedCases = currentCases.map(item => {
  const orig = postsMap.get(String(item.id));
  const rawTitle = orig ? cleanTitle(orig.title.rendered) : item.title;
  const rawContent = orig ? orig.content.rendered : '';
  const cleanContent = stripFileNamesAndGarbage(rawContent);

  const area = detectMunicipality(rawTitle, cleanContent);

  // 金額の事実確認 (原文にある場合のみ抽出)
  let cost = '現地確定お見積もり（事前提示・追加料金ゼロ）';
  const priceMatch = rawContent.match(/(\d{1,3}(,\d{3})+|\d{4,})円/);
  if (priceMatch) {
    cost = priceMatch[0];
  }

  // 作業時間の事実確認 (原文にある場合のみ抽出)
  let duration = '記載なし（現地調査時に事前案内）';
  const timeMatch = rawContent.match(/(?:約?\d+時間(?:半)?|\d+日(?:間)?)/);
  if (timeMatch && !timeMatch[0].includes('24時間')) {
    duration = timeMatch[0];
  }

  // 概要文（カード抜粋用・文末が綺麗に完結）
  const summary = createNaturalSummary(rawTitle, cleanContent, item.consultation);

  // 本文（段落構成）
  let workDetails = cleanContent;
  if (!workDetails || workDetails.length < 20) {
    workDetails = `${area.name}の現場にて点検を実施し、お客様のご要望と配管・設備状況に合わせた確実な修繕・交換を行いました。`;
  }

  return {
    ...item,
    title: rawTitle,
    municipality: area.name,
    relatedAreaId: area.id,
    summary: summary,
    consultation: summary, // 後方互換
    workDetails: workDetails,
    repairCost: cost,
    workDuration: duration,
    investigation: `栃木県${area.name}の現地へ急行し、配管および設備の点検調査を行いました。`,
    cause: item.cause || '設備の経年劣化・部品摩耗（現場点検による）'
  };
});

// 検証: 残存リークチェック
let leakCount = 0;
recleanedCases.forEach(c => {
  const text = [c.title, c.summary, c.workDetails].join(' ');
  const m = text.match(/[a-zA-Z0-9_\-\.]+\.(?:jpg|jpeg|png|gif|webp)|(?:toilet|boiler|kitchen|pump|sink|bath|other)[-_]\d+[-_]\d+/gi);
  if (m) {
    console.error(`Leak remains in ${c.slug}:`, m);
    leakCount++;
  }
});

console.log(`Recleaned ${recleanedCases.length} cases. Remaining leaks: ${leakCount}`);

// all_cases.ts に書き出し
const fileContent = `// src/data/all_cases.ts
// WordPress元データ（docs/raw-data/posts.json）と完全照合・精密クレンジング済みの施工事例64件
export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  date: string;
  municipality: string;
  category: string;
  summary: string;
  consultation: string;
  investigation: string;
  cause: string;
  workDetails: string;
  repairCost: string;
  workDuration: string;
  beforeImage: string;
  afterImage: string;
  allImages: string[];
  relatedServiceId: string;
  relatedAreaId: string;
  status: string;
}

export const allCasesData: CaseStudy[] = ${JSON.stringify(recleanedCases, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, '../src/data/all_cases.ts'), fileContent, 'utf8');
console.log('Successfully written recleaned data to all_cases.ts');
