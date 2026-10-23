---
description: Webサイト制作・改修における共通セキュリティおよび公開前承認ルール
globs: "**/*"
---

# Webサイト制作共通セキュリティルール

本ルールは、Antigravity環境で制作・改修を行うすべてのWebサイトプロジェクト（HTML, CSS, JavaScript, PHP, Node.js、および各種フレームワーク）に常時適用される必須要件です。

---

## 1. 秘密情報・クレデンシャルの完全保護
- **ハードコードの絶対禁止**:
  - APIキー、トークン、DBパスワード、秘密鍵、Webhook URLなどをコード内に直接記述しない。
- **環境変数の徹底**:
  - ローカル開発は `.env`（またはフレームワーク固有の秘匿設定ファイル）を使用し、Netlify等のホスティング環境ではダッシュボードの環境変数（Environment variables）から注入する。
- **`.gitignore` の事前検証**:
  - `.env`, `.env.*` (※`.env.example` は除く), `node_modules/`, `vendor/`, `*.pem`, `*.key` 等がGit管理対象外になっていることを作業開始時・コミット前に必ず確認する。
  - 誤ってコミット履歴に残った場合は、単なるコミット削除ではなく、履歴パージ（BFG/git-filter-repo）およびキーの即時失効・再発行を行う。

---

## 2. 脆弱性防御（セキュアコーディング）
- **XSS（クロスサイトスクリプティング）対策**:
  - JavaScript: 不用意な `innerHTML`, `outerHTML`, `document.write()`, `eval()` の使用を禁止。動的文字列は `textContent`, `setAttribute()` を使用するか、信頼されたサニタイザー（DOMPurify等）を経由する。
  - PHP: 出力時は必ずコンテキストに応じたエスケープ（HTML本文: `htmlspecialchars($var, ENT_QUOTES, 'UTF-8')`、属性値・URL・JS出力時の個別エスケープ）を行う。
- **インジェクション対策（SQL / コマンド）**:
  - PHP/Node.jsでのDBクエリは、必ずPDOのプリペアドステートメントまたはORMのパラメータバインドを使用し、生文字列の結合・展開を禁止する。
- **CSRF（クロスサイトリクエストフォージェリ）対策**:
  - POST/PUT/DELETE等の状態変更を伴うリクエストには、ワンタイムCSRFトークンの検証を必須とする。
  - Cookie属性には `SameSite=Lax`（または `Strict`）および `Secure`, `HttpOnly` を明示する。
- **オープンリダイレクト対策**:
  - クエリパラメータ等からリダイレクト先URLを動的生成する場合は、ホワイトリスト検証を行う。

---

## 3. 依存パッケージとサプライチェーンの安全性
- **既知の脆弱性チェック**:
  - 新規パッケージ追加時、または定期メンテナンス時に `npm audit` / `composer audit` を実行し、High以上の脆弱性がない状態を維持する。
- **バージョン固定と整合性検証**:
  - `package-lock.json` または `composer.lock` を必ずGit管理し、環境差分による予期せぬ更新事故を防止する。
- **CDN外部スクリプトのSRI検証**:
  - 外部CDN（Google Fonts等の動的生成系を除くJS/CSSライブラリ）を読み込む際は、Subresource Integrity（`integrity` 属性および `crossorigin="anonymous"`）を付与する。

---

## 4. セキュリティヘッダーの標準化（Netlify / サーバー設定）
Netlify公開サイトでは `_headers` または `netlify.toml`、PHP/Node.jsサーバーではミドルウェア等を用いて以下のヘッダーを原則適用する。

```http
# 推奨セキュリティヘッダー構成
X-Frame-Options: SAMEORIGIN
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https:; style-src 'self' 'unsafe-inline' https:; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https:; frame-ancestors 'self';
```
*(※CSPディレクティブは外部サービス連携（Google Analytics, 決済等）に応じて案件ごとに安全にチューニングする)*

---

## 5. フォーム・API・認証機能の個別検査
- **入力バリデーション（サーバーサイド必須）**:
  - クライアント側（HTML5/JS）のバリデーションはUI補助に過ぎないものとし、バックエンド側（PHP, Node.js, サーバーレス関数）で型・長さ・許容文字・範囲の厳格な検証を行う。
- **認証・認可とパスワード管理**:
  - パスワードは `password_hash()` (PHP: Argon2idまたはBCrypt) を用い、適切なコスト係数でハッシュ化する。
  - セッションIDはログイン成功時に再生成（セッション固定化攻撃の防止）する。
- **レートリミット（過剰リクエスト制御）**:
  - お問い合わせフォーム、ログインAPI等には連続送信・ブルートフォース攻撃を防ぐためのレート制限またはCAPTCHA（Turnstile, reCAPTCHA等）を設ける。

---

## 6. 公開パイプラインと事前承認ポリシー【最重要】
- **Git Push / 本番デプロイの自動実行禁止**:
  - AIエージェントは、ユーザーの**明示的な事前承認なしに `git push` を実行したり、Netlifyの本番ブランチ（main/master）へ自動反映させたりしてはならない**。
  - 必ず変更内容（差分、影響範囲、テスト結果）を提示し、ユーザーからの承認を得た後にプッシュ/公開を行う。
- **コミット前自己検証**:
  - コミット対象ファイルに不要なデバッグコード、ログ出力（`console.log` での個人情報出力等）、一時ファイル、秘密情報が含まれていないかチェックする。

---

## 7. 既存資産（デザイン・機能・SEO・AI検索対策）の保護
- **リグレッション（改修による劣化）の防止**:
  - セキュリティ対策やリファクタリングを理由に、既存のデザイン、レイアウト、アクセシビリティ、ユーザー体験を損なわない。
- **SEO / AIO（AI検索最適化）の保全**:
  - `title`, `meta description`, OGP, カノニカルURL, 構造化データ（JSON-LD）、`robots.txt`, `sitemap.xml` の記述を保護する。
  - セキュリティヘッダー（CSP等）により、GooglebotやAIクローラーの正規アクセスやインデックスが遮断されないことを確認する。

---

## 8. セキュリティ問題検出時の報告フォーマット
コードレビューや動作確認で脆弱性や懸念点を発見した場合、以下のフォーマットで重大度と修正案をユーザーに報告する。

> ### 🚨 セキュリティ診断レポート
> - **対象ファイル/箇所**: `path/to/file.ext:行番号`
> - **脆弱性種別**: （例: 反射型XSS、秘密情報の露出リスク、CSRFの不備など）
> - **重大度**: `[Critical]` / `[High]` / `[Medium]` / `[Low]`
> - **影響内容**: （攻撃された場合に何が起こりうるか）
> - **推奨される修正方法**: （コード差分または具体的な対策手順）
