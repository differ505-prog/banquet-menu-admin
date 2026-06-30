import { describe, expect, it } from "vitest";

import { defaultMenu } from "../data/default-menu";
import {
  cloneRoleDishLibrary,
  createEmptyRoleDishOption,
  getRoleDishOptions,
} from "../data/role-dish-library";
import {
  addRoleDishOption,
  buildCookingGuideText,
  buildCookingReminderText,
  buildCookingSummary,
  buildEvaluationPrompt,
  buildExportJson,
  buildGuestMenuText,
  buildLibraryExportJson,
  buildLibraryReviewPrompt,
  buildMenuSummary,
  buildThawGuideText,
  buildThawReminderText,
  buildThawSummary,
  filterDishes,
  getChangedDishCount,
  getMatchingLibraryOption,
  getCuisineDistribution,
  getPremadeReadyCount,
  getGuestCourseLabel,
  initialMenuState,
  menuReducer,
  removeRoleDishOption,
  sanitizeRoleDishLibrary,
  sanitizeStoredDishes,
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
    expect(prompt).toContain("【海鮮大菜】主菜｜Schema:Main_Seafood｜破布子蒸午仔魚");
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
    expect(getRoleDishOptions(dish.role)).toHaveLength(6);
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
    expect(restored["【迎賓冷盤一】迎賓冷盤"]?.length).toBe(6);
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
    expect(removed[role]?.some((option) => option.libraryId === created.libraryId)).toBe(false);
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
    expect(prompt).toContain("[Context & Constraints]");
    expect(prompt).toContain("絕對純中式");
    expect(prompt).toContain("大眾中式");
    expect(prompt).toContain("候選菜庫（Pool）");
    expect(prompt).toContain("[Evaluation Process (4D Scan)]");
    expect(prompt).toContain("[Output Format]");
    expect(prompt).toContain("可直接複製貼給 IDE 的菜庫修改提示詞");
    expect(prompt).toContain("可直接複製貼給 IDE 的提示詞優化提示詞");
    expect(prompt).toContain("不必拘泥於原先每個分類的候選數量");
    expect(prompt).toContain("Diversity Scan（多樣性掃描）");
    expect(prompt).toContain("Duplicate Scan（重複掃描）");
    expect(prompt).toContain("Prep-Suitability Rule（高預製適配性掃描）");
    expect(prompt).toContain("候選同質性過高");
    expect(prompt).toContain("備選差異不足");
    expect(prompt).toContain("若目前是候選菜庫");
    expect(prompt).toContain("同桌上菜將發生撞車");
    expect(prompt).toContain("Schema Standardization（標準化掃描）");
    expect(prompt).toContain("嚴禁西式、日式、南洋等異國元素");
    expect(prompt).toContain("嚴禁需要烤箱、氣炸鍋");
    expect(prompt).toContain("不要混入具體菜庫資料修改內容");
    expect(prompt).toContain("鎮江排骨");
    expect(prompt).toContain("蒜蓉粿條蒸雪蟹腳");
    expect(prompt).toContain("客家小炒");
    expect(prompt).toContain("承啟中湯");
    expect(prompt).toContain("壓軸大湯");
    expect(prompt).toContain("晏尾甜品");
    expect(exportJson).toContain("柱侯蘿蔔燉牛腩");
    expect(exportJson).toContain("神仙八寶鴨");
    expect(exportJson).toContain("老鴨扁尖筍濃湯");
    expect(exportJson).toContain("粵菜");
    expect(exportJson).toContain("\"title\": \"高預製度宴客候選菜庫\"");
    expect(exportJson).toContain("\"roleSchema\"");
    expect(exportJson).toContain("\"library\"");
  });

  it("maps banquet roles to guest-facing course labels", () => {
    expect(getGuestCourseLabel("【海鮮大菜】主菜")).toBe("海鮮大菜");
    expect(getGuestCourseLabel("【中式甜品】甜品")).toBe("晏尾甜品");
    expect(getGuestCourseLabel("【晏尾甜品】甜品")).toBe("晏尾甜品");
  });

  it("builds guest-facing menu text without backend terms", () => {
    const guestMenuText = buildGuestMenuText(defaultMenu);

    expect(guestMenuText).toContain("私宴菜單");
    expect(guestMenuText).toContain("海鮮大菜｜破布子蒸午仔魚");
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
    expect(cookingGuideText).toContain("清蒸火候表");
    expect(cookingGuideText).toContain("全魚 600g 至 800g");
    expect(cookingReminderText).toContain("【海鮮大菜】主菜｜破布子蒸午仔魚");
    expect(cookingReminderText).toContain("類型：魚類清蒸");
    expect(cookingSummary).toContain("清蒸");
  });
});
