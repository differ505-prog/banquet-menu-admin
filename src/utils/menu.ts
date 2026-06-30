import type {
  CookingGuide,
  CookingProfileKey,
  CookingReminder,
  DishThawReminder,
  MenuAction,
  MenuDish,
  MenuFilters,
  MenuState,
  ThawGuide,
  ThawProfileKey,
  RoleDishLibrary,
  RoleDishOption,
} from "@/types/menu";
import { cookingGuides } from "../data/cooking-guides";
import { getEquivalentRoleNames, normalizeRoleName } from "../data/role-dish-library";
import { thawGuides, thawGuideMap } from "../data/thaw-guides";

const isThawProfileKey = (value: unknown): value is ThawProfileKey =>
  value === "fish" || value === "shrimp" || value === "meat" || value === "other";

const isCookingProfileKey = (value: unknown): value is CookingProfileKey =>
  value === "cold-serve" ||
  value === "steam-fish" ||
  value === "steam-dessert" ||
  value === "reheat-braise" ||
  value === "reheat-soup" ||
  value === "reheat-rice" ||
  value === "reheat-veg";

const cookingProfileCopyMap: Record<
  CookingProfileKey,
  {
    label: string;
    detail: string;
    summaryLabel: string;
  }
> = {
  "cold-serve": {
    label: "冷盤回溫",
    detail: "完成退冰後擦乾表面，開席前 15 至 20 分鐘離冷藏回溫，再拌汁或擺盤，冷盤香氣會更完整。",
    summaryLabel: "冷盤回溫",
  },
  "steam-fish": {
    label: "魚類清蒸",
    detail: "水大滾、蒸氣足再下鍋，大火蒸 8 至 10 分鐘，關火虛蒸 2 分鐘，最後再補醬汁或熱油。",
    summaryLabel: "清蒸主菜",
  },
  "steam-dessert": {
    label: "甜品回蒸",
    detail: "以中微火回蒸 10 至 12 分鐘即可，避免蒸氣過猛讓甜湯表面粗糙或收得太乾。",
    summaryLabel: "甜品回蒸",
  },
  "reheat-braise": {
    label: "厚菜回熱",
    detail: "建議先完成退冰，再以電鍋或小火加熱至中心滾透；若帶醬汁，起鍋前再收 3 至 5 分鐘最穩。",
    summaryLabel: "厚菜回熱",
  },
  "reheat-soup": {
    label: "湯品復熱",
    detail: "完全退冰後改用小火煮至全鍋微滾 8 至 12 分鐘即可，避免大滾太久讓湯色混濁、肉質變柴。",
    summaryLabel: "湯品復熱",
  },
  "reheat-rice": {
    label: "主食回蒸",
    detail: "主食建議用電鍋或蒸籠回蒸 20 至 30 分鐘，出鍋後立刻翻鬆，口感才不會乾硬結塊。",
    summaryLabel: "主食回蒸",
  },
  "reheat-veg": {
    label: "蔬菜回熱",
    detail: "蔬菜以短時間回熱為原則，3 至 5 分鐘即可；勾芡與收汁動作放在最後，能保住色澤與脆度。",
    summaryLabel: "蔬菜回熱",
  },
};

export const initialMenuState = (dishes: MenuDish[]): MenuState => ({
  dishes,
  selectedDishId: dishes[0]?.id ?? null,
});

export const menuReducer = (state: MenuState, action: MenuAction): MenuState => {
  switch (action.type) {
    case "select":
      return {
        ...state,
        selectedDishId: action.payload,
      };
    case "update":
      return {
        ...state,
        dishes: state.dishes.map((dish) =>
          dish.id === action.payload.id
            ? {
                ...dish,
                [action.payload.field]: action.payload.value,
              }
            : dish,
        ),
      };
    case "replaceFromLibrary":
      return {
        ...state,
        dishes: state.dishes.map((dish) =>
          dish.id === action.payload.id
            ? {
                ...dish,
                dishName: action.payload.option.dishName,
                cuisine: action.payload.option.cuisine,
                premadeLevel: action.payload.option.premadeLevel,
                thawProfile: action.payload.option.thawProfile,
                cookingProfile: action.payload.option.cookingProfile,
              }
            : dish,
        ),
      };
    case "syncLibraryOption":
      return {
        ...state,
        dishes: state.dishes.map((dish) =>
          dish.role === action.payload.previous.role &&
          dish.dishName === action.payload.previous.dishName &&
          dish.cuisine === action.payload.previous.cuisine &&
          dish.premadeLevel === action.payload.previous.premadeLevel
            ? {
                ...dish,
                dishName: action.payload.next.dishName,
                cuisine: action.payload.next.cuisine,
                premadeLevel: action.payload.next.premadeLevel,
                thawProfile: action.payload.next.thawProfile,
                cookingProfile: action.payload.next.cookingProfile,
              }
            : dish,
        ),
      };
    case "reset":
      return {
        dishes: action.payload,
        selectedDishId: action.payload[0]?.id ?? null,
      };
    default:
      return state;
  }
};

export const filterDishes = (dishes: MenuDish[], filters: MenuFilters) => {
  const keyword = filters.keyword.trim().toLowerCase();

  return dishes.filter((dish) => {
    const matchesCuisine = !filters.cuisine || dish.cuisine === filters.cuisine;
    const matchesPremade =
      !filters.premadeLevel || dish.premadeLevel === filters.premadeLevel;
    const matchesKeyword =
      !keyword ||
      [dish.role, dish.dishName, dish.cuisine, dish.premadeLevel]
        .join(" ")
        .toLowerCase()
        .includes(keyword);

    return matchesCuisine && matchesPremade && matchesKeyword;
  });
};

export const getCuisineDistribution = (dishes: MenuDish[]) =>
  dishes.reduce<Record<string, number>>((accumulator, dish) => {
    accumulator[dish.cuisine] = (accumulator[dish.cuisine] ?? 0) + 1;
    return accumulator;
  }, {});

export const getPremadeReadyCount = (dishes: MenuDish[]) =>
  dishes.filter((dish) => /解凍即食|加熱|蒸熱/.test(dish.premadeLevel)).length;

export const buildMenuSummary = (dishes: MenuDish[]) => {
  const cuisineDistribution = getCuisineDistribution(dishes);
  const cuisines = Object.entries(cuisineDistribution)
    .map(([cuisine, count]) => `${cuisine}${count}道`)
    .join("、");
  const thawProfiles = new Set(
    dishes.filter((dish) => dish.thawProfile !== "other").map((dish) => dish.thawProfile),
  );
  const thawHint =
    thawProfiles.size > 0
      ? `另有 ${dishes.filter((dish) => dish.thawProfile !== "other").length} 道魚蝦肉冷凍食需留意退冰節奏。`
      : "";
  const cookingProfiles = new Set(dishes.map((dish) => dish.cookingProfile));
  const cookingHint =
    cookingProfiles.size > 0
      ? `目前烹調節奏涵蓋 ${Array.from(cookingProfiles)
          .map((profile) => cookingProfileCopyMap[profile].summaryLabel)
          .join("、")}。`
      : "";

  return `本宴客菜單共 ${dishes.length} 道，涵蓋 ${cuisines}，整體以高預製度、低臨場壓力為核心。${thawHint}${cookingHint}`;
};

export const buildEvaluationPrompt = (dishes: MenuDish[]) => {
  const menuLines = dishes
    .map(
      (dish, index) =>
        `${index + 1}. ${dish.role}｜Schema:${getRoleSchemaCode(dish.role)}｜${dish.dishName}｜${dish.cuisine}｜${dish.premadeLevel}`,
    )
    .join("\n");

  return [
    "[Role]",
    "你是一位資深中式宴席資料庫架構師、中式宴席顧問與高預製備餐規劃師。",
    "[Context & Constraints]",
    "- 料理體系：絕對純中式（八大菜系、台菜、客家菜、大眾中式、中式點心）。嚴禁西式、日式、南洋等異國元素及「融合菜」、「創意菜」。",
    "- 終端限制：高度依賴冷凍/冷藏預製包，終端覆熱設備僅限「瓦斯爐、電鍋、微波爐」。嚴禁需要烤箱、氣炸鍋或極度講究覆熱火候的菜色。",
    "- 狀態辨識：本次輸入的是最終已選菜單（Final Menu），可直接評估實際同桌上菜時的食材撞車、味型衝突、節奏失衡與預製合理性。",
    "[Final Menu]",
    menuLines,
    "請從菜色平衡、菜系協調、預製度合理性、加熱動線與整體體面度五個面向評分，並提出可替換建議。",
  ].join("\n");
};

export const buildExportJson = (dishes: MenuDish[]) =>
  JSON.stringify(
    {
      title: "高預製度宴客菜單",
      summary: buildMenuSummary(dishes),
      roleSchema: buildRoleSchemaEntries(dishes.map((dish) => dish.role)),
      dishes,
      prompt: buildEvaluationPrompt(dishes),
      thawGuide: buildThawGuideText(),
      thawChecklist: buildThawReminderText(dishes),
      cookingGuide: buildCookingGuideText(),
      cookingChecklist: buildCookingReminderText(dishes),
    },
    null,
    2,
  );

export const getRoleSchemaCode = (role: string) => {
  const normalizedRole = normalizeRoleName(role);

  if (normalizedRole.includes("迎賓冷盤一")) {
    return "Appetizer_Cold_1";
  }

  if (normalizedRole.includes("迎賓冷盤二")) {
    return "Appetizer_Cold_2";
  }

  if (normalizedRole.includes("燒燴大菜")) {
    return "Main_Braised";
  }

  if (normalizedRole.includes("海鮮大菜")) {
    return "Main_Seafood";
  }

  if (normalizedRole.includes("承啟中湯")) {
    return "Soup_Interlude";
  }

  if (normalizedRole.includes("季節時蔬")) {
    return "Vegetable_Seasonal";
  }

  if (normalizedRole.includes("主食飯麵")) {
    return "Staple_Rice_Noodles";
  }

  if (normalizedRole.includes("壓軸大湯")) {
    return "Soup_Final";
  }

  if (normalizedRole.includes("晏尾甜品")) {
    return "Dessert_Chinese";
  }

  return "Banquet_Other";
};

export const buildRoleSchemaEntries = (roles: string[]) =>
  Array.from(new Set(roles)).map((role) => ({
    role,
    schemaCode: getRoleSchemaCode(role),
  }));

export const buildLibrarySummary = (library: RoleDishLibrary) =>
  Object.entries(library)
    .map(([role, options]) => `${role} 共 ${options.length} 道候選`)
    .join("、");

export const buildLibraryReviewPrompt = (library: RoleDishLibrary) => {
  const schemaLines = buildRoleSchemaEntries(Object.keys(library))
    .map((entry) => `- ${entry.role} => ${entry.schemaCode}`)
    .join("\n");
  const libraryLines = Object.entries(library)
    .map(([role, options]) => {
      const optionLines = options
        .map(
          (option, index) =>
            `  ${index + 1}. ${option.dishName}｜${option.cuisine}｜${option.premadeLevel}`,
        )
        .join("\n");

      return `${role}\n${optionLines}`;
    })
    .join("\n");

  return [
    "[Role]",
    "你是一位資深中式宴席資料庫架構師、中式宴席顧問與高預製備餐規劃師。",
    "[Pool]",
    "請覆核以下宴席候選菜庫：",
    "目前系統使用的分類 Schema 對照如下：",
    schemaLines,
    "以下為目前候選菜庫：",
    libraryLines,
    "[Context & Constraints]",
    "- 料理體系：絕對純中式（八大菜系、台菜、客家菜、大眾中式、中式點心）。嚴禁西式、日式、南洋等異國元素及「融合菜」、「創意菜」。",
    "- 終端限制：高度依賴冷凍/冷藏預製包，終端覆熱設備僅限「瓦斯爐、電鍋、微波爐」。嚴禁需要烤箱、氣炸鍋或極度講究覆熱火候的菜色。",
    "- 狀態辨識：請敏銳區分用戶輸入的是「候選菜庫（Pool）」還是「最終已選菜單（Final Menu）」。若是候選庫，應評估備選多樣性與同質性警告，不可使用「同桌上菜將發生撞車」的語氣。",
    "[Evaluation Process (4D Scan)]",
    "1. Diversity Scan（多樣性掃描）：檢查主食材、味型、烹法是否在同分類或跨分類中過度集中；若有，請標記『備選差異不足』或『候選同質性過高』。",
    "2. Schema Standardization（標準化掃描）：檢查菜名與菜系是否符合商業資料庫規範，並校正非正規菜系名稱；例如可將『涼拌』『傳統中式』等非正式標籤收斂為『大眾中式』。",
    "3. Duplicate Scan（重複掃描）：嚴格確保同一道菜不可重複出現在不同分類中。",
    "4. Prep-Suitability Rule（高預製適配性掃描）：強制標記並剔除依賴高溫油炸求酥脆、覆熱易出水糊化、或超出指定終端設備的菜品。",
    "請用繁體中文輸出，並嚴格依照以下格式回覆：",
    "[Output Format]",
    "1. 【整體總評】（給予 1-10 評分與綜合說明）",
    "2. 【違規剔除名單】（列出違反中式、重複或預製/設備限制的項目）。若目前是候選菜庫，不要使用『若隨機抽選』『極易撞車』『同桌上菜將發生撞車』等語氣。",
    "3. 【同質性警告】（使用『備選差異不足』『候選同質性過高』等精確用詞）",
    "4. 【標準化修正】（列出分類、菜名與菜系名稱修正）",
    "5. 【擴增建議】（提供符合預製條件的替換/擴充菜品）",
    "6. 【可直接複製貼給 IDE 的菜庫修改提示詞】（彙整所有刪除、替換、改名、補充、增列事項，且提醒 IDE 不必拘泥於原先每個分類的候選數量）",
    "7. 【可直接複製貼給 IDE 的提示詞優化提示詞】（必須整併 [Role]、[Context & Constraints]、[Evaluation Process (4D Scan)]、[Output Format]，但不要混入具體菜庫資料修改內容）",
  ].join("\n");
};

export const buildLibraryExportJson = (library: RoleDishLibrary) =>
  JSON.stringify(
    {
      title: "高預製度宴客候選菜庫",
      summary: buildLibrarySummary(library),
      roleSchema: buildRoleSchemaEntries(Object.keys(library)),
      library,
      prompt: buildLibraryReviewPrompt(library),
    },
    null,
    2,
  );

export const getGuestCourseLabel = (role: string) => {
  const normalizedRole = normalizeRoleName(role);

  if (normalizedRole.includes("迎賓冷盤")) {
    return "迎賓冷盤";
  }

  if (normalizedRole.includes("燒燴大菜")) {
    return "燒燴大菜";
  }

  if (normalizedRole.includes("海鮮大菜")) {
    return "海鮮大菜";
  }

  if (normalizedRole.includes("承啟中湯")) {
    return "承啟中湯";
  }

  if (normalizedRole.includes("季節時蔬")) {
    return "季節時蔬";
  }

  if (normalizedRole.includes("主食飯麵")) {
    return "主食飯麵";
  }

  if (normalizedRole.includes("壓軸大湯")) {
    return "壓軸大湯";
  }

  if (normalizedRole.includes("晏尾甜品")) {
    return "晏尾甜品";
  }

  return "私宴精選";
};

export const buildGuestMenuText = (dishes: MenuDish[]) =>
  [
    "私宴菜單",
    ...dishes.map(
      (dish, index) => `${index + 1}. ${getGuestCourseLabel(dish.role)}｜${dish.dishName}`,
    ),
  ].join("\n");

export const getUniqueValues = (
  dishes: MenuDish[],
  key: "cuisine" | "premadeLevel",
) => [...new Set(dishes.map((dish) => dish[key]))];

export const getThawGuides = (): ThawGuide[] => thawGuides;

export const getThawProfileLabel = (profile: Exclude<ThawProfileKey, "other">) =>
  thawGuideMap[profile].shortLabel;

export const buildThawGuideText = () =>
  thawGuides
    .map(
      (guide) =>
        [
          `${guide.label}`,
          `最佳方案 ${guide.best.title}｜${guide.best.score}/10`,
          `作法：${guide.best.method}`,
          `理由：${guide.best.reason}`,
          `次佳方案 ${guide.secondBest.title}｜${guide.secondBest.score}/10`,
          `作法：${guide.secondBest.method}`,
          `理由：${guide.secondBest.reason}`,
          `提醒：${guide.reminder}`,
        ].join("\n"),
    )
    .join("\n\n");

export const buildDishThawReminders = (dishes: MenuDish[]): DishThawReminder[] =>
  dishes.flatMap((dish) => {
    if (dish.thawProfile === "other") {
      return [];
    }

    const guide = thawGuideMap[dish.thawProfile];

    return [
      {
        dishId: dish.id,
        dishName: dish.dishName,
        role: dish.role,
        profile: dish.thawProfile,
        profileLabel: guide.shortLabel,
        bestTitle: guide.best.title,
        bestScore: guide.best.score,
        secondBestTitle: guide.secondBest.title,
        secondBestScore: guide.secondBest.score,
        reminder: guide.reminder,
      },
    ];
  });

export const buildThawReminderText = (dishes: MenuDish[]) => {
  const reminders = buildDishThawReminders(dishes);

  if (!reminders.length) {
    return "目前菜單沒有需要額外退冰提醒的魚、蝦、肉類冷凍食。";
  }

  return [
    "廚房備餐退冰提醒",
    ...reminders.map(
      (reminder, index) =>
        `${index + 1}. ${reminder.role}｜${reminder.dishName}\n` +
        `   類型：${reminder.profileLabel}\n` +
        `   最佳：${reminder.bestTitle}（${reminder.bestScore}/10）\n` +
        `   次佳：${reminder.secondBestTitle}（${reminder.secondBestScore}/10）\n` +
        `   提醒：${reminder.reminder}`,
    ),
  ].join("\n");
};

export const buildThawSummary = (dishes: MenuDish[]) => {
  const reminders = buildDishThawReminders(dishes);

  if (!reminders.length) {
    return "目前菜單沒有魚、蝦、肉類冷凍食的退冰壓力，可直接專注加熱與擺盤節奏。";
  }

  const distribution = reminders.reduce<Record<string, number>>((accumulator, reminder) => {
    accumulator[reminder.profileLabel] = (accumulator[reminder.profileLabel] ?? 0) + 1;
    return accumulator;
  }, {});

  return `目前有 ${reminders.length} 道魚蝦肉冷凍食，包含 ${Object.entries(distribution)
    .map(([label, count]) => `${label}${count}道`)
    .join("、")}，建議先確認前一晚冷藏與當天快退冰的分工。`;
};

export const getCookingGuides = (): CookingGuide[] => cookingGuides;

export function buildCookingGuideText() {
  return cookingGuides
    .map(
      (guide) =>
        [
          guide.label,
          guide.summary,
          ...guide.entries.map(
            (entry, index) =>
              `${index + 1}. ${entry.label}\n` +
              `   火候：${entry.temperature}\n` +
              `   時間：${entry.duration}\n` +
              `   重點：${entry.note}\n` +
              `   評分：${entry.score}/10`,
          ),
        ].join("\n"),
    )
    .join("\n\n");
}

export function buildDishCookingReminders(dishes: MenuDish[]): CookingReminder[] {
  return dishes.map((dish) => ({
    dishId: dish.id,
    dishName: dish.dishName,
    role: dish.role,
    label: cookingProfileCopyMap[dish.cookingProfile].label,
    detail: cookingProfileCopyMap[dish.cookingProfile].detail,
  }));
}

export function buildCookingReminderText(dishes: MenuDish[]) {
  const reminders = buildDishCookingReminders(dishes);

  if (!reminders.length) {
    return "目前菜單沒有需要額外整理的烹調提醒。";
  }

  return [
    "廚房備餐烹調提醒",
    ...reminders.map(
      (reminder, index) =>
        `${index + 1}. ${reminder.role}｜${reminder.dishName}\n` +
        `   類型：${reminder.label}\n` +
        `   提醒：${reminder.detail}`,
    ),
  ].join("\n");
}

export function buildCookingSummary(dishes: MenuDish[]) {
  const reminders = buildDishCookingReminders(dishes);

  if (!reminders.length) {
    return "目前菜單沒有額外烹調節奏壓力，可專注上菜與擺盤。";
  }

  const distribution = reminders.reduce<Record<string, number>>((accumulator, reminder) => {
    accumulator[reminder.label] = (accumulator[reminder.label] ?? 0) + 1;
    return accumulator;
  }, {});

  return `目前菜單以 ${Object.entries(distribution)
    .map(([label, count]) => `${label}${count}道`)
    .join("、")} 為主，建議先把清蒸、厚菜回熱與主食回蒸的鍋具路線拆開安排。`;
}

export const MENU_STORAGE_KEY = "banquet-menu-admin:dishes";
export const LIBRARY_STORAGE_KEY = "banquet-menu-admin:role-library";

export const getMatchingLibraryOption = (
  dish: MenuDish,
  options: RoleDishOption[],
) =>
  options.find(
    (option) =>
      normalizeRoleName(option.role) === normalizeRoleName(dish.role) &&
      option.dishName === dish.dishName &&
      option.cuisine === dish.cuisine &&
      option.premadeLevel === dish.premadeLevel &&
      option.thawProfile === dish.thawProfile &&
      option.cookingProfile === dish.cookingProfile,
  ) ?? null;

export const getChangedDishCount = (
  baseDishes: MenuDish[],
  currentDishes: MenuDish[],
) => {
  const baseMap = new Map(baseDishes.map((dish) => [dish.id, dish]));

  return currentDishes.filter((dish) => {
    const baseDish = baseMap.get(dish.id);

    if (!baseDish) {
      return false;
    }

    return (
      baseDish.dishName !== dish.dishName ||
      baseDish.cuisine !== dish.cuisine ||
      baseDish.premadeLevel !== dish.premadeLevel
    );
  }).length;
};

export const sanitizeStoredDishes = (
  value: unknown,
  fallback: MenuDish[],
): MenuDish[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const validEntries = value.filter(
    (
      item,
    ): item is Omit<MenuDish, "thawProfile" | "cookingProfile"> & {
      thawProfile?: unknown;
      cookingProfile?: unknown;
    } =>
      typeof item === "object" &&
      item !== null &&
      typeof item.id === "string" &&
      typeof item.role === "string" &&
      typeof item.dishName === "string" &&
      typeof item.cuisine === "string" &&
      typeof item.premadeLevel === "string",
  );

  const storedMap = new Map(validEntries.map((dish) => [dish.id, dish]));

  return fallback.map((dish) => {
    const storedDish = storedMap.get(dish.id);

    if (!storedDish || normalizeRoleName(storedDish.role) !== normalizeRoleName(dish.role)) {
      return dish;
    }

    return {
      ...storedDish,
      role: dish.role,
      thawProfile: isThawProfileKey(storedDish.thawProfile)
        ? storedDish.thawProfile
        : dish.thawProfile,
      cookingProfile: isCookingProfileKey(storedDish.cookingProfile)
        ? storedDish.cookingProfile
        : dish.cookingProfile,
    };
  });
};

export const sanitizeRoleDishLibrary = (
  value: unknown,
  fallback: RoleDishLibrary,
): RoleDishLibrary => {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return fallback;
  }

  return Object.fromEntries(
    Object.entries(fallback).map(([role, fallbackOptions]) => {
      const candidate = getEquivalentRoleNames(role)
        .map((candidateRole) => (value as Record<string, unknown>)[candidateRole])
        .find(Array.isArray);

      if (!Array.isArray(candidate)) {
        return [role, fallbackOptions];
      }

      const validOptions = candidate.filter(
        (
          item,
        ): item is Omit<RoleDishOption, "thawProfile" | "cookingProfile"> & {
          thawProfile?: unknown;
          cookingProfile?: unknown;
        } =>
          typeof item === "object" &&
          item !== null &&
          typeof item.libraryId === "string" &&
          typeof item.role === "string" &&
          normalizeRoleName(item.role) === normalizeRoleName(role) &&
          typeof item.dishName === "string" &&
          typeof item.cuisine === "string" &&
          typeof item.premadeLevel === "string",
      );

      return [
        role,
        validOptions.length
          ? validOptions.map((option, index) => ({
              ...option,
              role,
              thawProfile: isThawProfileKey(option.thawProfile)
                ? option.thawProfile
                : fallbackOptions[index]?.thawProfile ?? "other",
              cookingProfile: isCookingProfileKey(option.cookingProfile)
                ? option.cookingProfile
                : fallbackOptions[index]?.cookingProfile ?? "reheat-veg",
            }))
          : fallbackOptions,
      ];
    }),
  );
};

export const updateRoleDishOption = (
  library: RoleDishLibrary,
  role: string,
  libraryId: string,
  field: "dishName" | "cuisine" | "premadeLevel",
  value: string,
): RoleDishLibrary => ({
  ...library,
  [role]: (library[role] ?? []).map((option) =>
    option.libraryId === libraryId
      ? {
          ...option,
          [field]: value,
        }
      : option,
  ),
});

export const removeRoleDishOption = (
  library: RoleDishLibrary,
  role: string,
  libraryId: string,
): RoleDishLibrary => ({
  ...library,
  [role]: (library[role] ?? []).filter((option) => option.libraryId !== libraryId),
});

export const addRoleDishOption = (
  library: RoleDishLibrary,
  role: string,
  option: RoleDishOption,
): RoleDishLibrary => ({
  ...library,
  [role]: [...(library[role] ?? []), option],
});
