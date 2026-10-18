export interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  shortDesc: string;
  icon: string;
  badge?: string;
  emergencyLevel: "高" | "中" | "低";
  commonTroubles: string[];
  startingPrice: string;
}

export const servicesData: ServiceItem[] = [
  {
    id: "toilet",
    slug: "toilet",
    title: "トイレつまり・水漏れ",
    shortDesc: "便器のあふれ、レバーが空回りする、チョロチョロ水が止まらないなど緊急トラブルに対応",
    icon: "🚽",
    badge: "緊急対応多数",
    emergencyLevel: "高",
    commonTroubles: ["異物を流した・紙づまり", "便器内へのチョロチョロ給水漏れ", "床と便器の隙間からの水漏れ", "温水洗浄便座（ウォシュレット）故障"],
    startingPrice: "5,000円〜"
  },
  {
    id: "water-leak",
    slug: "water-leak",
    title: "水漏れ修理",
    shortDesc: "配管の継ぎ目、壁の中、床下など原因不明の水漏れも迅速に調査・修繕いたします",
    icon: "💧",
    badge: "至急対応",
    emergencyLevel: "高",
    commonTroubles: ["水道局から漏水指摘を受けた", "壁・床から水の音がする", "元栓を閉めてもメーターが回る"],
    startingPrice: "5,000円〜"
  },
  {
    id: "faucet",
    slug: "faucet",
    title: "蛇口・水栓の故障",
    shortDesc: "蛇口のポタポタ水漏れ、ハンドルが固い、シャワーホースからの水漏れを即日修理",
    icon: "🚰",
    emergencyLevel: "中",
    commonTroubles: ["吐水口からのポタポタ漏れ", "レバー下からの水にじみ", "シングルレバーの動作不良", "最新タッチレス水栓への交換"],
    startingPrice: "5,000円〜"
  },
  {
    id: "boiler",
    slug: "eco-cute",
    title: "給湯器・ボイラー故障",
    shortDesc: "お湯が出ない、エラーコードが出る、異音がするなど。給湯器・エコキュート・石油ボイラー対応",
    icon: "♨️",
    badge: "寒冷地対応",
    emergencyLevel: "高",
    commonTroubles: ["リモコンにエラー表示が出る", "お湯がぬるい・水しか出ない", "給湯器本体から水漏れしている", "点火時に異音がする"],
    startingPrice: "8,000円〜"
  },
  {
    id: "drain",
    slug: "drain",
    title: "排水管つまり・高圧洗浄",
    shortDesc: "排水口からポコポコ音がする、水が流れない、悪臭が上がるなどの排水不良を解消",
    icon: "🧼",
    emergencyLevel: "中",
    commonTroubles: ["屋外マスからの汚水あふれ", "排水口の流れが極端に遅い", "油脂汚れによる詰まり", "高圧洗浄による配管クリーニング"],
    startingPrice: "8,000円〜"
  },
  {
    id: "frozen",
    slug: "frozen-pipes",
    title: "水道管凍結・破裂",
    shortDesc: "那須エリア特有の冬期凍結・破裂。解氷作業から破裂管の復旧工事、別荘の水抜きまで迅速対応",
    icon: "❄️",
    badge: "那須の冬特有",
    emergencyLevel: "高",
    commonTroubles: ["真冬の朝に水が出ない（凍結）", "解凍後に配管から水が吹き出した（破裂）", "別荘の冬期水抜き・水出し作業", "凍結防止ヒーターの故障"],
    startingPrice: "8,000円〜"
  },
  {
    id: "pump",
    slug: "pump",
    title: "井戸ポンプの修理・交換",
    shortDesc: "浅井戸・深井戸ポンプのモーターが止まらない、水が出ない、圧力低下に対応",
    icon: "⚙️",
    emergencyLevel: "高",
    commonTroubles: ["ポンプが動きっぱなしになる", "蛇口を開けても水圧が極端に弱い", "砂を噛んで異音がする", "新型インバーターポンプへの交換"],
    startingPrice: "10,000円〜"
  },
  {
    id: "kitchen",
    slug: "kitchen",
    title: "キッチン・台所水まわり",
    shortDesc: "シンク下の水漏れ、排水ジャバラホース交換、ディスポーザー、システムキッチンリフォーム",
    icon: "🍳",
    emergencyLevel: "中",
    commonTroubles: ["シンク下の床が濡れている", "排水口からの強烈な臭い", "換気扇・IH・ビルトイン食洗機の不具合", "キッチン全体のリフォーム"],
    startingPrice: "5,000円〜"
  },
  {
    id: "bath",
    slug: "bath",
    title: "お風呂・浴室水まわり",
    shortDesc: "シャワーの水圧低下、排水つまり、タイル・目地のヒビ、ユニットバスリフォーム",
    icon: "🛁",
    emergencyLevel: "中",
    commonTroubles: ["洗い場にお湯が溜まって流れない", "サーモスタット混合栓の温度調整不良", "浴槽循環口の詰まり・汚れ", "浴室暖房乾燥機の導入"],
    startingPrice: "5,000円〜"
  },
  {
    id: "washroom",
    slug: "washroom",
    title: "洗面所・洗濯機まわり",
    shortDesc: "洗面化粧台のシャワーホース漏水、洗濯機用防水パンつまり、給水栓トラブル",
    icon: "🪞",
    emergencyLevel: "中",
    commonTroubles: ["洗面台下収納の漏水", "排水Sトラップの詰まり・ヘアキャッチャー破損", "洗濯機給水ホース接続部からの水漏れ", "洗面化粧台交換"],
    startingPrice: "5,000円〜"
  }
];
