export type CulinaryTechniqueCategory =
  | "protein"
  | "soup"
  | "non-meat-protein"
  | "fiber"
  | "all-in-one";

export type CulinaryTechniqueEntry = {
  label: string;
  cuisine: string;
  goldenRatio?: string;
  coreTechnique: string;
  steps?: string;
  troubleshooting?: { problem: string; solution: string };
  score?: number;
};

export type CulinaryTechniqueSection = {
  key: CulinaryTechniqueCategory;
  label: string;
  coreTech: string;
  entries: CulinaryTechniqueEntry[];
};

export type CulinarySkillLevel = "entry" | "intermediate" | "master";

export type CulinarySkillRecommendation = {
  level: CulinarySkillLevel;
  label: string;
  dishes: string[];
};

export const culinaryTechniques: CulinaryTechniqueSection[] = [
  {
    key: "protein",
    label: "核心蛋白質",
    coreTech: "低溫熟化、皮脂煉油、蛋白質水合與打漿",
    entries: [
      {
        label: "手打白魚丸",
        cuisine: "潮州",
        goldenRatio:
          "魚肉 500g : 鹽 10g (2%) : 冰水 50ml",
        coreTechnique:
          "「刮青」與「鹽激蛋白質」——練習完全不靠硼砂也能達到「彈牙」的正統技術",
        steps: `刮青：用湯匙將魚肉順著骨頭刮下，避開紅肉與魚刺，保持純白。
鹽激：加入配方中的鹽，用手朝同一個方向快速攪打，直到魚肉產生強烈阻力與黏性（俗稱起膠）。
打水：將冰水分三次加入，每次都要確定水分被完全吸收。
定型：將魚漿從虎口擠出成丸，落入冷水盆中定型。`,
        troubleshooting: {
          problem: "魚漿越打越稀，無法成團？",
          solution:
            "這通常是「摩擦生熱」導致蛋白質提早熟化變性。請立即將攪拌盆底部墊上冰塊，或移入冰箱冷藏 15 分鐘降溫後，再繼續攪打。",
        },
        score: 9.5,
      },
      {
        label: "白切雞",
        cuisine: "粵式",
        goldenRatio: "薑蓉 : 蔥白末 : 鹽 : 熱雞油 = 1 : 1 : 0.1 : 2",
        coreTechnique:
          "「蝦眼水」浸熟技術——練習低溫熟化，追求皮Q肉嫩",
        steps: `燙皮定型：提著雞頭，將全雞浸入滾水中燙 5 秒後提起，重複三次，利用熱脹冷縮讓雞皮緊縮不破。
微溫浸泡：將火候轉至極微小，使鍋底持續冒出如蝦眼般大小的細小氣泡（水溫約 85°C）。將全雞浸入，加蓋悶 20 分鐘。
冰鎮收縮：起鍋後立刻將雞浸入大量冰水中 10 分鐘，這是讓皮質脆Q的核心。`,
        troubleshooting: {
          problem: "切開發現骨髓帶有血水，是不是沒熟？",
          solution:
            "正統白切雞追求「骨中帶血，肉已全熟」的極致嫩度，這是成功而非失敗。若實在不敢吃，可將浸泡時間延長 5 分鐘，但肉質會稍微流失水分。",
        },
        score: 10,
      },
      {
        label: "香煎雞胸配檸檬醬汁",
        cuisine: "法式",
        coreTechnique: "核心溫度 63°C–65°C，練習「洗鍋醬汁」",
        score: 9.2,
      },
      {
        label: "香煎鴨胸",
        cuisine: "法式",
        coreTechnique: "冷鍋煉油，核心溫度 57°C (五分熟) 為正統標準",
        score: 9.1,
      },
      {
        label: "蔥油清蒸石斑/鱸魚",
        cuisine: "粵式",
        goldenRatio: "蒸魚豉油 原汁:生抽:涼水:糖 = 1:2:2:0.5",
        coreTechnique: "大火蒸 8–10 分鐘，關火虛蒸 2 分鐘，最後淋熱油",
        score: 9.5,
      },
      {
        label: "清炒蝦仁",
        cuisine: "淮揚",
        goldenRatio: "500g 蝦仁 : 鹽 5g : 蛋清 1/3 個 : 乾澱粉 10g",
        coreTechnique: "上漿公式——保護蝦仁水分不流失",
        score: 9.3,
      },
      {
        label: "清燉獅子頭",
        cuisine: "淮揚",
        goldenRatio: "肉量:水 = 1:0.3，鹽佔肉重 1.5%",
        coreTechnique: "細切粗剁，保留肉質顆粒感，小火慢燉 2 小時",
        score: 9,
      },
    ],
  },
  {
    key: "soup",
    label: "養生湯品",
    coreTech: "高湯澄清、精華萃取、去腥工藝",
    entries: [
      {
        label: "薑絲魚皮湯",
        cuisine: "台式",
        coreTechnique: "15–20 秒極速熟化技術——魚皮Q彈不糊爛的關鍵",
        score: 9,
      },
      {
        label: "法式澄清雞湯 (Consommé)",
        cuisine: "法式",
        goldenRatio: "1L 雞高湯 : 150g 雞絞肉 : 2 蛋清",
        coreTechnique: "蛋白質遇熱凝結，捕捉懸浮雜質，達到完美澄清",
        score: 9.8,
      },
      {
        label: "正統味噌高湯",
        cuisine: "日式",
        goldenRatio: "水 1L : 昆布 10g : 柴魚片 20g",
        coreTechnique: "出汁（だし）——昆布冷水下鍋，小火慢煮至冒泡前撈起，再加柴魚片熄火浸泡",
        score: 9.5,
      },
    ],
  },
  {
    key: "non-meat-protein",
    label: "非肉類蛋白",
    coreTech: "卵水比例、凝固點掌控",
    entries: [
      {
        label: "茶碗蒸",
        cuisine: "日式",
        goldenRatio: "蛋液 : 柴魚高湯 = 1 : 3",
        coreTechnique: "中火蒸 10–12 分鐘，鍋蓋留縫或鋪布吸蒸氣，避免蜂窩",
        score: 9.2,
      },
      {
        label: "溫泉蛋",
        cuisine: "日式",
        coreTechnique: "水溫 67°C : 時間 22 分鐘",
        score: 9.4,
      },
      {
        label: "西芹炒香乾",
        cuisine: "中式",
        coreTechnique: "豆乾先煸至脫水 20% 再下調味——香氣與嚼勁的關鍵",
        score: 8.5,
      },
    ],
  },
  {
    key: "fiber",
    label: "纖維與根莖",
    coreTech: "鹹甜平衡、油脂分布",
    entries: [
      {
        label: "西芹百合炒腰果",
        cuisine: "中式",
        coreTechnique: "薄芡——澱粉水比例 1:10，掛薄不掛厚",
        score: 8.8,
      },
      {
        label: "金平牛蒡",
        cuisine: "日式",
        goldenRatio: "生抽 : 味醂 : 砂糖 = 2 : 2 : 1",
        coreTechnique: "細切後泡水去澀，大火快炒收乾",
        score: 8.9,
      },
    ],
  },
  {
    key: "all-in-one",
    label: "全能一鍋與麵食",
    coreTech: "澱粉熟化掌控、水米比例、乳化技術",
    entries: [
      {
        label: "蒜香辣椒義大利麵",
        cuisine: "義大利",
        goldenRatio:
          "水 1000ml : 麵條 100g : 鹽 10g (1% 鹽水)",
        coreTechnique: "「Al Dente」熟度與油水乳化——麵心保留一絲白色",
        steps: `黃金鹽水：在滾水中加入 1% 的鹽（嚐起來像海水），放入麵條。
冷油冷蒜：平底鍋倒入初榨橄欖油，加入蒜片，開微火慢慢煸出蒜香直到呈現微金黃色。
乳化收汁：在麵條包裝建議時間的「前 2 分鐘」撈起麵條放入平底鍋。加入一勺煮麵水，快速晃動平底鍋，讓澱粉水與橄欖油融合成絲綢般的醬汁。
Al Dente：麵條咬開中心應保留一絲白色麵心。`,
        troubleshooting: {
          problem: "醬汁無法變成濃稠乳白色，麵底是一灘油水分離的液體？",
          solution:
            "這代表「澱粉」與「油脂」沒有充分結合。請補加半勺煮麵水，並開大火「劇烈晃動」平底鍋 15 秒，強迫熱力與澱粉將油水強制乳化。",
        },
        score: 9.6,
      },
      {
        label: "蕎麥冷麵",
        cuisine: "日式",
        goldenRatio: "沾汁 (Tsuyu) 出汁 : 生抽 : 味醂 = 4 : 1 : 1",
        coreTechnique: "「極速冷卻」與「Tsuyu」調配——麵條冰鎮後口感更Q",
        score: 9.1,
      },
      {
        label: "親子丼",
        cuisine: "日式",
        goldenRatio: "高湯 : 生抽 : 味醂 : 砂糖 = 4 : 1 : 1 : 0.5",
        coreTechnique: "蛋液分兩次下——第一次定型、第二次半熟滑嫩",
        score: 9,
      },
      {
        label: "窩蛋牛肉煲仔飯",
        cuisine: "粵式",
        goldenRatio: "米水比 1 : 1.1",
        coreTechnique: "砂鍋預熱、飯水同步沸騰、鍋巴金黃不焦",
        score: 9.3,
      },
      {
        label: "西班牙海鮮飯",
        cuisine: "西班牙",
        goldenRatio: "乾爽比 1 : 3",
        coreTechnique: "「Paella」——底部鍋巴 (Socarrat) 是靈魂，大米收乾所有湯汁",
        score: 9.4,
      },
    ],
  },
];

export const culinarySkillRecommendations: CulinarySkillRecommendation[] = [
  {
    level: "entry",
    label: "入門級",
    dishes: ["茶碗蒸", "蕎麥冷麵", "薑絲魚皮湯"],
  },
  {
    level: "intermediate",
    label: "進階級",
    dishes: ["蒜香辣椒麵", "手打魚丸", "蝦仁滑蛋"],
  },
  {
    level: "master",
    label: "大師級",
    dishes: ["清燉獅子頭", "法式澄清雞湯", "西班牙海鮮飯"],
  },
];

export const culinaryGuideMap = Object.fromEntries(
  culinaryTechniques.map((section) => [section.key, section]),
) as Record<CulinaryTechniqueCategory, CulinaryTechniqueSection>;

export const CULINARY_GUIDE_STORAGE_KEY = "banquet-menu-admin:culinary-guide";
