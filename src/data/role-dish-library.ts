import type { RoleDishLibrary, RoleDishOption } from "@/types/menu";

const getRoleDefaultProfiles = (role: string) => {
  if (role.includes("主帥")) {
    return { thawProfile: "fish", cookingProfile: "steam-fish" } as const;
  }

  if (role.includes("開胃冷盤")) {
    return { thawProfile: "other", cookingProfile: "cold-serve" } as const;
  }

  if (role.includes("重口味大菜") || role.includes("功夫清湯肉")) {
    return { thawProfile: "meat", cookingProfile: "reheat-braise" } as const;
  }

  if (role.includes("素淨小菜")) {
    return { thawProfile: "other", cookingProfile: "reheat-veg" } as const;
  }

  if (role.includes("主食")) {
    return { thawProfile: "other", cookingProfile: "reheat-rice" } as const;
  }

  if (role.includes("壓軸大湯")) {
    return { thawProfile: "meat", cookingProfile: "reheat-soup" } as const;
  }

  if (role.includes("甜品")) {
    return { thawProfile: "other", cookingProfile: "steam-dessert" } as const;
  }

  return { thawProfile: "other", cookingProfile: "reheat-veg" } as const;
};

export const roleDishLibrary: RoleDishLibrary = {
  "【左先鋒】開胃冷盤": [
    {
      libraryId: "left-cold-1",
      role: "【左先鋒】開胃冷盤",
      dishName: "五香醬牛腱",
      cuisine: "魯菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-2",
      role: "【左先鋒】開胃冷盤",
      dishName: "鎮江水晶肴肉",
      cuisine: "江浙菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-3",
      role: "【左先鋒】開胃冷盤",
      dishName: "蒜香涼拌海蜇頭",
      cuisine: "粵菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
  ],
  "【右先鋒】開胃冷盤": [
    {
      libraryId: "right-cold-1",
      role: "【右先鋒】開胃冷盤",
      dishName: "紹興醉白蝦",
      cuisine: "江浙菜",
      premadeLevel: "解凍即食",
      thawProfile: "shrimp",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "right-cold-2",
      role: "【右先鋒】開胃冷盤",
      dishName: "煙燻甘蔗雞",
      cuisine: "台菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "right-cold-3",
      role: "【右先鋒】開胃冷盤",
      dishName: "蒜泥白肉",
      cuisine: "川菜",
      premadeLevel: "電鍋回溫後冷食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
  ],
  "【副帥】重口味大菜": [
    {
      libraryId: "vice-main-1",
      role: "【副帥】重口味大菜",
      dishName: "杭州東坡肉",
      cuisine: "江浙菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-2",
      role: "【副帥】重口味大菜",
      dishName: "無錫排骨",
      cuisine: "江浙菜",
      premadeLevel: "瓦斯爐收汁加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-3",
      role: "【副帥】重口味大菜",
      dishName: "梅干扣肉",
      cuisine: "客家菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
  ],
  "【主帥】壓軸定海神針": [
    {
      libraryId: "main-fish-1",
      role: "【主帥】壓軸定海神針",
      dishName: "古法樹子蒸鱸魚",
      cuisine: "台菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "fish",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-2",
      role: "【主帥】壓軸定海神針",
      dishName: "豆豉清蒸石斑魚",
      cuisine: "粵菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "fish",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-3",
      role: "【主帥】壓軸定海神針",
      dishName: "破布子蒸午仔魚",
      cuisine: "台菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "fish",
      cookingProfile: "steam-fish",
    },
  ],
  "【溫潤後勤】功夫清湯肉": [
    {
      libraryId: "soup-meat-1",
      role: "【溫潤後勤】功夫清湯肉",
      dishName: "清燉獅子頭",
      cuisine: "淮揚菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "soup-meat-2",
      role: "【溫潤後勤】功夫清湯肉",
      dishName: "砂鍋醃篤鮮",
      cuisine: "江浙菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "soup-meat-3",
      role: "【溫潤後勤】功夫清湯肉",
      dishName: "蘿蔔清燉牛腩",
      cuisine: "台式家常",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
  ],
  "【清口綠葉】素淨小菜": [
    {
      libraryId: "veg-1",
      role: "【清口綠葉】素淨小菜",
      dishName: "上湯煨娃娃菜",
      cuisine: "粵菜",
      premadeLevel: "電鍋/微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-2",
      role: "【清口綠葉】素淨小菜",
      dishName: "蟹粉扒津白",
      cuisine: "淮揚菜",
      premadeLevel: "電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-3",
      role: "【清口綠葉】素淨小菜",
      dishName: "干貝絲燴白菜",
      cuisine: "台菜",
      premadeLevel: "微波/瓦斯爐加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
  ],
  "【飽腹擔當】主食": [
    {
      libraryId: "staple-1",
      role: "【飽腹擔當】主食",
      dishName: "廣式臘味糯米飯",
      cuisine: "粵菜",
      premadeLevel: "電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-2",
      role: "【飽腹擔當】主食",
      dishName: "櫻花蝦油飯",
      cuisine: "台菜",
      premadeLevel: "電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-3",
      role: "【飽腹擔當】主食",
      dishName: "干貝芋香米糕",
      cuisine: "台菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
  ],
  "【靈魂洗滌】壓軸大湯": [
    {
      libraryId: "soup-1",
      role: "【靈魂洗滌】壓軸大湯",
      dishName: "原盅蒜頭燉土雞湯",
      cuisine: "台菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-2",
      role: "【靈魂洗滌】壓軸大湯",
      dishName: "干貝竹笙雞湯",
      cuisine: "粵菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "soup-3",
      role: "【靈魂洗滌】壓軸大湯",
      dishName: "剝皮辣椒燉雞湯",
      cuisine: "台菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
  ],
  "【甜蜜餘韻】甜品": [
    {
      libraryId: "dessert-1",
      role: "【甜蜜餘韻】甜品",
      dishName: "冰糖紫米紅豆湯",
      cuisine: "傳統中式",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-2",
      role: "【甜蜜餘韻】甜品",
      dishName: "桂圓銀耳蓮子湯",
      cuisine: "傳統中式",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-3",
      role: "【甜蜜餘韻】甜品",
      dishName: "紅豆年糕甜湯",
      cuisine: "台式甜品",
      premadeLevel: "電鍋加熱",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
  ],
};

export const getRoleDishOptions = (role: string) => roleDishLibrary[role] ?? [];

export const createEmptyRoleDishOption = (role: string): RoleDishOption => ({
  libraryId: `custom-${role}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  role,
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
