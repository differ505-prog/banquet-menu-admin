import { describe, expect, it } from "vitest";

import { defaultMenu } from "../data/default-menu";
import {
  buildPoolBuilderWarnings,
  buildPoolDiversityRadar,
  cloneRoleDishLibrary,
  createEmptyRoleDishOption,
  getFinalMenuConstraintViolations,
  getPoolValidationIssues,
  getRoleDishOptions,
  InvalidPrepItemError,
  UnsupportedTerminalEquipmentException,
  validatePoolOptionOrThrow,
} from "../data/role-dish-library";
import {
  addRoleDishOption,
  buildCookingGuideText,
  buildCookingGuideSectionText,
  buildCookingReminderText,
  buildCookingSummary,
  buildEvaluationPrompt,
  buildExportJson,
  buildGuestMenuText,
  buildLibraryExportJson,
  buildLibraryReviewPrompt,
  buildMenuSummary,
  buildStorageVersion,
  buildThawGuideText,
  buildThawReminderText,
  buildThawSummary,
  ensureStorageVersion,
  filterDishes,
  getChangedDishCount,
  getMatchingLibraryOption,
  getCuisineDistribution,
  getPremadeReadyCount,
  getGuestCourseLabel,
  initialMenuState,
  LIBRARY_STORAGE_KEY,
  MENU_STORAGE_KEY,
  menuReducer,
  removeRoleDishOption,
  sanitizeRoleDishLibrary,
  sanitizeStoredDishes,
  STORAGE_VERSION_KEY,
  updateRoleDishOption,
} from "./menu";

describe("menu utilities", () => {
  it("filters dishes by cuisine and keyword", () => {
    const result = filterDishes(defaultMenu, {
      cuisine: "台菜",
      premadeLevel: "",
      keyword: "油飯",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.dishName).toBe("櫻花蝦油飯");
  });

  it("updates a dish through reducer while keeping other dishes untouched", () => {
    const state = initialMenuState(defaultMenu);
    const nextState = menuReducer(state, {
      type: "update",
      payload: {
        id: "4",
        field: "dishName",
        value: "清蒸石斑魚",
      },
    });

    expect(nextState.dishes.find((dish) => dish.id === "4")?.dishName).toBe("清蒸石斑魚");
    expect(nextState.dishes.find((dish) => dish.id === "3")?.dishName).toBe("杭州東坡肉");
  });

  it("replaces a dish from the same-role library while preserving role and id", () => {
    const state = initialMenuState(defaultMenu);
    const option = getRoleDishOptions("【海鮮大菜】主菜")[0];

    if (!option) {
      throw new Error("測試需要海鮮大菜候選菜");
    }

    const nextState = menuReducer(state, {
      type: "replaceFromLibrary",
      payload: {
        id: "4",
        option,
      },
    });

    const replacedDish = nextState.dishes.find((dish) => dish.id === "4");

    expect(replacedDish?.id).toBe("4");
    expect(replacedDish?.role).toBe("【海鮮大菜】主菜");
    expect(replacedDish?.dishName).toBe(option.dishName);
    expect(replacedDish?.cuisine).toBe(option.cuisine);
    expect(replacedDish?.thawProfile).toBe("fish");
    expect(replacedDish?.cookingProfile).toBe("steam-fish");
  });

  it("builds summary, prompt and export json with current menu", () => {
    const summary = buildMenuSummary(defaultMenu);
    const prompt = buildEvaluationPrompt(defaultMenu);
    const exportJson = buildExportJson(defaultMenu);

    expect(summary).toContain("本宴客菜單共 9 道");
    expect(summary).toContain("魚蝦肉冷凍食");
    expect(prompt).toContain("[Role]");
    expect(prompt).toContain("資深中式宴席資料庫架構師");
    expect(prompt).toContain("[Context & Constraints]");
    expect(prompt).toContain("本次輸入的是最終已選菜單（Final Menu）");
    expect(prompt).toContain("可見於食譜書與商業菜單資料庫");
    expect(prompt).toContain("本幫菜");
    expect(prompt).toContain("【海鮮大菜】主菜｜Schema:Main_Seafood｜破布子蒸午仔魚");
    expect(prompt).toContain("【燴扒蔬蕈】蔬菜｜Schema:Vegetable_Braised_Mushroom｜上湯煨娃娃菜");
    expect(exportJson).toContain("\"title\": \"高預製度宴客菜單\"");
    expect(exportJson).toContain("\"roleSchema\"");
    expect(exportJson).toContain("\"thawChecklist\"");
    expect(exportJson).toContain("\"cookingChecklist\"");
  });

  it("calculates cuisine distribution and ready count", () => {
    const distribution = getCuisineDistribution(defaultMenu);
    const readyCount = getPremadeReadyCount(defaultMenu);

    expect(distribution["台菜"]).toBe(3);
    expect(distribution["江浙菜"]).toBe(2);
    expect(readyCount).toBe(9);
  });

  it("matches the current dish to the correct same-role library option", () => {
    const dish = defaultMenu[0];

    if (!dish) {
      throw new Error("測試需要預設菜資料");
    }

    const matched = getMatchingLibraryOption(dish, getRoleDishOptions(dish.role));

    expect(matched?.dishName).toBe("五香醬牛腱");
    expect(getRoleDishOptions(dish.role)).toHaveLength(9);
  });

  it("counts how many dishes differ from the default menu", () => {
    const modifiedDishes = defaultMenu.map((dish) =>
      dish.id === "7" ? { ...dish, dishName: "干燒伊麵" } : dish,
    );

    expect(getChangedDishCount(defaultMenu, modifiedDishes)).toBe(1);
  });

  it("sanitizes stored dishes while preserving valid same-role overrides", () => {
    const restored = sanitizeStoredDishes(
      [
        {
          id: "4",
          role: "【海鮮大菜】主菜",
          dishName: "豆豉清蒸石斑魚",
          cuisine: "粵菜",
          premadeLevel: "電鍋蒸熱",
          cookingProfile: "steam-fish",
        },
        {
          id: "999",
          role: "錯誤角色",
          dishName: "不存在菜色",
          cuisine: "未知",
          premadeLevel: "未知",
        },
      ],
      defaultMenu,
    );

    expect(restored.find((dish) => dish.id === "4")?.dishName).toBe("豆豉清蒸石斑魚");
    expect(restored.find((dish) => dish.id === "4")?.thawProfile).toBe("fish");
    expect(restored.find((dish) => dish.id === "4")?.cookingProfile).toBe("steam-fish");
    expect(restored).toHaveLength(defaultMenu.length);
    expect(restored.find((dish) => dish.id === "9")?.dishName).toBe("冰糖紫米紅豆湯");
  });

  it("syncs current menu when a library option is edited", () => {
    const state = initialMenuState(defaultMenu);
    const previous = getRoleDishOptions("【海鮮大菜】主菜")[1];

    if (!previous) {
      throw new Error("測試需要海鮮大菜候選菜");
    }

    const nextState = menuReducer(state, {
      type: "syncLibraryOption",
      payload: {
        previous,
        next: {
          ...previous,
          dishName: "升級版午仔魚",
        },
      },
    });

    expect(nextState.dishes.find((dish) => dish.id === "4")?.dishName).toBe("升級版午仔魚");
    expect(nextState.dishes.find((dish) => dish.id === "4")?.thawProfile).toBe("fish");
    expect(nextState.dishes.find((dish) => dish.id === "4")?.cookingProfile).toBe("steam-fish");
  });

  it("sanitizes stored role library and keeps fallback roles", () => {
    const restored = sanitizeRoleDishLibrary(
      {
        "【中場過場湯】湯品": [
          {
            libraryId: "custom-soup-1",
            role: "【中場過場湯】湯品",
            dishName: "竹笙瑤柱海鮮羹",
            cuisine: "粵菜",
            premadeLevel: "瓦斯爐加熱",
            cookingProfile: "reheat-soup",
          },
        ],
      },
      cloneRoleDishLibrary(),
    );

    expect(restored["【承啟中湯】湯品"]?.[0]?.dishName).toBe("竹笙瑤柱海鮮羹");
    expect(restored["【承啟中湯】湯品"]?.[0]?.role).toBe("【承啟中湯】湯品");
    expect(restored["【承啟中湯】湯品"]?.[0]?.cookingProfile).toBe("reheat-soup");
    expect(restored["【迎賓冷盤一】迎賓冷盤"]?.length).toBe(9);
  });

  it("adds, updates and removes role library options", () => {
    const role = "【晏尾甜品】甜品";
    const created = createEmptyRoleDishOption(role);
    const added = addRoleDishOption(cloneRoleDishLibrary(), role, created);
    const updated = updateRoleDishOption(added, role, created.libraryId, "dishName", "桂花酒釀湯圓");
    const removed = removeRoleDishOption(updated, role, created.libraryId);

    expect(added[role]?.some((option) => option.libraryId === created.libraryId)).toBe(true);
    expect(updated[role]?.find((option) => option.libraryId === created.libraryId)?.dishName).toBe(
      "桂花酒釀湯圓",
    );
    expect(updated[role]?.find((option) => option.libraryId === created.libraryId)?.primaryIngredient).toBe(
      "dessert",
    );
    expect(removed[role]?.some((option) => option.libraryId === created.libraryId)).toBe(false);
  });

  it("hydrates pool metadata and blocks invalid pool dishes through interceptors", () => {
    const fishOption = getRoleDishOptions("【海鮮大菜】主菜").find(
      (option) => option.dishName === "豉汁蒸石斑魚",
    );

    expect(fishOption?.reheatMethods).toEqual(["RICE_COOKER"]);
    expect(fishOption?.primaryIngredient).toBe("fish");
    expect(fishOption?.flavorProfile).toBe("soy_braised");
    expect(fishOption?.prepSuitabilityScore).toBeGreaterThanOrEqual(3);

    expect(
      getPoolValidationIssues({
        ...createEmptyRoleDishOption("【燴扒蔬蕈】蔬菜"),
        dishName: "酥炸芥蘭",
        cuisine: "粵菜",
        premadeLevel: "氣炸鍋加熱",
        isLeafyGreen: true,
        isFried: true,
        requiresCrispyTexture: true,
        reheatMethods: ["MICROWAVE"],
        prepSuitabilityScore: 2,
      }),
    ).toEqual(
      expect.arrayContaining([
        "prep_suitability_score_below_threshold",
        "leafy_green_interceptor",
        "fried_texture_interceptor",
      ]),
    );

    expect(() =>
      validatePoolOptionOrThrow({
        ...createEmptyRoleDishOption("【海鮮大菜】主菜"),
        dishName: "酥炸魚塊",
        cuisine: "粵菜",
        premadeLevel: "烤箱加熱",
        reheatMethods: ["OVEN"],
      }),
    ).toThrow(UnsupportedTerminalEquipmentException);

    expect(() =>
      validatePoolOptionOrThrow({
        ...createEmptyRoleDishOption("【主食飯麵】主食"),
        dishName: "青江菜菜飯",
        cuisine: "本幫菜",
        premadeLevel: "微波/電鍋加熱",
        isLeafyGreen: true,
        prepSuitabilityScore: 2,
      }),
    ).toThrow(InvalidPrepItemError);
  });

  it("builds pool warnings and final menu constraint violations", () => {
    const library = cloneRoleDishLibrary();
    const warnings = buildPoolBuilderWarnings(library, "【燒燴大菜】主菜");
    const radar = buildPoolDiversityRadar(library, "【主食飯麵】主食");
    const violations = getFinalMenuConstraintViolations([
      {
        ...defaultMenu[2],
        dishName: "柱侯蘿蔔燉牛腩",
        cuisine: "粵菜",
        premadeLevel: "電鍋/瓦斯爐加熱",
        role: "【燒燴大菜】主菜",
      },
      {
        ...defaultMenu[4],
        dishName: "蘿蔔清燉牛腩",
        cuisine: "台菜",
        premadeLevel: "瓦斯爐加熱",
        role: "【承啟中湯】湯品",
      },
    ]);

    expect(warnings.some((warning) => warning.description.includes("無錫排骨"))).toBe(true);
    expect(warnings.some((warning) => warning.description.includes("鎮江排骨"))).toBe(true);
    expect(warnings.some((warning) => warning.description.includes("low_diversity"))).toBe(true);
    expect(
      warnings.some((warning) => warning.description.includes("cross_category_similarity_pair")),
    ).toBe(true);
    expect(radar.some((item) => item.exceedsThreshold)).toBe(true);
    expect(violations[0]?.message).toContain("Red Error");
    expect(violations[0]?.dishes.join("｜")).toContain("柱侯蘿蔔燉牛腩");
  });

  it("builds library review prompt and export json", () => {
    const library = cloneRoleDishLibrary();
    const prompt = buildLibraryReviewPrompt(library);
    const exportJson = buildLibraryExportJson(library);

    expect(prompt).toContain("[Role]");
    expect(prompt).toContain("資深中式宴席資料庫架構師");
    expect(prompt).toContain("[Pool]");
    expect(prompt).toContain("【海鮮大菜】主菜");
    expect(prompt).toContain("目前系統使用的分類 Schema 對照如下");
    expect(prompt).toContain("Appetizer_Cold_1");
    expect(prompt).toContain("Main_Seafood");
    expect(prompt).toContain("Vegetable_Braised_Mushroom");
    expect(prompt).toContain("[Context & Constraints]");
    expect(prompt).toContain("絕對純中式");
    expect(prompt).toContain("大眾中式");
    expect(prompt).toContain("可見於食譜書與商業菜單資料庫");
    expect(prompt).toContain("包含但不限於八大菜系");
    expect(prompt).toContain("本幫菜");
    expect(prompt).toContain("Pool（候選池）");
    expect(prompt).toContain("只有在『同一道菜重複出現在不同分類』");
    expect(prompt).toContain("[State Detection & Constraints]");
    expect(prompt).toContain("你必須在對話第一行強制判定");
    expect(prompt).toContain("IF state == Pool");
    expect(prompt).toContain("IF state == Final Menu");
    expect(prompt).toContain("[Evaluation Process (4D Scan)]");
    expect(prompt).toContain("[Output Format]");
    expect(prompt).toContain("可直接複製貼給 IDE 的菜庫修改提示詞");
    expect(prompt).toContain("可直接複製貼給 IDE 的提示詞優化提示詞");
    expect(prompt).toContain("可直接複製貼給 IDE 的架構設計提示詞");
    expect(prompt).toContain("不要輸出完整版 Prompt");
    expect(prompt).toContain("應修改的段落、原問題、建議寫法與預期效果");
    expect(prompt).toContain("不必拘泥於原先每個分類的候選數量");
    expect(prompt).toContain("Diversity Scan（多樣性掃描）");
    expect(prompt).toContain("Duplicate Scan（重複掃描）");
    expect(prompt).toContain("硬性重複（Hard Duplicate）");
    expect(prompt).toContain("Prep-Suitability Rule（高預製適配性掃描）");
    expect(prompt).toContain("候選同質性過高");
    expect(prompt).toContain("備選差異不足");
    expect(prompt).toContain("若目前是候選菜庫");
    expect(prompt).toContain("請於每一次對話初始");
    expect(prompt).toContain("『候選』『Pool』");
    expect(prompt).toContain("『請幫我配一桌』『最終菜單』");
    expect(prompt).toContain("你必須在輸出的第一行先聲明目前採用的狀態");
    expect(prompt).toContain("驗證重點是庫存健康度與廣度");
    expect(prompt).toContain("驗證重點才是搭配合理性");
    expect(prompt).toContain("備選池同質性風險");
    expect(prompt).toContain("『撞車』『同桌』『成菜』『這桌菜』");
    expect(prompt).toContain("同桌上菜將發生撞車");
    expect(prompt).toContain("同質性本身不得作為刪除理由");
    expect(prompt).toContain("若只是相近菜，應在本區提醒，不可移入刪除名單");
    expect(prompt).toContain("Schema Standardization（標準化掃描）");
    expect(prompt).toContain("嚴禁西式、日式、南洋等異國元素");
    expect(prompt).toContain("嚴禁需要烤箱、氣炸鍋");
    expect(prompt).toContain("綠色葉菜類");
    expect(prompt).toContain("包含切碎混入菜飯、炒飯、配菜中的做法");
    expect(prompt).toContain("菜系標註原則");
    expect(prompt).toContain("核心食材 + 烹調法 + 味型");
    expect(prompt).toContain("硬性重複（Hard Duplicate）");
    expect(prompt).toContain("軟性重複（Soft Duplicate）");
    expect(prompt).toContain("Yellow Warning：備選差異不足");
    expect(prompt).toContain("Red Error：撞菜風險，強制替換");
    expect(prompt).toContain("不要混入具體菜庫資料修改內容");
    expect(prompt).toContain("不可直接翻成刪菜指令");
    expect(prompt).toContain("不要混入具體菜色增刪名單");
    expect(prompt).toContain("prep_suitability_score");
    expect(prompt).toContain("reheat_methods");
    expect(prompt).toContain("primary_ingredient");
    expect(prompt).toContain("flavor_profile");
    expect(prompt).toContain("Pool Builder 的多樣性雷達圖");
    expect(prompt).toContain("Final Menu Generator 基於 Graph 或 CSP 的互斥規則引擎");
    expect(prompt).toContain("LeafyGreenInterceptor");
    expect(prompt).toContain("InvalidPrepItemError");
    expect(prompt).toContain("FriedTextureInterceptor");
    expect(prompt).toContain("Graph 或 CSP");
    expect(prompt).toContain("is_leafy_green");
    expect(prompt).toContain("is_fried");
    expect(prompt).toContain("奶黃壽桃包");
    expect(prompt).toContain("紅桂花酒釀圓子");
    expect(prompt).toContain("豉汁蒸石斑魚");
    expect(prompt).toContain("糖燻甘蔗雞");
    expect(prompt).toContain("酒釀乾燒大蝦");
    expect(prompt).toContain("桂花冰糖糯米藕");
    expect(prompt).toContain("紹興醉蛋");
    expect(prompt).toContain("白切雞");
    expect(prompt).toContain("本幫紅燒肉");
    expect(prompt).toContain("川味椒麻拌牛肚");
    expect(prompt).toContain("川味泡椒鳳爪");
    expect(prompt).toContain("老北京芥末鴨掌");
    expect(prompt).toContain("雞湯煨雙冬");
    expect(prompt).toContain("酸湯肥牛");
    expect(prompt).toContain("客家粉蒸肉");
    expect(prompt).toContain("糟溜魚片");
    expect(prompt).toContain("魚香茄子煲");
    expect(prompt).toContain("客家梅干扣肉包");
    expect(prompt).toContain("揚州香蒜叉燒炒飯");
    expect(prompt).toContain("台式古早味高麗菜飯");
    expect(prompt).toContain("栗子燒黃燜雞");
    expect(prompt).toContain("百合銀耳燉雪蛤");
    expect(prompt).toContain("鎮江排骨");
    expect(prompt).not.toContain("客家小炒");
    expect(prompt).not.toContain("干燒伊麵");
    expect(prompt).not.toContain("家鄉臘味煲仔飯");
    expect(prompt).not.toContain("芋泥椰汁西米露");
    expect(prompt).not.toContain("蒜蓉粿條蒸雪蟹腳");
    expect(prompt).not.toContain("上湯煨娃娃菜");
    expect(prompt).toContain("承啟中湯");
    expect(prompt).toContain("燴扒蔬蕈");
    expect(prompt).toContain("壓軸大湯");
    expect(prompt).toContain("晏尾甜品");
    expect(exportJson).toContain("柱侯蘿蔔燉牛腩");
    expect(exportJson).toContain("神仙八寶鴨");
    expect(exportJson).toContain("老鴨扁尖筍濃湯");
    expect(exportJson).toContain("台式紅燒羊腩煲");
    expect(exportJson).toContain("蟹黃燴芙蓉豆腐");
    expect(exportJson).toContain("蟹黃海鮮豆腐煲");
    expect(exportJson).toContain("鮑汁燴花膠海參");
    expect(exportJson).toContain("樹子冬瓜蒸海鱸魚");
    expect(exportJson).toContain("紅燒牛臉頰肉");
    expect(exportJson).toContain("蟲草花金針蒸滑雞");
    expect(exportJson).toContain("酸湯肥牛");
    expect(exportJson).toContain("客家粉蒸肉");
    expect(exportJson).toContain("扁尖筍百葉燒毛豆");
    expect(exportJson).toContain("白果烤麩");
    expect(exportJson).toContain("麻油猴頭菇");
    expect(exportJson).toContain("魚香茄子煲");
    expect(exportJson).toContain("上海蔥油拌麵");
    expect(exportJson).toContain("XO醬海鮮炒飯");
    expect(exportJson).toContain("揚州香蒜叉燒炒飯");
    expect(exportJson).toContain("台式古早味高麗菜飯");
    expect(exportJson).toContain("客家梅干扣肉包");
    expect(exportJson).toContain("雞湯煨雙冬");
    expect(exportJson).toContain("糟溜魚片");
    expect(exportJson).toContain("桂花冰糖糯米藕");
    expect(exportJson).toContain("紹興醉蛋");
    expect(exportJson).toContain("白切雞");
    expect(exportJson).toContain("本幫紅燒肉");
    expect(exportJson).toContain("川味椒麻拌牛肚");
    expect(exportJson).toContain("川味泡椒鳳爪");
    expect(exportJson).toContain("老北京芥末鴨掌");
    expect(exportJson).toContain("糖燻甘蔗雞");
    expect(exportJson).toContain("酒釀乾燒大蝦");
    expect(exportJson).toContain("奶黃壽桃包");
    expect(exportJson).toContain("紅桂花酒釀圓子");
    expect(exportJson).toContain("五味中卷");
    expect(exportJson).toContain("紅油拌腐竹");
    expect(exportJson).toContain("\"老醋陳皮拌雲耳\"");
    expect(exportJson).toContain("\"role\": \"【燴扒蔬蕈】蔬菜\"");
    expect(exportJson).toContain("粵菜");
    expect(exportJson).toContain("low_diversity");
    expect(exportJson).toContain("\"title\": \"高預製度宴客候選菜庫\"");
    expect(exportJson).toContain("\"roleSchema\"");
    expect(exportJson).toContain("\"library\"");
    expect(exportJson).toContain("\"poolWarnings\"");
    expect(exportJson).toContain("\"diversityRadar\"");
    expect(exportJson).toContain("high_similarity_pair");
    expect(exportJson).toContain("cross_category_similarity_pair");
    expect(exportJson).not.toContain("左宗棠雞");
    expect(exportJson).not.toContain("金沙南瓜焗蟹塊");
    expect(exportJson).not.toContain("藤椒酸菜煮魚片");
    expect(exportJson).not.toContain("干貝高湯燴刈菜");
    expect(exportJson).not.toContain("家鄉干貝炒伊麵");
    expect(exportJson).not.toContain("蒜蓉粿條蒸雪蟹腳");
    expect(exportJson).not.toContain("黑椒牛柳杏鮑菇");
    expect(exportJson).not.toContain("台式家常炒麵");
    expect(exportJson).not.toContain("上海菜飯");
    expect(exportJson).not.toContain("豆豉清蒸石斑魚");
    expect(exportJson).not.toContain("上湯煨娃娃菜");
  });

  it("invalidates persisted workspace when default data version changes", () => {
    const createStorageMock = (initialValues: Record<string, string>) => {
      const store = new Map(Object.entries(initialValues));

      return {
        getItem: (key: string) => store.get(key) ?? null,
        setItem: (key: string, value: string) => {
          store.set(key, value);
        },
        removeItem: (key: string) => {
          store.delete(key);
        },
      };
    };
    const currentLibrary = cloneRoleDishLibrary();
    const currentVersion = buildStorageVersion(defaultMenu, currentLibrary);
    const updatedLibrary = cloneRoleDishLibrary();

    updatedLibrary["【燒燴大菜】主菜"] = [
      ...updatedLibrary["【燒燴大菜】主菜"],
      {
        ...updatedLibrary["【燒燴大菜】主菜"][0],
        libraryId: "version-check-option",
        dishName: "版本測試菜",
      },
    ];

    const nextVersion = buildStorageVersion(defaultMenu, updatedLibrary);
    const storage = createStorageMock({
      [MENU_STORAGE_KEY]: JSON.stringify(defaultMenu),
      [LIBRARY_STORAGE_KEY]: JSON.stringify(currentLibrary),
      [STORAGE_VERSION_KEY]: currentVersion,
    });

    expect(nextVersion).not.toBe(currentVersion);
    expect(ensureStorageVersion(storage, nextVersion)).toBe(true);
    expect(storage.getItem(MENU_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(LIBRARY_STORAGE_KEY)).toBeNull();
    expect(storage.getItem(STORAGE_VERSION_KEY)).toBe(nextVersion);
    expect(ensureStorageVersion(storage, nextVersion)).toBe(false);
  });

  it("maps banquet roles to guest-facing course labels", () => {
    expect(getGuestCourseLabel("【海鮮大菜】主菜")).toBe("海鮮大菜");
    expect(getGuestCourseLabel("【季節時蔬】蔬菜")).toBe("燴扒蔬蕈");
    expect(getGuestCourseLabel("【燴扒蔬蕈】蔬菜")).toBe("燴扒蔬蕈");
    expect(getGuestCourseLabel("【中式甜品】甜品")).toBe("晏尾甜品");
    expect(getGuestCourseLabel("【晏尾甜品】甜品")).toBe("晏尾甜品");
  });

  it("builds guest-facing menu text without backend terms", () => {
    const guestMenuText = buildGuestMenuText(defaultMenu);

    expect(guestMenuText).toContain("私宴菜單");
    expect(guestMenuText).toContain("海鮮大菜｜破布子蒸午仔魚");
    expect(guestMenuText).toContain("燴扒蔬蕈｜上湯煨娃娃菜");
    expect(guestMenuText).not.toContain("預製度");
  });

  it("builds thaw guide and dish-level reminder text", () => {
    const thawGuideText = buildThawGuideText();
    const thawReminderText = buildThawReminderText(defaultMenu);
    const thawSummary = buildThawSummary(defaultMenu);

    expect(thawGuideText).toContain("3% 鹽冰水解凍法");
    expect(thawGuideText).toContain("密封流水解凍法");
    expect(thawReminderText).toContain("【海鮮大菜】主菜｜破布子蒸午仔魚");
    expect(thawReminderText).toContain("最佳：3% 鹽冰水解凍法（9.8/10）");
    expect(thawSummary).toContain("魚蝦肉冷凍食");
  });

  it("builds cooking guide and dish-level reminder text", () => {
    const cookingGuideText = buildCookingGuideText();
    const cookingReminderText = buildCookingReminderText(defaultMenu);
    const cookingSummary = buildCookingSummary(defaultMenu);

    expect(cookingGuideText).toContain("油炸火候表");
    expect(cookingGuideText).toContain("氣炸烤箱免解凍速查表");
    expect(cookingGuideText).toContain("清蒸火候表");
    expect(cookingGuideText).toContain("全魚 600g 至 800g");
    expect(cookingGuideText).toContain("冷凍香腸");
    expect(cookingGuideText).toContain("180°C");
    expect(cookingGuideText).toContain("12 至 15 分鐘");
    expect(cookingGuideText).toContain("冷凍甜不辣");
    expect(cookingGuideText).toContain("190°C");
    expect(cookingGuideText).toContain("冷凍魚丸 / 花枝丸");
    expect(cookingGuideText).toContain("冷凍米血糕 / 黑輪片");
    expect(buildCookingGuideSectionText("air-fryer")).toContain("冷凍香腸");
    expect(buildCookingGuideSectionText("air-fryer")).not.toContain("全魚 600g 至 800g");
    expect(buildCookingGuideSectionText("steam")).toContain("全魚 600g 至 800g");
    expect(buildCookingGuideSectionText("steam")).not.toContain("冷凍甜不辣");
    expect(cookingReminderText).toContain("【海鮮大菜】主菜｜破布子蒸午仔魚");
    expect(cookingReminderText).toContain("類型：魚類清蒸");
    expect(cookingSummary).toContain("清蒸");
  });
});
