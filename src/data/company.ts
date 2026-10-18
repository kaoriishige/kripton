export interface CompanyInfo {
  name: string;
  tradeName: string;
  representative: string;
  postalCode: string;
  address: string;
  telMain: string;
  telEmergency: string;
  fax: string;
  emergencyContactPerson: string;
  businessHours: string;
  emergencyHours: string;
  primaryAreas: string[];
  allAreas: string[];
  qualifications: string[];
  waterSupplyLicenses: string[];
  drainageLicenses: string[];
  pricing: {
    diagnosisRegular: string;
    diagnosisRegularHours: string;
    diagnosisOvertime: string;
    diagnosisOvertimeHours: string;
    repairStartingFrom: string;
  };
}

export const companyData: CompanyInfo = {
  name: "有限会社クリプトン",
  tradeName: "水まわり専門店クリプトン",
  representative: "代表取締役 津久井 三男",
  postalCode: "325-0017",
  address: "栃木県那須塩原市黒磯2-11",
  telMain: "0287-60-5050",
  telEmergency: "090-2463-6638",
  fax: "0287-60-5054",
  emergencyContactPerson: "津久井",
  businessHours: "8:00 ～ 19:00",
  emergencyHours: "24時間365日緊急受付対応",
  primaryAreas: ["那須塩原市", "大田原市", "那須町"],
  allAreas: ["那須塩原市", "大田原市", "那須町", "矢板市", "塩谷町"],
  qualifications: [
    "一級管工事施工管理技士",
    "二級土木施工管理技士",
    "浄化槽設備士"
  ],
  waterSupplyLicenses: [
    "那須塩原市 給水装置工事指定事業者",
    "大田原市 給水装置工事指定事業者",
    "那須町 給水装置工事指定事業者",
    "矢板市 給水装置工事指定事業者",
    "塩谷町 給水装置工事指定事業者"
  ],
  drainageLicenses: [
    "那須塩原市 排水設備指定工事店",
    "大田原市 排水設備指定工事店",
    "那須町 排水設備指定工事店",
    "矢板市 排水設備指定工事店",
    "塩谷町 排水設備指定工事店"
  ],
  pricing: {
    diagnosisRegular: "3,500円",
    diagnosisRegularHours: "8:00 ～ 19:00",
    diagnosisOvertime: "5,000円",
    diagnosisOvertimeHours: "日曜・休日・平日19:00 ～ 翌8:00",
    repairStartingFrom: "1ヶ所 5,000円（税込）～"
  }
};
