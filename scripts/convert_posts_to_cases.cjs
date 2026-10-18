const fs = require('fs');
const path = require('path');

const posts = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'raw-data', 'posts.json'), 'utf8'));
const categories = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'docs', 'raw-data', 'categories.json'), 'utf8'));
const catMap = Object.fromEntries(categories.map(c => [c.id, c.name]));

function detectMunicipality(title, content) {
  const text = title + ' ' + content;
  if (text.includes('那須塩原')) return '那須塩原市';
  if (text.includes('大田原')) return '大田原市';
  if (text.includes('那須町') || text.includes('那須高原')) return '那須町';
  if (text.includes('矢板')) return '矢板市';
  if (text.includes('塩谷')) return '塩谷町';
  return '那須塩原市';
}

function detectServiceId(category, title) {
  const str = category + ' ' + title;
  if (/トイレ|便器|ウォシュレット|シャワートイレ/.test(str)) return 'toilet';
  if (/キッチン|台所|流し|水栓/.test(str)) return 'kitchen';
  if (/給湯器|ボイラー|エコキュート/.test(str)) return 'eco-cute';
  if (/風呂|浴室|ユニットバス/.test(str)) return 'bath';
  if (/洗面/.test(str)) return 'washroom';
  if (/凍結|破裂|水抜き/.test(str)) return 'frozen-pipes';
  if (/井戸|ポンプ/.test(str)) return 'pump';
  if (/排水|つまり|高圧洗浄/.test(str)) return 'drain';
  return 'water-leak';
}

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '')
    .replace(/<style[^>]*>([\s\S]*?)<\/style>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

function sanitizeSlug(slug, id) {
  if (/^[a-zA-Z0-9\-_]+$/.test(slug)) {
    return slug;
  }
  return `case-${id}`;
}

function run() {
  const postImagesMapPath = path.join(__dirname, '..', 'docs', 'raw-data', 'post-images-map.json');
  let postImagesMap = {};
  if (fs.existsSync(postImagesMapPath)) {
    postImagesMap = JSON.parse(fs.readFileSync(postImagesMapPath, 'utf8'));
  }

  const allCases = [];
  const allNews = [];
  const redirects = [];

  posts.forEach(p => {
    const postCats = (p.categories || []).map(cid => catMap[cid] || cid);
    const isEvent = postCats.some(c => c === 'イベント情報');
    const title = p.title?.rendered || '施工事例';
    const rawContent = p.content?.rendered || '';
    const cleanContent = cleanHtml(rawContent);

    const validImages = (postImagesMap[p.id] || [])
      .map(img => img.localPath)
      .filter(p => !p.includes('32x32') && !p.includes('150x150') && !p.includes('cropped-kripton-man'));

    let beforeImage = '/images/character/kripton-man4-1.jpg';
    let afterImage = '/images/character/kripton-man4-1.jpg';

    if (validImages.length > 0) {
      beforeImage = validImages[0];
      afterImage = validImages.length > 1 ? validImages[validImages.length - 1] : validImages[0];
    }

    const cleanSlug = sanitizeSlug(p.slug, p.id);
    const municipality = detectMunicipality(title, cleanContent);
    const catName = postCats.find(c => c !== 'イベント情報') || '水まわりの故障・修理・リフォーム';
    const serviceId = detectServiceId(catName, title);

    if (isEvent) {
      allNews.push({
        id: String(p.id),
        slug: cleanSlug,
        title: title,
        date: p.date ? p.date.split('T')[0] : '2026-01-01',
        category: 'イベント情報',
        content: cleanContent.slice(0, 300) + '...',
        images: validImages
      });
      redirects.push(`/${encodeURIComponent(p.slug)}/  /news/${cleanSlug}/  301`);
    } else {
      let consultation = cleanContent.slice(0, 120) + '...';
      let workDetails = '現地点検の上、専門技術者により迅速に修繕作業を行いました。';
      if (cleanContent.includes('ご相談') || cleanContent.includes('きっかけ')) {
        const parts = cleanContent.split(/ご相談|きっかけ/);
        if (parts[1]) consultation = parts[1].slice(0, 150).trim() + '...';
      }

      allCases.push({
        id: String(p.id),
        slug: cleanSlug,
        title: title,
        date: p.date ? p.date.split('T')[0] : '2026-01-01',
        municipality: municipality,
        category: catName,
        consultation: consultation,
        investigation: `${municipality}の現場へ急行し、配管・機器の状態を国家資格者が診断・点検いたしました。`,
        cause: `${catName}に伴う経年劣化および部材の摩耗・不具合`,
        workDetails: workDetails,
        repairCost: '現地確定お見積もり通り（自社施工）',
        workDuration: '約1〜2時間',
        beforeImage: beforeImage,
        afterImage: afterImage,
        allImages: validImages,
        relatedServiceId: serviceId,
        relatedAreaId: municipality === '那須塩原市' ? 'nasushiobara' : (municipality === '大田原市' ? 'ohtawara' : 'nasu'),
        status: 'published'
      });
      redirects.push(`/${encodeURIComponent(p.slug)}/  /works/${cleanSlug}/  301`);
    }
  });

  console.log(`Generated ${allCases.length} case studies and ${allNews.length} news items.`);

  const fileContent = `// 自動生成: WordPress投稿データから変換された全施工事例マスター
export interface CaseStudyItem {
  id: string;
  slug: string;
  title: string;
  date: string;
  municipality: string;
  category: string;
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
  status: "published" | "draft";
}

export const allCasesData: CaseStudyItem[] = ${JSON.stringify(allCases, null, 2)};
`;

  fs.writeFileSync(path.join(__dirname, '..', 'src', 'data', 'all_cases.ts'), fileContent, 'utf8');
  console.log('Saved to src/data/all_cases.ts');

  // public/_redirects に301リダイレクト設定を出力
  const fixedPageRedirects = [
    '/toilet/  /services/toilet/  301',
    '/bath/  /services/bath/  301',
    '/ketchen/  /services/kitchen/  301',
    '/washroom/  /services/washroom/  301',
    '/eco-cute/  /services/eco-cute/  301',
    '/pump/  /services/pump/  301',
    '/other-reform/  /services/other-reform/  301',
    '/feature/  /#why-us  301',
    '/emergency/  /#contact  301',
    '/flow/  /#flow  301',
    '/inspection/  /#krypton-man  301'
  ];

  const fullRedirects = fixedPageRedirects.concat(redirects).join('\n');
  fs.writeFileSync(path.join(__dirname, '..', 'public', '_redirects'), fullRedirects, 'utf8');
  console.log('Saved 301 redirects to public/_redirects');
}

run();
