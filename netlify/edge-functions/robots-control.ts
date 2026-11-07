import type { Context } from "@netlify/edge-functions";

export default async (request: Request, context: Context) => {
  const response = await context.next();
  const url = new URL(request.url);

  // *.netlify.app (Netlifyのデフォルトサブドメイン・仮ドメイン) の場合のみ noindex, nofollow を設定
  if (url.hostname.endsWith(".netlify.app")) {
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
  } else {
    // 正式本番ドメイン（mizumawari-kripton.com / www.mizumawari-kripton.com）の場合は
    // noindex を削除して検索エンジンに正常インデックスさせる
    response.headers.delete("X-Robots-Tag");
  }

  return response;
};

