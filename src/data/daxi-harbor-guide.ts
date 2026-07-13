export type DaxiIngredientCategory =
  | "fish"
  | "shrimp"
  | "cephalopod"
  | "crab"
  | "mixed";

export type DaxiPriceRange = {
  low: number;
  market: number;
  high: number;
};

export type DaxiIngredient = {
  name: string;
  category: DaxiIngredientCategory;
  pricePerKg: DaxiPriceRange;
  recommendedMethod: string;
  valueNote: string;
};

export type DaxiComparisonEntry = {
  species: string;
  identification: string;
  texture: string;
};

export type DaxiSpecialEntry = {
  name: string;
  valueCore: string;
  bestPortion?: string;
};

export type DaxiWeightTier = {
  label: string;
  weight: string;
  range: string;
  hint: string;
};

export const daxiCategoryLabels: Record<DaxiIngredientCategory, string> = {
  fish: "魚類",
  shrimp: "蝦類",
  cephalopod: "頭足類",
  crab: "蟹類",
  mixed: "綜合",
};

export const daxiGoldenList: DaxiIngredient[] = [
  { name: "夢幻石鯛", category: "fish", pricePerKg: { low: 1200, market: 1800, high: 2500 }, recommendedMethod: "清蒸", valueNote: "魚皮極厚、去鱗極難，必交專業處理。" },
  { name: "紅喉", category: "fish", pricePerKg: { low: 1100, market: 1350, high: 1700 }, recommendedMethod: "清蒸、鹽烤", valueNote: "深海和牛，油脂極豐，強蒸氣鎖住油旨。" },
  { name: "龍蝦(活)", category: "shrimp", pricePerKg: { low: 1200, market: 1500, high: 1800 }, recommendedMethod: "蒜泥清蒸", valueNote: "單價極高，專業放尿分切確保食材價值。" },
  { name: "燕尾紅條石斑", category: "fish", pricePerKg: { low: 650, market: 850, high: 1100 }, recommendedMethod: "清蒸", valueNote: "尾鰭深叉如燕尾，石斑中極品，膠質厚實。" },
  { name: "紅條(七星斑)", category: "fish", pricePerKg: { low: 700, market: 900, high: 1200 }, recommendedMethod: "清蒸", valueNote: "宴客頂級魚，肉質極細嫩，需大火力蒸氣。" },
  { name: "石老", category: "fish", pricePerKg: { low: 600, market: 850, high: 1100 }, recommendedMethod: "清蒸", valueNote: "肉質如布丁綿密，精準溫控避免化掉。" },
  { name: "軟絲(大)", category: "cephalopod", pricePerKg: { low: 650, market: 800, high: 950 }, recommendedMethod: "白灼、金沙", valueNote: "食材單價高，餐廳大火快炒「鑊氣」強。" },
  { name: "錢鰻(野生)", category: "mixed", pricePerKg: { low: 300, market: 425, high: 550 }, recommendedMethod: "三杯", valueNote: "處理黏液與細刺耗時，高溫油炸是關鍵。" },
  { name: "黑喉", category: "fish", pricePerKg: { low: 650, market: 800, high: 1050 }, recommendedMethod: "乾煎、清蒸", valueNote: "皮薄肉嫩，師傅乾煎能皮酥肉嫩不破相。" },
  { name: "紅馬頭(大)", category: "fish", pricePerKg: { low: 500, market: 750, high: 1000 }, recommendedMethod: "酥煎、清蒸", valueNote: "含水高，師傅大油鍋煎出家用難及酥度。" },
  { name: "真鯛(嘉鱲)", category: "fish", pricePerKg: { low: 450, market: 650, high: 900 }, recommendedMethod: "清蒸", valueNote: "魚中之王，肉質細雅，強蒸氣鎖住肉汁。" },
  { name: "黑大目(大)", category: "fish", pricePerKg: { low: 550, market: 700, high: 850 }, recommendedMethod: "清蒸、鹽烤", valueNote: "深海油脂保險，避免肉質縮掉流失精華。" },
  { name: "石狗公", category: "fish", pricePerKg: { low: 350, market: 450, high: 600 }, recommendedMethod: "薑絲魚湯", valueNote: "有毒刺難處理，湯頭鮮度直逼龍蝦。" },
  { name: "花蟹(大)", category: "crab", pricePerKg: { low: 800, market: 1050, high: 1300 }, recommendedMethod: "清蒸", valueNote: "避開家用蒸鍋肉縮風險，保持肉質飽滿。" },
  { name: "鸚哥魚", category: "fish", pricePerKg: { low: 350, market: 500, high: 650 }, recommendedMethod: "清蒸", valueNote: "鱗片如盔甲，厚皮需強蒸氣才不變韌。" },
  { name: "明蝦(大)", category: "shrimp", pricePerKg: { low: 800, market: 1000, high: 1200 }, recommendedMethod: "鹽烤、金沙", valueNote: "蝦中貴族，專業高溫烤爐/油鍋鎖住甜度。" },
  { name: "青口龍占", category: "fish", pricePerKg: { low: 400, market: 550, high: 750 }, recommendedMethod: "清蒸、鹽烤", valueNote: "肉質雪白鮮甜無土味，適合全家共食。" },
  { name: "赤宗/馬頭", category: "fish", pricePerKg: { low: 450, market: 650, high: 850 }, recommendedMethod: "清蒸、乾煎", valueNote: "大溪指標名產，肉質細，師傅控火保險。" },
  { name: "胭脂蝦(大)", category: "shrimp", pricePerKg: { low: 550, market: 700, high: 850 }, recommendedMethod: "刺身+鹽烤", valueNote: "蝦肉軟嫩，鹽烤脫水濃縮甜味是專業法。" },
  { name: "角蝦(大)", category: "shrimp", pricePerKg: { low: 700, market: 850, high: 1000 }, recommendedMethod: "鹽烤", valueNote: "殼硬如鐵，烤後香氣逼人且較易剝殼。" },
  { name: "透抽(大)", category: "cephalopod", pricePerKg: { low: 450, market: 600, high: 750 }, recommendedMethod: "三杯、五味", valueNote: "肉質厚，大火快炒確保口感脆而不韌。" },
  { name: "紅目鰱", category: "fish", pricePerKg: { low: 300, market: 400, high: 500 }, recommendedMethod: "清蒸(剝皮)", valueNote: "皮如砂紙需專業剝皮，肉細如雞肉。" },
];

export const daxiSkipList: DaxiIngredient[] = [
  { name: "土魠/白北", category: "fish", pricePerKg: { low: 450, market: 650, high: 850 }, recommendedMethod: "乾煎", valueNote: "食材平價，自行煎製即可，省下代工費。" },
  { name: "安康魚(身)", category: "fish", pricePerKg: { low: 150, market: 225, high: 300 }, recommendedMethod: "酥炸", valueNote: "處理簡單，CP 值低，自理即可。" },
  { name: "深海小鱈魚", category: "fish", pricePerKg: { low: 200, market: 325, high: 450 }, recommendedMethod: "乾煎", valueNote: "體型小易處理，代工費相對不划算。" },
  { name: "花枝(大)", category: "cephalopod", pricePerKg: { low: 400, market: 550, high: 700 }, recommendedMethod: "椒鹽", valueNote: "常見食材，處理工序簡單。" },
  { name: "三點蟹", category: "crab", pricePerKg: { low: 350, market: 475, high: 600 }, recommendedMethod: "清蒸", valueNote: "殼薄易熟，自行蒸煮難度低。" },
  { name: "白帶魚(大)", category: "fish", pricePerKg: { low: 250, market: 375, high: 500 }, recommendedMethod: "乾煎", valueNote: "家常食材，建議買回家自理。" },
  { name: "石喬/牛蹄蟹", category: "mixed", pricePerKg: { low: 150, market: 250, high: 350 }, recommendedMethod: "煮湯", valueNote: "價格便宜，CP 值偏低。" },
];

export const daxiWeightTiers: DaxiWeightTier[] = [
  {
    label: "下限",
    weight: "0.6 kg",
    range: "1 台斤",
    hint: "低於此重量，工錢佔比太高，爽度不足。",
  },
  {
    label: "最佳",
    weight: "1.0 kg",
    range: "1.6 台斤",
    hint: "黃金數值。份量最滿，200 元效益最高。",
  },
  {
    label: "上限",
    weight: "1.2 kg",
    range: "2 台斤",
    hint: "超過此重量，店家極高機率要求收兩份工錢。",
  },
];

export const daxiRedVsYan: DaxiComparisonEntry[] = [
  {
    species: "七星斑(紅條)",
    identification: "尾鰭後緣圓形，身上佈滿密集細碎小藍點。",
    texture: "肉質最為細嫩，稍微蒸過頭就會散掉。",
  },
  {
    species: "燕尾紅條石斑",
    identification: "尾鰭呈明顯燕尾/月牙狀，紅色帶藍點。",
    texture: "兼具細嫩與 Q 度，皮感更為紮實。",
  },
];

export const daxiPrawnSpecial: DaxiSpecialEntry = {
  name: "明蝦 (Kuruma Prawn)",
  valueCore: "肉質極紮實，專業鹽烤能逼出蝦殼焦香，保持內部 Q 彈。",
  bestPortion: "一公斤約 8-12 隻。",
};

export const DAXI_PROCESSING_FEE = 200;

export const DAXI_GUIDE_STORAGE_KEY = "banquet-menu-admin:daxi-guide";