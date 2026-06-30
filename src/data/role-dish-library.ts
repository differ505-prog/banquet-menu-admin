import type {
  DishMetadata,
  MenuDish,
  PoolDiversityRadarItem,
  PoolDiversityWarning,
  ReheatMethod,
  RoleDishLibrary,
  RoleDishOption,
  SupportedPoolReheatMethod,
} from "@/types/menu";

const roleAliasMap: Record<string, string> = {
  "【中場過場湯】湯品": "【承啟中湯】湯品",
  "【壓軸燉湯】湯品": "【壓軸大湯】湯品",
  "【中式甜品】甜品": "【晏尾甜品】甜品",
  "【季節時蔬】蔬菜": "【燴扒蔬蕈】蔬菜",
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

  if (normalizedRole.includes("季節時蔬") || normalizedRole.includes("燴扒蔬蕈")) {
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

const REHEAT_METHOD_LABELS: Record<ReheatMethod, string[]> = {
  GAS_STOVE: ["瓦斯爐"],
  RICE_COOKER: ["電鍋"],
  MICROWAVE: ["微波"],
  OVEN: ["烤箱"],
  AIR_FRYER: ["氣炸鍋", "氣炸烤箱", "氣炸"],
};

const SUPPORTED_POOL_REHEAT_METHODS: SupportedPoolReheatMethod[] = [
  "GAS_STOVE",
  "RICE_COOKER",
  "MICROWAVE",
];

const parseReheatMethods = (premadeLevel: string): ReheatMethod[] =>
  (Object.entries(REHEAT_METHOD_LABELS) as Array<[ReheatMethod, string[]]>)
    .filter(([, labels]) => labels.some((label) => premadeLevel.includes(label)))
    .map(([method]) => method);

const inferPrimaryIngredient = (dishName: string, role: string) => {
  if (/(牛腱|牛腩|牛柳|牛臉頰|牛肉)/.test(dishName)) return "beef";
  if (/羊/.test(dishName)) return "lamb";
  if (/雞/.test(dishName)) return "chicken";
  if (/鴨/.test(dishName)) return "duck";
  if (/(豬|排骨|肴肉|獅子頭|扣肉|五花|豬肚)/.test(dishName)) return "pork";
  if (/(石斑|午仔魚|魚頭|海鱸魚|魚片|魚)/.test(dishName)) return "fish";
  if (/(蝦|蟹|貝|鮑)/.test(dishName)) return "shellfish";
  if (/(海參|烏參|花膠)/.test(dishName)) return "sea_cucumber";
  if (/(豆腐|豆皮|腐竹|百葉|烤麩)/.test(dishName)) return "soy";
  if (/藕/.test(dishName)) return "lotus_root";
  if (/(米飯|炒飯|菜飯|米糕|油飯|糯米|拌麵|炒麵|蘿蔔糕)/.test(dishName)) return "staple";
  if (/(菇|雲耳|木耳|筍|娃娃菜|南瓜|冬瓜|蘿蔔|猴頭菇)/.test(dishName)) return "vegetable";
  if (role.includes("甜品")) return "dessert";
  if (role.includes("主食")) return "staple";
  return "mixed";
};

const inferFlavorProfile = (dishName: string) => {
  if (/(紅燒|柱侯|醬香|豉汁|豆豉)/.test(dishName)) return "soy_braised";
  if (/(蒜蓉|蒜頭)/.test(dishName)) return "garlic";
  if (/(五味|紅油|麻辣|剁椒|XO醬|黑椒|椒麻)/.test(dishName)) return "spiced_savory";
  if (/(清燉|上湯|高湯|海鮮羹)/.test(dishName)) return "light_umami";
  if (/(花雕|酒釀|醉)/.test(dishName)) return "wine_aroma";
  if (/(蟹黃|蟹粉|鮑汁|金湯)/.test(dishName)) return "rich_umami";
  if (/(桂花|冰糖)/.test(dishName)) return "sweet_aroma";
  if (/(甜|糖醋|酸菜)/.test(dishName)) return "sweet_sour";
  return "savory";
};

const inferLeafyGreen = (dishName: string, role: string) => {
  if (role.includes("主食") && /(菜飯|炒飯|油飯|米糕|拌麵|炒麵|蘿蔔糕)/.test(dishName)) {
    return false;
  }

  return /(娃娃菜|芥蘭|菠菜|青江菜|地瓜葉|空心菜|高麗菜|油菜|豆苗|刈菜)/.test(
    dishName,
  );
};

const inferFreezeStableLeafyGreen = (dishName: string) =>
  /(娃娃菜)/.test(dishName);

const inferIsFried = (dishName: string, premadeLevel: string) =>
  /(炸|酥|鍋巴|煎封|焗)/.test(dishName) || /炸/.test(premadeLevel);

const inferRequiresCrispyTexture = (dishName: string) =>
  /(香酥|酥脆|鍋巴|脆皮|油炸)/.test(dishName);

const inferPrepSuitabilityScore = (
  dishName: string,
  premadeLevel: string,
  metadata: Omit<
    Required<
      Pick<
        DishMetadata,
        "isLeafyGreen" | "freezeStableLeafyGreen" | "isFried" | "requiresCrispyTexture"
      >
    >,
    never
  >,
) => {
  let score = 5;

  if (/(粿條|伊麵|西米露|煲仔飯)/.test(dishName)) {
    score -= 3;
  }

  if (metadata.isLeafyGreen && !metadata.freezeStableLeafyGreen) {
    score -= 2;
  }

  if (metadata.isFried || metadata.requiresCrispyTexture) {
    score -= 3;
  }

  if (!parseReheatMethods(premadeLevel).length) {
    score -= 1;
  }

  return Math.max(1, Math.min(5, score));
};

export const enrichRoleDishOption = (option: RoleDishOption): RoleDishOption => {
  const reheatMethods = option.reheatMethods?.length
    ? option.reheatMethods.filter(
        (method): method is ReheatMethod =>
          method === "GAS_STOVE" ||
          method === "RICE_COOKER" ||
          method === "MICROWAVE" ||
          method === "OVEN" ||
          method === "AIR_FRYER",
      )
    : parseReheatMethods(option.premadeLevel);
  const isLeafyGreen = option.isLeafyGreen ?? inferLeafyGreen(option.dishName, option.role);
  const freezeStableLeafyGreen =
    option.freezeStableLeafyGreen ?? inferFreezeStableLeafyGreen(option.dishName);
  const isFried = option.isFried ?? inferIsFried(option.dishName, option.premadeLevel);
  const requiresCrispyTexture =
    option.requiresCrispyTexture ?? option.needsCrispiness ?? inferRequiresCrispyTexture(option.dishName);

  return {
    ...option,
    reheatMethods,
    primaryIngredient: option.primaryIngredient ?? inferPrimaryIngredient(option.dishName, option.role),
    flavorProfile: option.flavorProfile ?? inferFlavorProfile(option.dishName),
    isLeafyGreen,
    freezeStableLeafyGreen,
    isFried,
    requiresCrispyTexture,
    needsCrispiness: option.needsCrispiness ?? requiresCrispyTexture,
    prepSuitabilityScore:
      option.prepSuitabilityScore ??
      inferPrepSuitabilityScore(option.dishName, option.premadeLevel, {
        isLeafyGreen,
        freezeStableLeafyGreen,
        isFried,
        requiresCrispyTexture,
      }),
    similarityFlags: option.similarityFlags,
  };
};

export const getPoolValidationIssues = (option: RoleDishOption) => {
  const hydrated = enrichRoleDishOption(option);
  const issues: string[] = [];

  if ((hydrated.prepSuitabilityScore ?? 0) < 3) {
    issues.push("prep_suitability_score_below_threshold");
  }

  if (
    !hydrated.reheatMethods?.every((method) =>
      SUPPORTED_POOL_REHEAT_METHODS.includes(method as SupportedPoolReheatMethod),
    )
  ) {
    issues.push("unsupported_reheat_method");
  }

  if (hydrated.isLeafyGreen && !hydrated.freezeStableLeafyGreen) {
    issues.push("leafy_green_interceptor");
  }

  if (hydrated.isFried && hydrated.requiresCrispyTexture) {
    issues.push("fried_texture_interceptor");
  }

  return issues;
};

export const isPoolEligibleOption = (option: RoleDishOption) =>
  getPoolValidationIssues(option).length === 0;

export class PoolValidationException extends Error {
  issues: string[];

  constructor(message: string, issues: string[]) {
    super(message);
    this.name = "PoolValidationException";
    this.issues = issues;
  }
}

export class UnsupportedTerminalEquipmentException extends PoolValidationException {
  constructor(issues: string[]) {
    super("偵測到 OVEN 或 AIR_FRYER，已超出 Pool 支援的終端覆熱設備。", issues);
    this.name = "UnsupportedTerminalEquipmentException";
  }
}

export class ConstraintViolationException extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ConstraintViolationException";
  }
}

export const validatePoolOptionOrThrow = (option: RoleDishOption) => {
  const issues = getPoolValidationIssues(option);

  if (!issues.length) {
    return enrichRoleDishOption(option);
  }

  if (issues.includes("unsupported_reheat_method")) {
    throw new UnsupportedTerminalEquipmentException(issues);
  }

  throw new PoolValidationException("候選菜未通過 Pool 驗證，已阻止寫入。", issues);
};

const toComparableDishOption = (
  dish: Pick<RoleDishOption, "role" | "dishName" | "cuisine" | "premadeLevel"> &
    Partial<Pick<RoleDishOption, "thawProfile" | "cookingProfile">>,
) => {
  const matchedLibraryOption = (roleDishLibrary[normalizeRoleName(dish.role)] ?? []).find(
    (option) => option.dishName === dish.dishName,
  );

  return enrichRoleDishOption({
    libraryId: `compare-${dish.role}-${dish.dishName}`,
    thawProfile:
      dish.thawProfile ??
      matchedLibraryOption?.thawProfile ??
      getRoleDefaultProfiles(dish.role).thawProfile,
    cookingProfile:
      dish.cookingProfile ??
      matchedLibraryOption?.cookingProfile ??
      getRoleDefaultProfiles(dish.role).cookingProfile,
    similarityFlags: matchedLibraryOption?.similarityFlags,
    ...dish,
  });
};

export const getFinalMenuConstraintViolations = (dishes: MenuDish[]) => {
  const hydrated = dishes.map((dish) => toComparableDishOption(dish));
  const softDuplicateMap = hydrated.reduce<Record<string, typeof hydrated>>((accumulator, dish) => {
    const key = `${dish.primaryIngredient ?? "mixed"}:${dish.cookingProfile}:${dish.flavorProfile ?? "savory"}`;
    accumulator[key] = [...(accumulator[key] ?? []), dish];
    return accumulator;
  }, {});
  const byShape = Object.values(softDuplicateMap)
    .filter((group) => group.length > 1)
    .map((group) => ({
      key: `${group[0]?.primaryIngredient ?? "mixed"}:${group[0]?.flavorProfile ?? "savory"}`,
      dishes: group.map((dish) => `${dish.role}｜${dish.dishName}`),
      message: `Red Error：${group.map((dish) => dish.dishName).join("、")} 屬於同質節點，請替換其一。`,
    }));
  const byFlag = hydrated.flatMap((dish) =>
    (dish.similarityFlags ?? [])
      .filter((flag) =>
        hydrated.some(
          (candidate) =>
            candidate.dishName === flag.counterpartDishName &&
            normalizeRoleName(candidate.role) === normalizeRoleName(flag.counterpartRole),
        ),
      )
      .map((flag) => ({
        key: flag.pairKey,
        dishes: [
          `${dish.role}｜${dish.dishName}`,
          `${flag.counterpartRole}｜${flag.counterpartDishName}`,
        ],
        message: `Red Error：${dish.dishName} 與 ${flag.counterpartDishName} 已被標記為 ${flag.type}，進入 Final Menu 時需強制替換其一。`,
      })),
  );

  return [...byShape, ...byFlag].filter(
    (violation, index, list) => list.findIndex((item) => item.key === violation.key) === index,
  );
};

const pushUniqueWarning = (
  warnings: PoolDiversityWarning[],
  warning: PoolDiversityWarning,
) => {
  if (!warnings.some((item) => item.id === warning.id)) {
    warnings.push(warning);
  }
};

export const buildPoolDiversityRadar = (
  library: RoleDishLibrary,
  role: string,
): PoolDiversityRadarItem[] => {
  const options = (library[normalizeRoleName(role)] ?? []).map(enrichRoleDishOption);
  const total = options.length;

  if (!total) {
    return [];
  }

  const ingredientCounts = options.reduce<Record<string, number>>((accumulator, option) => {
    const key = option.primaryIngredient ?? "mixed";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});
  const flavorCounts = options.reduce<Record<string, number>>((accumulator, option) => {
    const key = option.flavorProfile ?? "savory";
    accumulator[key] = (accumulator[key] ?? 0) + 1;
    return accumulator;
  }, {});

  return [
    ...Object.entries(ingredientCounts).map(([label, count]) => ({
      category: "primary_ingredient" as const,
      label,
      count,
      total,
      ratio: count / total,
      exceedsThreshold: count / total > 0.3,
    })),
    ...Object.entries(flavorCounts).map(([label, count]) => ({
      category: "flavor_profile" as const,
      label,
      count,
      total,
      ratio: count / total,
      exceedsThreshold: count / total > 0.3,
    })),
  ].sort((left, right) => right.ratio - left.ratio);
};

export const buildPoolBuilderWarnings = (
  library: RoleDishLibrary,
  role?: string,
): PoolDiversityWarning[] => {
  const roles = role ? [normalizeRoleName(role)] : Object.keys(library);
  const warnings: PoolDiversityWarning[] = [];

  roles.forEach((currentRole) => {
    const options = (library[currentRole] ?? []).map(enrichRoleDishOption);
    const radarItems = buildPoolDiversityRadar(library, currentRole).filter(
      (item) => item.exceedsThreshold,
    );

    radarItems.forEach((item) => {
      pushUniqueWarning(warnings, {
        id: `radar:${currentRole}:${item.category}:${item.label}`,
        level: "yellow",
        role: currentRole,
        title: "Yellow Warning：候選同質性過高",
        description: `${currentRole} 的 ${item.category === "primary_ingredient" ? "主食材" : "味型"}「${item.label}」占比 ${(item.ratio * 100).toFixed(0)}%。`,
        recommendation:
          item.category === "primary_ingredient"
            ? "建議補入不同主蛋白或非同部位食材，稀釋備選差異不足。"
            : "建議補入不同調味路線，避免同一分類集中在單一味型。",
        dishes: options
          .filter((option) =>
            item.category === "primary_ingredient"
              ? option.primaryIngredient === item.label
              : option.flavorProfile === item.label,
          )
          .map((option) => option.dishName),
        source: "radar",
      });
    });

    options.forEach((option) => {
      (option.similarityFlags ?? []).forEach((flag) => {
        pushUniqueWarning(warnings, {
          id: `flag:${flag.pairKey}:${option.dishName}`,
          level: "yellow",
          role: currentRole,
          title:
            flag.type === "cross_category_similarity_pair"
              ? "Yellow Warning：跨分類同質性風險"
              : "Yellow Warning：備選差異不足",
          description: `${option.dishName} 與 ${flag.counterpartRole} 的 ${flag.counterpartDishName} 已標記為 ${
            flag.type === "cross_category_similarity_pair"
              ? "cross_category_similarity_pair"
              : "high_similarity_pair"
          }。`,
          recommendation: flag.recommendation,
          dishes: [option.dishName, flag.counterpartDishName],
          source: "similarity_flag",
        });
      });
    });
  });

  return warnings;
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
      cuisine: "粵菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-5",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "糖燻甘蔗雞",
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
      dishName: "紅油拌腐竹",
      cuisine: "川菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-8",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "桂花冰糖糯米藕",
      cuisine: "江浙菜",
      premadeLevel: "解凍即食",
      thawProfile: "other",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "left-cold-9",
      role: "【迎賓冷盤一】迎賓冷盤",
      dishName: "紹興醉蛋",
      cuisine: "江浙菜",
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
      dishName: "五味中卷",
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
    {
      libraryId: "right-cold-8",
      role: "【迎賓冷盤二】迎賓冷盤",
      dishName: "川味椒麻拌牛肚",
      cuisine: "川菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
      cookingProfile: "cold-serve",
    },
    {
      libraryId: "right-cold-9",
      role: "【迎賓冷盤二】迎賓冷盤",
      dishName: "白切雞",
      cuisine: "粵菜",
      premadeLevel: "解凍即食",
      thawProfile: "meat",
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
      similarityFlags: [
        {
          type: "high_similarity_pair",
          pairKey: "jiangnan-ribs",
          counterpartDishName: "鎮江排骨",
          counterpartRole: "【燒燴大菜】主菜",
          recommendation: "兩道可並存於 Pool，但建議補入非甜酸收汁路線的大菜，稀釋江南排骨系備選的同質性。",
        },
      ],
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
      dishName: "柱侯蘿蔔燉牛腩",
      cuisine: "粵菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
      similarityFlags: [
        {
          type: "cross_category_similarity_pair",
          pairKey: "beef-radish-cross-role",
          counterpartDishName: "蘿蔔清燉牛腩",
          counterpartRole: "【承啟中湯】湯品",
          recommendation: "保留兩道無妨，但 Pool Builder 應提示補入非牛腩或非蘿蔔路線候選，避免跨分類仍集中於同一核心食材組合。",
        },
      ],
    },
    {
      libraryId: "vice-main-7",
      role: "【燒燴大菜】主菜",
      dishName: "鎮江排骨",
      cuisine: "江浙菜",
      premadeLevel: "瓦斯爐收汁加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
      similarityFlags: [
        {
          type: "high_similarity_pair",
          pairKey: "jiangnan-ribs",
          counterpartDishName: "無錫排骨",
          counterpartRole: "【燒燴大菜】主菜",
          recommendation: "兩道可並存於 Pool，但建議補入非甜酸收汁路線的大菜，稀釋江南排骨系備選的同質性。",
        },
      ],
    },
    {
      libraryId: "vice-main-9",
      role: "【燒燴大菜】主菜",
      dishName: "台式紅燒羊腩煲",
      cuisine: "台菜",
      premadeLevel: "瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-soup",
    },
    {
      libraryId: "vice-main-10",
      role: "【燒燴大菜】主菜",
      dishName: "神仙八寶鴨",
      cuisine: "魯菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-11",
      role: "【燒燴大菜】主菜",
      dishName: "栗子燒黃燜雞",
      cuisine: "魯菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-12",
      role: "【燒燴大菜】主菜",
      dishName: "陳皮醬香鴨",
      cuisine: "粵菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-14",
      role: "【燒燴大菜】主菜",
      dishName: "蟲草花金針蒸滑雞",
      cuisine: "粵菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-15",
      role: "【燒燴大菜】主菜",
      dishName: "紅燒牛臉頰肉",
      cuisine: "台菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "vice-main-16",
      role: "【燒燴大菜】主菜",
      dishName: "本幫紅燒肉",
      cuisine: "本幫菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "meat",
      cookingProfile: "reheat-braise",
    },
  ],
  "【海鮮大菜】主菜": [
    {
      libraryId: "main-fish-2",
      role: "【海鮮大菜】主菜",
      dishName: "豉汁蒸石斑魚",
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
    {
      libraryId: "main-fish-10",
      role: "【海鮮大菜】主菜",
      dishName: "陳年花雕蒸海蝦",
      cuisine: "江浙菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "shrimp",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-12",
      role: "【海鮮大菜】主菜",
      dishName: "剁椒蒸魚頭",
      cuisine: "湘菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "fish",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-13",
      role: "【海鮮大菜】主菜",
      dishName: "酒釀乾燒大蝦",
      cuisine: "川菜",
      premadeLevel: "微波/瓦斯爐加熱",
      thawProfile: "shrimp",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "main-fish-14",
      role: "【海鮮大菜】主菜",
      dishName: "鮑汁燴花膠海參",
      cuisine: "粵菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "other",
      cookingProfile: "reheat-braise",
    },
    {
      libraryId: "main-fish-15",
      role: "【海鮮大菜】主菜",
      dishName: "樹子冬瓜蒸海鱸魚",
      cuisine: "台菜",
      premadeLevel: "電鍋/瓦斯爐加熱",
      thawProfile: "fish",
      cookingProfile: "steam-fish",
    },
    {
      libraryId: "main-fish-16",
      role: "【海鮮大菜】主菜",
      dishName: "蟹黃海鮮豆腐煲",
      cuisine: "江浙菜",
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
      cuisine: "江浙菜",
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
      similarityFlags: [
        {
          type: "cross_category_similarity_pair",
          pairKey: "beef-radish-cross-role",
          counterpartDishName: "柱侯蘿蔔燉牛腩",
          counterpartRole: "【燒燴大菜】主菜",
          recommendation: "可保留於不同分類，但應補入非牛腩或非蘿蔔路線的候選，避免 Pool 在跨分類上仍集中同一組核心食材。",
        },
      ],
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
  "【燴扒蔬蕈】蔬菜": [
    {
      libraryId: "veg-6",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "蟹黃燴芙蓉豆腐",
      cuisine: "江浙菜",
      premadeLevel: "微波/瓦斯爐加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-7",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "蠔油扒北菇",
      cuisine: "粵菜",
      premadeLevel: "微波/電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-8",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "金湯蟹粉扒南瓜",
      cuisine: "粵菜",
      premadeLevel: "微波/電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-9",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "上湯雪菜百葉",
      cuisine: "江浙菜",
      premadeLevel: "微波/瓦斯爐加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-10",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "扁尖筍百葉燒毛豆",
      cuisine: "江浙菜",
      premadeLevel: "微波/電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-11",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "白果烤麩",
      cuisine: "本幫菜",
      premadeLevel: "微波/電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-12",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "麻油猴頭菇",
      cuisine: "台菜",
      premadeLevel: "微波/瓦斯爐加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
    },
    {
      libraryId: "veg-13",
      role: "【燴扒蔬蕈】蔬菜",
      dishName: "雞湯煨雙冬",
      cuisine: "江浙菜",
      premadeLevel: "微波/電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-veg",
      reheatMethods: ["MICROWAVE", "RICE_COOKER"],
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
    {
      libraryId: "staple-10",
      role: "【主食飯麵】主食",
      dishName: "古法荷葉糯米雞",
      cuisine: "粵菜",
      premadeLevel: "電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-11",
      role: "【主食飯麵】主食",
      dishName: "臘味香菇蘿蔔糕",
      cuisine: "粵菜",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-12",
      role: "【主食飯麵】主食",
      dishName: "上海蔥油拌麵",
      cuisine: "江浙菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-13",
      role: "【主食飯麵】主食",
      dishName: "XO醬海鮮炒飯",
      cuisine: "粵菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-15",
      role: "【主食飯麵】主食",
      dishName: "上海菜飯",
      cuisine: "本幫菜",
      premadeLevel: "微波/電鍋加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-16",
      role: "【主食飯麵】主食",
      dishName: "揚州香蒜叉燒炒飯",
      cuisine: "粵菜",
      premadeLevel: "微波加熱",
      thawProfile: "other",
      cookingProfile: "reheat-rice",
    },
    {
      libraryId: "staple-17",
      role: "【主食飯麵】主食",
      dishName: "台式古早味高麗菜飯",
      cuisine: "台菜",
      premadeLevel: "微波/電鍋加熱",
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
    {
      libraryId: "soup-5",
      role: "【壓軸大湯】湯品",
      dishName: "老鴨扁尖筍濃湯",
      cuisine: "江浙菜",
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
      libraryId: "dessert-4",
      role: "【晏尾甜品】甜品",
      dishName: "冰糖燉雪梨",
      cuisine: "大眾中式",
      premadeLevel: "電鍋熱食或冷飲",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-5",
      role: "【晏尾甜品】甜品",
      dishName: "生磨核桃露",
      cuisine: "粵菜",
      premadeLevel: "電鍋/瓦斯爐熱食",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-6",
      role: "【晏尾甜品】甜品",
      dishName: "百合銀耳燉雪蛤",
      cuisine: "大眾中式",
      premadeLevel: "電鍋熱食或冷飲",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-7",
      role: "【晏尾甜品】甜品",
      dishName: "奶黃壽桃包",
      cuisine: "中式點心",
      premadeLevel: "電鍋蒸熱",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
    {
      libraryId: "dessert-8",
      role: "【晏尾甜品】甜品",
      dishName: "紅桂花酒釀圓子",
      cuisine: "江浙菜",
      premadeLevel: "電鍋/瓦斯爐熱食",
      thawProfile: "other",
      cookingProfile: "steam-dessert",
    },
  ],
};

export const getRoleDishOptions = (role: string) =>
  (roleDishLibrary[normalizeRoleName(role)] ?? []).map(enrichRoleDishOption);

export const createEmptyRoleDishOption = (role: string): RoleDishOption => ({
  libraryId: `custom-${normalizeRoleName(role)}-${Date.now()}-${Math.random()
    .toString(36)
    .slice(2, 7)}`,
  role: normalizeRoleName(role),
  dishName: "請輸入候選菜名",
  cuisine: "請輸入菜系",
  premadeLevel: "請輸入預製度",
  prepSuitabilityScore: 3,
  reheatMethods: ["MICROWAVE"],
  primaryIngredient: "mixed",
  flavorProfile: "savory",
  isLeafyGreen: false,
  isFried: false,
  freezeStableLeafyGreen: false,
  requiresCrispyTexture: false,
  needsCrispiness: false,
  similarityFlags: [],
  ...getRoleDefaultProfiles(role),
});

export const cloneRoleDishLibrary = (): RoleDishLibrary =>
  Object.fromEntries(
    Object.entries(roleDishLibrary).map(([role, options]) => [
      role,
      options.map((option) => enrichRoleDishOption({ ...option })),
    ]),
  );
