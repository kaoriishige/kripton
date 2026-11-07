# 旧公式ドメインから新公式ドメインへの 301リダイレクト対応表

- **旧公式ドメイン**: `https://xn--bbkyao7065bpyck41as89d.com/` (水まわり専門店クリプトン.com)
- **新公式ドメイン**: `https://mizumawari-kripton.com/`
- **作成日**: 2026年11月7日
- **目的**: 旧制作業者様にて旧サーバー（Apache/.htaccessまたはNginx等）で新サイトへ301恒久転送を実施いただくための設定資料

## 転送設計の基本方針
1. **施工事例（64件）**: 旧WordPressの個別URLから、新サイトの対応する各施工事例詳細ページ（`/works/[slug]/`）へ1対1で301転送します。
2. **固定ページ**: 会社案内、問い合わせ、各水まわり設備ページ等の対応ページへ1対1で転送します。
3. **イベント・告知記事**: 冬季水道管凍結注意は凍結専門ページへ、給湯器注意は給湯器ページへ、展示会・おまつり等は会社案内や関連ページへ適切に引き継ぎます（無関係なページへの一括トップ転送は行いません）。

## 301リダイレクト対応表 一覧（全98URL）

| No | 旧URL | ページ種別 | ページタイトル | 新URL（転送先） | 転送区分 |
|:---|:---|:---|:---|:---|:---|
| 1 | `https://xn--bbkyao7065bpyck41as89d.com/` | 7 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 2 | `https://xn--bbkyao7065bpyck41as89d.com/pump/` | 526 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 3 | `https://xn--bbkyao7065bpyck41as89d.com/other-reform/` | 207 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 4 | `https://xn--bbkyao7065bpyck41as89d.com/inspection/` | 195 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 5 | `https://xn--bbkyao7065bpyck41as89d.com/eco-cute/` | 163 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 6 | `https://xn--bbkyao7065bpyck41as89d.com/about/` | 103 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 7 | `https://xn--bbkyao7065bpyck41as89d.com/privacy/` | 101 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 8 | `https://xn--bbkyao7065bpyck41as89d.com/emergency/` | 89 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 9 | `https://xn--bbkyao7065bpyck41as89d.com/contact/` | 85 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 10 | `https://xn--bbkyao7065bpyck41as89d.com/flow/` | 75 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 11 | `https://xn--bbkyao7065bpyck41as89d.com/feature/` | 69 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 12 | `https://xn--bbkyao7065bpyck41as89d.com/toilet/` | 64 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 13 | `https://xn--bbkyao7065bpyck41as89d.com/washroom/` | 50 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 14 | `https://xn--bbkyao7065bpyck41as89d.com/bath/` | 38 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 15 | `https://xn--bbkyao7065bpyck41as89d.com/ketchen/` | 29 | 固定ページ (Page) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 16 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-048/` | 1757 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 17 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen-005/` | 1746 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 18 | `https://xn--bbkyao7065bpyck41as89d.com/kuriputon-matsuri-2026/` | 1693 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 19 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-047/` | 1622 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 20 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-046/` | 1539 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 21 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-045/` | 1529 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 22 | `https://xn--bbkyao7065bpyck41as89d.com/other-008/` | 1518 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 23 | `https://xn--bbkyao7065bpyck41as89d.com/boiler-011/` | 1499 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 24 | `https://xn--bbkyao7065bpyck41as89d.com/boiler-010/` | 1488 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 25 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-044/` | 1476 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 26 | `https://xn--bbkyao7065bpyck41as89d.com/boiler-009/` | 1460 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 27 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-043/` | 1449 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 28 | `https://xn--bbkyao7065bpyck41as89d.com/event-20260113/` | 1435 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 29 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-042/` | 1410 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 30 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen-008/` | 1398 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 31 | `https://xn--bbkyao7065bpyck41as89d.com/event-20251204/` | 1393 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 32 | `https://xn--bbkyao7065bpyck41as89d.com/boiler-008/` | 1383 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 33 | `https://xn--bbkyao7065bpyck41as89d.com/kitchn-007/` | 1373 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 34 | `https://xn--bbkyao7065bpyck41as89d.com/boiler-007/` | 1365 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 35 | `https://xn--bbkyao7065bpyck41as89d.com/boiler-006/` | 1356 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 36 | `https://xn--bbkyao7065bpyck41as89d.com/bath-007/` | 1344 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 37 | `https://xn--bbkyao7065bpyck41as89d.com/etc-001/` | 1340 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 38 | `https://xn--bbkyao7065bpyck41as89d.com/pump-001/` | 1336 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 39 | `https://xn--bbkyao7065bpyck41as89d.com/kitchn-006/` | 1319 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 40 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-041/` | 1307 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 41 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-040/` | 1293 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 42 | `https://xn--bbkyao7065bpyck41as89d.com/other-007/` | 1283 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 43 | `https://xn--bbkyao7065bpyck41as89d.com/boiler-005/` | 1269 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 44 | `https://xn--bbkyao7065bpyck41as89d.com/event-20250530/` | 1212 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 45 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-039/` | 1220 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 46 | `https://xn--bbkyao7065bpyck41as89d.com/pump-002/` | 1201 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 47 | `https://xn--bbkyao7065bpyck41as89d.com/kitchn-005/` | 1188 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 48 | `https://xn--bbkyao7065bpyck41as89d.com/bath-006/` | 1176 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 49 | `https://xn--bbkyao7065bpyck41as89d.com/toilet-038/` | 1164 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 50 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen-004/` | 1159 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 51 | `https://xn--bbkyao7065bpyck41as89d.com/sink-area-007/` | 1152 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 52 | `https://xn--bbkyao7065bpyck41as89d.com/event-20241123-2/` | 1103 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 53 | `https://xn--bbkyao7065bpyck41as89d.com/event-20241123/` | 1095 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 54 | `https://xn--bbkyao7065bpyck41as89d.com/event-20240614/` | 1053 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 55 | `https://xn--bbkyao7065bpyck41as89d.com/event-20231122/` | 1019 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 56 | `https://xn--bbkyao7065bpyck41as89d.com/event-20230916/` | 973 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 57 | `https://xn--bbkyao7065bpyck41as89d.com/event-20220701/` | 868 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 58 | `https://xn--bbkyao7065bpyck41as89d.com/event-20200701/` | 472 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 59 | `https://xn--bbkyao7065bpyck41as89d.com/sink-area006/` | 400 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 60 | `https://xn--bbkyao7065bpyck41as89d.com/sink-area005/` | 394 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 61 | `https://xn--bbkyao7065bpyck41as89d.com/sink-area004/` | 389 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 62 | `https://xn--bbkyao7065bpyck41as89d.com/sink-area003/` | 383 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 63 | `https://xn--bbkyao7065bpyck41as89d.com/sink-area002/` | 376 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 64 | `https://xn--bbkyao7065bpyck41as89d.com/sink-area001/` | 365 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 65 | `https://xn--bbkyao7065bpyck41as89d.com/boiler004/` | 360 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 66 | `https://xn--bbkyao7065bpyck41as89d.com/boiler003/` | 356 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 67 | `https://xn--bbkyao7065bpyck41as89d.com/boiler002/` | 349 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 68 | `https://xn--bbkyao7065bpyck41as89d.com/boiler001/` | 340 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 69 | `https://xn--bbkyao7065bpyck41as89d.com/toilet008/` | 333 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 70 | `https://xn--bbkyao7065bpyck41as89d.com/toilet007/` | 328 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 71 | `https://xn--bbkyao7065bpyck41as89d.com/toilet006/` | 324 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 72 | `https://xn--bbkyao7065bpyck41as89d.com/toilet005/` | 322 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 73 | `https://xn--bbkyao7065bpyck41as89d.com/toilet004/` | 318 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 74 | `https://xn--bbkyao7065bpyck41as89d.com/%e3%83%88%e3%82%a4%e3%83%ac%e4%bf%ae%e7%90%86%e3%81%ae%e5%80%a4%e6%ae%b5%e3%81%af%ef%bc%9f%ef%bc%96%e9%a0%85%e7%9b%ae%e3%82%92%e5%be%b9%e5%ba%95%e8%aa%bf%e6%9f%bb%e3%81%97%e3%81%a6%e3%81%bf%e3%81%9f/` | 316 | 投稿 (Post) | `https://mizumawari-kripton.com/works/case-316/` | 施工事例（日本語スラッグ対応） |
| 75 | `https://xn--bbkyao7065bpyck41as89d.com/toilet002/` | 312 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 76 | `https://xn--bbkyao7065bpyck41as89d.com/toilet001/` | 299 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 77 | `https://xn--bbkyao7065bpyck41as89d.com/wash-basin004/` | 294 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 78 | `https://xn--bbkyao7065bpyck41as89d.com/wash-basin003/` | 290 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 79 | `https://xn--bbkyao7065bpyck41as89d.com/wash-basin002/` | 287 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 80 | `https://xn--bbkyao7065bpyck41as89d.com/wash-basin001/` | 278 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 81 | `https://xn--bbkyao7065bpyck41as89d.com/bath004/` | 275 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 82 | `https://xn--bbkyao7065bpyck41as89d.com/bath003/` | 271 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 83 | `https://xn--bbkyao7065bpyck41as89d.com/bath002/` | 267 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 84 | `https://xn--bbkyao7065bpyck41as89d.com/bath001/` | 259 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 85 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen006/` | 254 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 86 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen005/` | 252 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 87 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen004/` | 250 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 88 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen003/` | 248 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 89 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen002/` | 242 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 90 | `https://xn--bbkyao7065bpyck41as89d.com/kitchen001/` | 234 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 91 | `https://xn--bbkyao7065bpyck41as89d.com/event-20191101/` | 139 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 92 | `https://xn--bbkyao7065bpyck41as89d.com/event-20190701/` | 137 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 93 | `https://xn--bbkyao7065bpyck41as89d.com/event-20181202/` | 134 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 94 | `https://xn--bbkyao7065bpyck41as89d.com/event-20180629/` | 130 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 95 | `https://xn--bbkyao7065bpyck41as89d.com/event-20180325/` | 127 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 96 | `https://xn--bbkyao7065bpyck41as89d.com/event-20171125/` | 125 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 97 | `https://xn--bbkyao7065bpyck41as89d.com/event-20170401/` | 123 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |
| 98 | `https://xn--bbkyao7065bpyck41as89d.com/event-20161126/` | 113 | 投稿 (Post) | `https://mizumawari-kripton.com/` | その他トップ転送 |

## Apache用 .htaccess 記述例（コピペ用）
```apache
# =========================================================================
# 水まわり専門店クリプトン 旧ドメイン → 新ドメイン 301リダイレクト設定 (.htaccess)
# 旧ドメイン: https://xn--bbkyao7065bpyck41as89d.com/ (水まわり専門店クリプトン.com)
# 新ドメイン: https://mizumawari-kripton.com/
# =========================================================================

<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /

# --- 1. 固定ページ・主要サービスページ転送 ---

# --- 2. イベント・告知記事転送（関連サービス・会社案内へ） ---

# --- 3. 施工事例（全64件 1対1完全個別転送） ---

# --- 4. トップページおよび上記以外の未指定URLのフォールバック転送 ---
RewriteRule ^(.*)$ https://mizumawari-kripton.com/$1 [R=301,L]
</IfModule>
```