import type { ThawGuide } from "@/types/menu";

export const thawGuides: ThawGuide[] = [
  {
    key: "fish",
    label: "魚類冷凍食",
    shortLabel: "魚類",
    best: {
      title: "3% 鹽冰水解凍法",
      score: 9.8,
      method:
        "以 1000 ml 冰水加入 30 g 食鹽調成 3% 鹽冰水，魚片或海鮮拆袋後浸泡 15 至 30 分鐘，微軟即擦乾。",
      reason: "最能維持海鮮滲透壓與保水性，肉質緊實、腥味低、色澤最穩。",
    },
    secondBest: {
      title: "冷藏緩慢解凍",
      score: 9,
      method: "料理前 12 至 24 小時移入冷藏，維持低溫慢退冰，適合整尾魚或厚切魚件。",
      reason: "安全且失水少，操作最穩，但速度較慢、去腥效果略弱於鹽冰水。",
    },
    reminder: "整尾蒸魚若不急，優先前一晚冷藏；急用的魚片或海鮮再改走 3% 鹽冰水。",
  },
  {
    key: "shrimp",
    label: "蝦類冷凍食",
    shortLabel: "蝦類",
    best: {
      title: "密封流水解凍法",
      score: 9.5,
      method: "維持包裝或裝入密封袋後，以細流水沖 10 至 15 分鐘，退到微冰芯就停止。",
      reason: "能快速通過最脆弱的退冰階段，降低黑頭、出水與粉爛風險。",
    },
    secondBest: {
      title: "3% 鹽水快速浸泡",
      score: 8.8,
      method: "裸裝散凍蝦仁可直接泡入 3% 常溫鹽水，短時間退冰後立刻瀝乾。",
      reason: "比清水浸泡更能維持彈性，適合無法沖流水的散凍蝦仁。",
    },
    reminder: "蝦最怕慢退冰，退到剛軟即可瀝乾冷藏，避免放著回溫過頭造成黑頭。",
  },
  {
    key: "meat",
    label: "肉類冷凍食",
    shortLabel: "肉類",
    best: {
      title: "冷藏低溫解凍",
      score: 9.8,
      method: "料理前 12 至 24 小時移入冷藏，下鍋前再回溫 20 至 30 分鐘。",
      reason: "血水流失最少、肉汁保留最好，是最穩定的主力方案。",
    },
    secondBest: {
      title: "鋁盆夾擊快速解凍",
      score: 8,
      method: "把肉連包裝平放在兩個鋁盆或金屬解凍板之間，加速導熱退冰。",
      reason: "適合臨時救急，速度快於冷藏，且比熱水或微波更不容易毀掉肉質。",
    },
    reminder: "大塊肉與雞湯類盡量前一晚冷藏，臨時才用金屬導熱法，不建議熱水或高火微波。",
  },
];

export const thawGuideMap = Object.fromEntries(
  thawGuides.map((guide) => [guide.key, guide]),
) as Record<ThawGuide["key"], ThawGuide>;
