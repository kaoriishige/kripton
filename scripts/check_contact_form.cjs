// scripts/check_contact_form.cjs
const https = require('https');

function fetch(url) {
  return new Promise((resolve) => {
    const req = https.get(url, { timeout: 10000 }, (res) => {
      let body = '';
      res.on('data', d => body += d);
      res.on('end', () => resolve({ status: res.statusCode, body, headers: res.headers }));
    });
    req.on('error', e => resolve({ status: 'ERR', body: e.message, headers: {} }));
    req.on('timeout', () => { req.destroy(); resolve({ status: 'TIMEOUT', body: '', headers: {} }); });
  });
}

async function main() {
  console.log('=== Netlify Forms 設定確認（ライブURL） ===\n');

  const r = await fetch('https://mizumawari-kripton.com/contact/');
  console.log('HTTP Status:', r.status);

  const body = r.body;

  // フォームタグ全体を抽出
  const formTagMatch = body.match(/<form[^>]*>/i);
  console.log('\n【フォームタグ】');
  if (formTagMatch) {
    console.log(formTagMatch[0]);
  } else {
    console.log('❌ <form>タグが見つかりません');
  }

  // 各属性チェック
  console.log('\n【フォーム属性チェック】');
  const checks = [
    { label: 'name="contact"', found: /name="contact"/.test(body) },
    { label: 'method="POST"', found: /method="POST"/i.test(body) },
    { label: 'enctype="multipart/form-data"', found: /enctype="multipart\/form-data"/.test(body) },
    { label: 'data-netlify="true"', found: /data-netlify="true"/.test(body) },
    { label: 'netlify-honeypot="bot-field"', found: /netlify-honeypot="bot-field"/.test(body) },
    { label: 'hidden input name="form-name" value="contact"', found: /name="form-name"\s+value="contact"/.test(body) || /value="contact"\s+name="form-name"/.test(body) },
    { label: 'action属性なし（同一URLへPOST）', found: !/<form[^>]*action=/.test(body) },
  ];
  for (const c of checks) {
    console.log(`  ${c.found ? '✅' : '❌'} ${c.label}`);
  }

  // フォーム入力項目一覧
  console.log('\n【フォーム入力項目】');
  const inputMatches = [...body.matchAll(/<input[^>]*name="([^"]+)"[^>]*>/g)];
  const textareaMatches = [...body.matchAll(/<textarea[^>]*name="([^"]+)"[^>]*/g)];
  const selectMatches = [...body.matchAll(/<select[^>]*name="([^"]+)"[^>]*/g)];
  inputMatches.forEach(m => {
    const type = m[0].match(/type="([^"]+)"/)?.[1] || 'text';
    const required = m[0].includes('required') ? '（必須）' : '（任意）';
    console.log(`  input[${type}] name="${m[1]}" ${required}`);
  });
  textareaMatches.forEach(m => {
    const required = m[0].includes('required') ? '（必須）' : '（任意）';
    console.log(`  textarea name="${m[1]}" ${required}`);
  });
  selectMatches.forEach(m => {
    const required = m[0].includes('required') ? '（必須）' : '（任意）';
    console.log(`  select name="${m[1]}" ${required}`);
  });

  // 送信完了ページ（thank you page）の確認
  console.log('\n【送信後のリダイレクト（action/thank-you）】');
  const actionAttr = body.match(/action="([^"]+)"/);
  if (actionAttr) {
    console.log('  action:', actionAttr[1]);
  } else {
    console.log('  action属性なし → Netlify標準のサンキューページに遷移');
    console.log('  ⚠️  カスタムサンキューページは未設定');
  }

  // dist/contact/index.htmlも確認
  console.log('\n=== dist/contact/index.html（ビルド成果物）の確認 ===');
  const fs = require('fs');
  const path = require('path');
  const distPath = path.join(process.cwd(), 'dist', 'contact', 'index.html');
  if (fs.existsSync(distPath)) {
    const distBody = fs.readFileSync(distPath, 'utf-8');
    const formTagDist = distBody.match(/<form[^>]*>/i);
    console.log('フォームタグ:', formTagDist ? formTagDist[0] : '(なし)');
    console.log('data-netlify:', /data-netlify="true"/.test(distBody) ? '✅' : '❌');
    console.log('form-name hidden:', /name="form-name"/.test(distBody) ? '✅' : '❌');
  } else {
    console.log('dist/contact/index.html が見つかりません');
  }
}

main().catch(e => { console.error(e); process.exit(1); });

