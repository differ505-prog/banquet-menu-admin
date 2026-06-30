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
    "請你以宴客顧問與備餐流程規劃師的角度，評估以下宴客菜單：",
    menuLines,
    "此八菜一湯以中式料理為唯一範圍，請排除西式、日式、韓式、南洋或過度混血的非中式候選。",
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
  if (role.includes("迎賓冷盤一")) {
    return "Appetizer_Cold_1";
  }

  if (role.includes("迎賓冷盤二")) {
    return "Appetizer_Cold_2";
  }

  if (role.includes("燒燴大菜")) {
    return "Main_Braised";
  }

  if (role.includes("海鮮大菜")) {
    return "Main_Seafood";
  }

  if (role.includes("中場過場湯")) {
    return "Soup_Interlude";
  }

  if (role.includes("季節時蔬")) {
    return "Vegetable_Seasonal";
  }

  if (role.includes("主食飯麵")) {
    return "Staple_Rice_Noodles";
  }

  if (role.includes("壓軸燉湯")) {
    return "Soup_Final";
  }

  if (role.includes("中式甜品")) {
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
    "請你以中式宴席顧問、菜系研究者、宴客結構規劃師與提示詞優化顧問的角度，覆核以下同地位候選菜庫：",
    "目前系統使用的分類 Schema 對照如下：",
    schemaLines,
    libraryLines,
    "請用繁體中文輸出，並嚴格依照以下格式回覆：",
    "0. 前提限制：這份八菜一湯只接受中式料理體系。請主動排除西式、日式、韓式、南洋與其他非中式候選；若菜色明顯不屬中式料理，即使可預製，也應列為不建議保留或建議剔除。",
    "1. 先給這份菜庫整體評分（滿分 10 分，可含小數），並說明評分理由，至少涵蓋：宴席地位適配度、菜系合理性、預製度合理性、菜名標準性、候選完整性。",
    "2. 評估這份『給 LLM 的覆核提示詞』本身寫得好不好，給一個滿分 10 分的分數，並提出可讓 IDE 之後生成更高品質覆核提示詞的改善建議。這一段只討論提示詞設計本身，不要混入菜庫資料修改建議。請特別檢查它是否明確要求：食材多樣性防撞車、重複菜色掃描、標準化欄位命名、以及 Context 情境輸入。",
    "3. 逐一檢查每個宴席地位是否放對類型的菜、菜系標示是否合理、預製度描述是否恰當；若有不適合該地位、菜系歸類可疑、命名不精確、或不利於宴席節奏的項目，請逐條指出。你必須額外執行『食材多樣性掃描』『重複菜色／近似菜色掃描』與『高度預製適配性掃描』，檢查同一分類或跨分類是否出現主食材、烹法、味型過度相似的候選，避免全豬肉、全白菜、全糯米，以及同類型糖醋魚、排骨、雞湯重複堆疊；同時要主動標記那些不適合冷凍、解凍、覆熱、回蒸、回炸、微波的菜色，必要時建議直接剔除。",
    "4. 針對每個宴席地位，提出菜色調整、修改或補充建議；若候選不足，請主動擴增菜品庫，補出更多適合同位階的候選菜。目標是把菜庫補強、補深、補廣，不是維持目前的候選數量；若有必要，可以明確建議某些地位增加到超過現有數量。補充建議時，請優先補進與現有食材屬性不同、且適合高度預製的候選。",
    "5. 對所有你認為命名不夠標準、不夠精確、過於口語、或不符合常見食譜書／料理資料庫寫法的名稱提出修正建議。這裡不只包含菜名，也包含像『左先鋒』『主帥』『靈魂洗滌』這類宴席位階／分類名稱；若你認為它們可以改成更接近食譜書、正式菜單分類、料理資料庫欄位的標準名稱，也可以提出對照建議。對菜系名稱也請一併審核，優先使用可見於食譜書或料理資料庫的標準分類；避免使用『融合菜』『創意菜』『私房菜』這類模糊標籤，也避免使用會讓八菜一湯偏離中式料理範圍的非中式分類。若無法精準歸類，請標記『待人工確認』並說明原因。不要為了更好聽而任意升級食材、改變料理層級、或加入原本不存在的食材與修辭。",
    "6. 請先彙整前面所有與『菜庫內容本身』有關的修改事項，另外整理成一段『可直接複製貼給 IDE 的菜庫修改提示詞』。這一段的目的，是讓 IDE 直接依據你的覆核結果去修改與擴增候選菜庫資料；必須明確列出要刪除、替換、改名、補充、增列的宴席地位、菜名、菜系、預製度與原因，並明確提醒 IDE 不需要拘泥於目前每個地位的候選數量。若涉及菜名或位階名稱修正，請以食譜書標準命名、正式菜單分類、資料庫欄位命名為優先，不要改寫成更華麗但偏離原本功能的名稱，也不要混入提示詞設計建議。",
    "7. 再另外整理一段『可直接複製貼給 IDE 的提示詞優化提示詞』，這一段主要用來優化未來給 LLM 的菜庫覆核提示詞；除了提示詞本身的結構與措辭，也可以納入系統設計面、資訊架構、欄位設計、輸入輸出格式、操作流程等會影響覆核品質的改善建議，但不要混入具體菜庫資料修改內容。這一段請強制使用「系統設計改善清單」格式輸出，至少包含：問題、影響、改善方向、建議做法、若要交給 IDE 執行時的提示詞草案，並把以下四項整併進新版 Prompt：A. 食材多樣性掃描；B. 標準化建檔 Schema；C. [Context] 區塊（至少含食用人數與設備限制）；D. 高度預製適配性剔除規則。",
    "8. 若某個宴席地位沒有問題，也要明確寫出『可保留』與原因，避免只挑錯不挑對。",
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
  if (role.includes("迎賓冷盤")) {
    return "迎賓冷盤";
  }

  if (role.includes("燒燴大菜")) {
    return "燒燴大菜";
  }

  if (role.includes("海鮮大菜")) {
    return "海鮮大菜";
  }

  if (role.includes("中場過場湯")) {
    return "中場過場湯";
  }

  if (role.includes("季節時蔬")) {
    return "季節時蔬";
  }

  if (role.includes("主食飯麵")) {
    return "主食飯麵";
  }

  if (role.includes("壓軸燉湯")) {
    return "壓軸燉湯";
  }

  if (role.includes("中式甜品")) {
    return "中式甜品";
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
      option.role === dish.role &&
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

    if (!storedDish || storedDish.role !== dish.role) {
      return dish;
    }

    return {
      ...storedDish,
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
      const candidate = (value as Record<string, unknown>)[role];

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
          item.role === role &&
          typeof item.dishName === "string" &&
          typeof item.cuisine === "string" &&
          typeof item.premadeLevel === "string",
      );

      return [
        role,
        validOptions.length
          ? validOptions.map((option, index) => ({
              ...option,
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
