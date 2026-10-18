export interface CaseStudy {
  id: string;
  slug: string;
  title: string;
  date: string;
  municipality: string; // 市町村
  category: string;
  consultation: string; // ご相談内容
  investigation: string; // 調査内容
  cause: string; // 故障原因
  workDetails: string; // 作業内容
  partsUsed?: string; // 使用した部品
  workDuration?: string; // 作業時間
  repairCost?: string; // 修理料金
  beforeImage?: string;
  duringImage?: string;
  afterImage?: string;
  notes?: string; // お客様への注意事項
  relatedServiceId: string;
  relatedAreaId: string;
  status: "published" | "draft";
}

export const caseStudiesData: CaseStudy[] = [
  {
    id: "1757",
    slug: "toilet-shower-toilet-leak-h-tei",
    title: "那須塩原市H邸｜シャワートイレの水漏れをきっかけにトイレをリフォーム",
    date: "2026-09-19",
    municipality: "那須塩原市",
    category: "トイレの故障・修理・リフォーム",
    consultation: "シャワートイレのノズル付近から水漏れが発生し、床にじみ出てきたため見てほしいとのご相談をいただきました。",
    investigation: "現地確認を行ったところ、温水洗浄便座内部の給水バルブおよび温水タンク接続部の経年劣化による内部漏水を確認。設置から15年以上経過しており、部品供給が終了していました。",
    cause: "温水洗浄便座（シャワートイレ）内部部品の経年劣化",
    workDetails: "便座のみの交換もご提案しましたが、節水性能向上と清掃性アップをご希望されたため、TOTO最新節水型便器・ウォシュレット一式への交換リフォームを実施しました。",
    partsUsed: "TOTO 節水型組み合わせ便器＋ウォシュレット",
    workDuration: "約3.5時間",
    repairCost: "現地確定見積もり通り（自社施工価格）",
    beforeImage: "/images/works/sample-toilet-before.jpg",
    afterImage: "/images/works/sample-toilet-after.jpg",
    notes: "水漏れを放置すると床の腐食や階下漏水につながるため、異常を感じたらすぐに止水栓を閉めてご相談ください。",
    relatedServiceId: "toilet",
    relatedAreaId: "nasushiobara",
    status: "published"
  },
  {
    id: "1746",
    slug: "kitchen-faucet-replacement-h-tei",
    title: "那須塩原市H邸｜台所の水栓から水漏れ・修理ではなく本体交換対応",
    date: "2026-09-19",
    municipality: "那須塩原市",
    category: "キッチンの故障・修理・リフォーム",
    consultation: "台所のシングルレバー水栓の根本から水がじわじわ漏れて止まらないとご連絡をいただきました。",
    investigation: "スパウト内部のカートリッジおよびパッキンが摩耗・固着。使用年数が17年と長期に及んでおり、本体金属部の腐食も見られました。",
    cause: "シングルレバーカートリッジ摩耗および本体内部腐食",
    workDetails: "部分修理では再発リスクが高いため、使いやすい最新の浄水器兼用ハンドシャワー水栓への本体交換をご提案し、即日施工いたしました。",
    partsUsed: "LIXIL キッチン用シングルレバー混合水栓（エコハンドル）",
    workDuration: "約1時間",
    repairCost: "基本診断料＋交換工賃＋部材代（明瞭会計）",
    beforeImage: "/images/works/sample-kitchen-before.jpg",
    afterImage: "/images/works/sample-kitchen-after.jpg",
    notes: "レバーが固くなったり、操作時に軋む音がしたりする場合は漏水の前兆です。",
    relatedServiceId: "kitchen",
    relatedAreaId: "nasushiobara",
    status: "published"
  },
  {
    id: "1529",
    slug: "toilet-tank-leak-s-tei",
    title: "【那須塩原市S様邸】トイレタンク内の水漏れ（チョロチョロ音）修理",
    date: "2026-02-25",
    municipality: "那須塩原市",
    category: "トイレの故障・修理・リフォーム",
    consultation: "「トイレを使っていないのに、タンクの中でポタポタと水音がし続けている」とのご相談。",
    investigation: "タンク内部を開けて確認したところ、ボールタップの弁不良およびフロートゴム玉の経年劣化による隙間漏水を確認。",
    cause: "フロートゴム玉の摩耗・溶出による密着不良",
    workDetails: "タンク内のボールタップ・フロートバルブ・サイフォン管を純正新品部品に交換し、正常な給水停止と密閉を確認しました。",
    partsUsed: "ボールタップ一式、フロートゴム玉、給水管パッキン",
    workDuration: "約45分",
    repairCost: "1ヶ所 5,000円（税込）＋部品代＋診断料",
    beforeImage: "/images/works/sample-tank-before.jpg",
    afterImage: "/images/works/sample-tank-after.jpg",
    notes: "便器内にわずかに波紋が出ている状態は水道代が跳ね上がる原因になります。",
    relatedServiceId: "toilet",
    relatedAreaId: "nasushiobara",
    status: "published"
  },
  {
    id: "1622",
    slug: "nasu-town-toilet-odor-floor-renovation",
    title: "那須町H様邸｜床のアンモニア臭・壁紙剥がれを解消するトイレ全面リフォーム",
    date: "2026-04-17",
    municipality: "那須町",
    category: "トイレの故障・修理・リフォーム",
    consultation: "床のシミとアンモニア臭が気になり、壁紙も剥がれてきたため、綺麗で手入れしやすいトイレに一新したいとのご要望。",
    investigation: "長年の使用に伴いクッションフロアの目地から床板へ尿が染み込んでいたため、下地補修を含めた床・壁・便器のトータルリフォームをご案内。",
    cause: "床材の経年劣化と隙間からのアンモニア染み込み",
    workDetails: "既存便器撤去、床下地補修、防汚・消臭クッションフロア貼り替え、防カビクロス施工、自動洗浄付きTOTO最新節水便器設置。",
    partsUsed: "TOTO ネオレスト / サンゲツ 防臭クッションフロア・消臭クロス",
    workDuration: "1日（朝8:30〜夕方16:00完成）",
    repairCost: "内装一式＋設備器具＋工事費パック",
    beforeImage: "/images/works/sample-renov-before.jpg",
    afterImage: "/images/works/sample-renov-after.jpg",
    notes: "床や壁のリフォームを便器交換と同時に行うことで、別々に工事するより費用を大幅に抑えられます。",
    relatedServiceId: "toilet",
    relatedAreaId: "nasu",
    status: "published"
  }
];
