// scripts/test_form_submission.cjs
const https = require('https');

async function testSubmit() {
  console.log('=== Netlify Forms 本番テスト送信検証 ===\n');

  // FormDataの作成（multipart/form-data）
  const boundary = '----WebKitFormBoundary' + Math.random().toString(36).substring(2);
  
  const fields = [
    { name: 'form-name', value: 'contact' },
    { name: 'name', value: '【システム動作検証テスト】' },
    { name: 'tel', value: '090-0000-0000' },
    { name: 'email', value: 'test-verification@mizumawari-kripton.com' },
    { name: 'city', value: '那須塩原市' },
    { name: 'message', value: 'これは新NetlifyプロジェクトのNetlify Forms検知・送信テストです。' }
  ];

  let body = '';
  for (const f of fields) {
    body += `--${boundary}\r\n`;
    body += `Content-Disposition: form-data; name="${f.name}"\r\n\r\n`;
    body += `${f.value}\r\n`;
  }
  body += `--${boundary}--\r\n`;

  const bodyBuffer = Buffer.from(body, 'utf-8');

  return new Promise((resolve, reject) => {
    const req = https.request({
      hostname: 'mizumawari-kripton.com',
      port: 443,
      path: '/contact/',
      method: 'POST',
      headers: {
        'Content-Type': `multipart/form-data; boundary=${boundary}`,
        'Content-Length': bodyBuffer.length,
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Referer': 'https://mizumawari-kripton.com/contact/'
      }
    }, (res) => {
      let responseBody = '';
      res.on('data', chunk => responseBody += chunk);
      res.on('end', () => {
        console.log('HTTP Status Code:', res.statusCode);
        console.log('Location:', res.headers.location);
        const title = responseBody.match(/<title>(.*?)<\/title>/)?.[1];
        console.log('Page Title:', title);
        console.log('Body snippet:', responseBody.slice(0, 300).replace(/\s+/g, ' '));
        if (res.statusCode === 303 || res.statusCode === 302 || (res.statusCode === 200 && title?.includes('ありがとう'))) {
          console.log('\n✅ 送信テスト成功！サンキュー画面へ遷移または受領されました');
          resolve(true);
        } else {
          console.log('\nステータス:', res.statusCode);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.error('通信エラー:', err);
      reject(err);
    });

    req.write(bodyBuffer);
    req.end();
  });
}

testSubmit().catch(console.error);
