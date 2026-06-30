import type { RoleDishLibrary, RoleDishOption } from "@/types/menu";

const roleAliasMap: Record<string, string> = {
  "【中場過場湯】湯品": "【承啟中湯】湯品",
  "【壓軸燉湯】湯品": "【壓軸大湯】湯品",
  "【中式甜品】甜品": "【晏尾甜品】甜品",
};

export const normalizeRoleName = (role: string) => roleAliasMap[role] ?? role;

export const getEquivalentRoleNames = (role: string) => {
  const canonicalRole = normalizeRoleName(role);

  return Array.from(
    new Set(
      [canonicalRole].concat(
        Object.entries(roleAliasMap)
          .filter(([, targetRole]) => targetRole === canonicalRole)
          .map(([aliasRole]) => aliasRole),
      ),
    ),
  );
};

const getRoleDefaultProfiles = (role: string) => {
  const normalizedRole = normalizeRoleName(role);

  if (normalizedRole.includes("海鮮大菜")) {
    return { thawProfile: "fish", cookingProfile: "steam-fish" } as const;
  }

  if (normalizedRole.includes("迎賓冷盤")) {
    return { thawProfile: "other", cookingProfile: "cold-serve" } as const;
  }

  if (normalizedRole.includes("燒燴大菜")) {
    return { thawProfile: "meat", cookingProfile: "reheat-braise" } as const;
  }

  if (normalizedRole.includes("承啟中湯") || normalizedRole.includes("壓軸大湯")) {
    return { thawProfile: "meat", cookingProfile: "reheat-soup" } as const;
  }

  if (normalizedRole.includes("季節時蔬")) {
    return { thawProfile: "other", cookingProfile: "reheat-veg" } as const;
  }

  if (normalizedRole.includes("主食飯麵")) {
    return { thawProfile: "other", cookingProfile: "reheat-rice" } as const;
  }

  if (normalizedRole.includes("晏尾甜品")) {
    return { thawProfile: "other", cookingProfile: "steam-dessert" } as const;
  }

  return { thawProfile: "other", cookingProfile: "reheat-veg" } as const;
};

export const roleDishLibrary: RoleDishLibrary = {
  "【迎賓冷盤一】迎賓冷盤": [
    {
      libraryId: "left-cold-1",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "五香醬牛腱",
      cuisine: "魯菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-2",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "鎮江水晶肴肉",
      cuisine: "江浙菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-3",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "老醋陳皮拌雲耳",
      cuisine: "大眾中式",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-5",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "煙燻甘蔗雞",
      cuisine: "台菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-6",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "紹興醉雞卷",
      cuisine: "江浙菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-7",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "麻辣涼拌腐竹",
      cuisine: "川菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
  ],
  "【迎賓冷盤二】迎賓冷盤": [
    {
      libraryId: "right-cold-1",
      role: "【迎賓冷盤二】迎賓冷盤",
      dishName: "紹興醉白蝦",
      cuisine: "江浙菜",
      premadeLevel: "解凍即食",
      thawProfile: "shrimp",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "right-cold-2",
      role: "【迎賓冷盤二】迎賓冷盤",
      dishName: "蒜香涼拌海蜇頭",
      cuisine: "粵菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "right-cold-4",
      role: "【迎賓冷盤二】迎賓冷盤",
      dishName: "五味冰卷",
      cuisine: "台菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "right-cold-6",
      role: "【迎賓冷盤二】迎賓冷盤",
      dishName: "夫妻肺片",
      cuisine: "川菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "right-cold-7",
      role: "【迎賓冷盤二】迎賓冷盤",
      dishName: "五味九孔鮑",
      cuisine: "台菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
  ],
  "【燒燴大菜】主菜": [
    {
      libraryId: "vice-main-1",
      role: "【燒燴大菜】主菜",
      dishName: "杭州東坡肉",
      cuisine: "江浙菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-2",
      role: "【燒燴大菜】主菜",
      dishName: "無錫排骨",
      cuisine: "江浙菜",
      premadeLevel: "瓦斯爐收汁加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-3",
      role: "【燒燴大菜】主菜",
      dishName: "梅干扣肉",
      cuisine: "客家菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-4",
      role: "【燒燴大菜】主菜",
      dishName: "蔥燒鮮烏參",
      cuisine: "魯菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-5",
      role: "【燒燴大菜】主菜",
      dishName: "柱侯蘿蔔牛腩煲",
      cuisine: "粵菜",
      premadeLevel: "瓦斯爐/微波加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-7",
      role: "【燒燴大菜】主菜",
      dishName: "鎮江排骨",
      cuisine: "江浙菜",
      premadeLevel: "瓦斯爐收汁加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-8",
      role: "【燒燴大菜】主菜",
      dishName: "客家小炒",
      cuisine: "客家菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-9",
      role: "【燒燴大菜】主菜",
      dishName: "台式紅燒羊肉爐",
      cuisine: "台菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
  ],
  "【海鮮大菜】主菜": [
    {
      libraryId: "main-fish-2",
      role: "【海鮮大菜】主菜",
      dishName: "豆豉清蒸石斑魚",
      cuisine: "粵菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "fish",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-3",
      role: "【海鮮大菜】主菜",
      dishName: "破布子蒸午仔魚",
      cuisine: "台菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "fish",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-5",
      role: "【海鮮大菜】主菜",
      dishName: "蒜蓉粉絲蒸扇貝",
      cuisine: "粵菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-6",
      role: "【海鮮大菜】主菜",
      dishName: "乾燒明蝦",
      cuisine: "川菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "shrimp",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "main-fish-8",
      role: "【海鮮大菜】主菜",
      dishName: "蒜蓉蒸波士頓龍蝦",
      cuisine: "粵菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-9",
      role: "【海鮮大菜】主菜",
      dishName: "三杯中卷",
      cuisine: "台菜",
      premadeLevel: "微波/瓦斯爐加熱",
      thawProfile: "other",
      cookingProfile: "reheat-braise",
    },
  ],
  "【承啟中湯】湯品": [
    {
      libraryId: "soup-meat-1",
      role: "【承啟中湯】湯品",
      dishName: "清燉獅子頭",
      cuisine: "淮揚菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-meat-2",
      role: "【承啟中湯】湯品",
      dishName: "砂鍋醃篤鮮",
      cuisine: "江浙菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-meat-3",
      role: "【承啟中湯】湯品",
      dishName: "蘿蔔清燉牛腩",
      cuisine: "台菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-meat-4",
      role: "【承啟中湯】湯品",
      dishName: "翡翠海鮮羹",
      cuisine: "粵菜",
      premadeLevel: "瓦斯爐/微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-soup",
    },
  ],
  "【季節時蔬】蔬菜": [
    {
      libraryId: "veg-1",
      role: "【季節時蔬】蔬菜",
      dishName: "上湯煨娃娃菜",
      cuisine: "粵菜",
      premadeLevel: "電鍋/微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-2",
      role: "【季節時蔬】蔬菜",
      dishName: "白果炒芥菜",
      cuisine: "台菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-3",
      role: "【季節時蔬】蔬菜",
      dishName: "蘆筍炒百合",
      cuisine: "台菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-5",
      role: "【季節時蔬】蔬菜",
      dishName: "蠔油鮮菇燴芥蘭",
      cuisine: "粵菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
  ],
  "【主食飯麵】主食": [
    {
      libraryId: "staple-2",
      role: "【主食飯麵】主食",
      dishName: "櫻花蝦油飯",
      cuisine: "台菜",
      premadeLevel: "電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-4",
      role: "【主食飯麵】主食",
      dishName: "干燒伊麵",
      cuisine: "粵菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-5",
      role: "【主食飯麵】主食",
      dishName: "奶黃壽桃包",
      cuisine: "中式點心",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-6",
      role: "【主食飯麵】主食",
      dishName: "臘味排骨米糕",
      cuisine: "粵菜",
      premadeLevel: "電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-7",
      role: "【主食飯麵】主食",
      dishName: "台式古早味炒米粉",
      cuisine: "台菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
  ],
  "【壓軸大湯】湯品": [
    {
      libraryId: "soup-1",
      role: "【壓軸大湯】湯品",
      dishName: "原盅蒜頭燉土雞湯",
      cuisine: "台菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-2",
      role: "【壓軸大湯】湯品",
      dishName: "干貝竹笙雞湯",
      cuisine: "粵菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-3",
      role: "【壓軸大湯】湯品",
      dishName: "台式佛跳牆",
      cuisine: "台菜",
      premadeLevel: "電鍋加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-4",
      role: "【壓軸大湯】湯品",
      dishName: "白胡椒豬肚排骨湯",
      cuisine: "客家菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
  ],
  "【晏尾甜品】甜品": [
    {
      libraryId: "dessert-1",
      role: "【晏尾甜品】甜品",
      dishName: "冰糖紫米紅豆湯",
      cuisine: "大眾中式",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-2",
      role: "【晏尾甜品】甜品",
      dishName: "桂圓銀耳蓮子湯",
      cuisine: "大眾中式",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-3",
      role: "【晏尾甜品】甜品",
      dishName: "芋泥椰汁西米露",
      cuisine: "粵菜",
      premadeLevel: "解凍即食冷食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "dessert-4",
      role: "【晏尾甜品】甜品",
      dishName: "冰糖燉雪梨",
      cuisine: "大眾中式",
      premadeLevel: "電鍋熱食或冷飲",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
  ],
};

export const getRoleDishOptions = (role: string) =>
  roleDishLibrary[normalizeRoleName(role)] ?? [];

export const createEmptyRoleDishOption = (role: string): RoleDishOption => ({
  libraryId: `custom-${normalizeRoleName(role)}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`,
  role: normalizeRoleName(role),
  dishName: "請輸入候選菜名",
  cuisine: "請輸入菜系",
  premadeLevel: "請輸入預製度",
  ...getRoleDefaultProfiles(role),
});

export const cloneRoleDishLibrary = (): RoleDishLibrary =>
  Object.fromEntries(
    Object.entries(roleDishLibrary).map(([role, options]) => [
      role,
      options.map((option) => ({ ...option })),
    ]),
  );
