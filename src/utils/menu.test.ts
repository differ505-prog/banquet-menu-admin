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
      cuisine: "粵菜",
      premadeLevel: "",
      keyword: "糯米",
    });

    expect(result).toHaveLength(1);
    expect(result[0]?.dishName).toBe("廣式臘味糯米飯");
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
    const option = getRoleDishOptions("【主帥】壓軸定海神針")[1];

    if (!option) {
      throw new Error("測試需要主帥候選菜");
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
    expect(replacedDish?.role).toBe("【主帥】壓軸定海神針");
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
    expect(prompt).toContain("請你以宴客顧問與備餐流程規劃師的角度");
    expect(prompt).toContain("【主帥】壓軸定海神針｜古法樹子蒸鱸魚");
    expect(exportJson).toContain("\"title\": \"高預製度宴客菜單\"");
    expect(exportJson).toContain("\"thawChecklist\"");
    expect(exportJson).toContain("\"cookingChecklist\"");
  });

  it("calculates cuisine distribution and ready count", () => {
    const distribution = getCuisineDistribution(defaultMenu);
    const readyCount = getPremadeReadyCount(defaultMenu);

    expect(distribution["台菜"]).toBe(2);
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
    expect(getRoleDishOptions(dish.role)).toHaveLength(3);
  });

  it("counts how many dishes differ from the default menu", () => {
    const modifiedDishes = defaultMenu.map((dish) =>
      dish.id === "7" ? { ...dish, dishName: "櫻花蝦油飯" } : dish,
    );

    expect(getChangedDishCount(defaultMenu, modifiedDishes)).toBe(1);
  });

  it("sanitizes stored dishes while preserving valid same-role overrides", () => {
    const restored = sanitizeStoredDishes(
      [
        {
          id: "4",
          role: "【主帥】壓軸定海神針",
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
    const previous = getRoleDishOptions("【主帥】壓軸定海神針")[0];

    if (!previous) {
      throw new Error("測試需要主帥候選菜");
    }

    const nextState = menuReducer(state, {
      type: "syncLibraryOption",
      payload: {
        previous,
        next: {
          ...previous,
          dishName: "升級版蒸鱸魚",
        },
      },
    });

    expect(nextState.dishes.find((dish) => dish.id === "4")?.dishName).toBe("升級版蒸鱸魚");
    expect(nextState.dishes.find((dish) => dish.id === "4")?.thawProfile).toBe("fish");
    expect(nextState.dishes.find((dish) => dish.id === "4")?.cookingProfile).toBe("steam-fish");
  });

  it("sanitizes stored role library and keeps fallback roles", () => {
    const restored = sanitizeRoleDishLibrary(
      {
        "【主帥】壓軸定海神針": [
          {
            libraryId: "custom-main-1",
            role: "【主帥】壓軸定海神針",
            dishName: "乾燒黃魚",
            cuisine: "江浙菜",
            premadeLevel: "電鍋蒸熱",
            cookingProfile: "steam-fish",
          },
        ],
      },
      cloneRoleDishLibrary(),
    );

    expect(restored["【主帥】壓軸定海神針"]?.[0]?.dishName).toBe("乾燒黃魚");
    expect(restored["【主帥】壓軸定海神針"]?.[0]?.thawProfile).toBe("fish");
    expect(restored["【主帥】壓軸定海神針"]?.[0]?.cookingProfile).toBe("steam-fish");
    expect(restored["【左先鋒】開胃冷盤"]?.length).toBe(3);
  });

  it("adds, updates and removes role library options", () => {
    const role = "【甜蜜餘韻】甜品";
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

    expect(prompt).toContain("請你以中式宴席顧問");
    expect(prompt).toContain("【主帥】壓軸定海神針");
    expect(prompt).toContain("整體評分（滿分 10 分");
    expect(prompt).toContain("給 LLM 的覆核提示詞");
    expect(prompt).toContain("可直接複製貼給 IDE 的菜庫修改提示詞");
    expect(prompt).toContain("可直接複製貼給 IDE 的提示詞優化提示詞");
    expect(prompt).toContain("主動擴增菜品庫");
    expect(prompt).toContain("不需要拘泥於目前每個地位的候選數量");
    expect(prompt).toContain("系統設計面、資訊架構、欄位設計");
    expect(prompt).toContain("不要混入具體菜庫資料修改內容");
    expect(exportJson).toContain("\"title\": \"高預製度宴客候選菜庫\"");
    expect(exportJson).toContain("\"library\"");
  });

  it("maps banquet roles to guest-facing course labels", () => {
    expect(getGuestCourseLabel("【主帥】壓軸定海神針")).toBe("宴席主菜");
    expect(getGuestCourseLabel("【甜蜜餘韻】甜品")).toBe("甜蜜餘韻");
  });

  it("builds guest-facing menu text without backend terms", () => {
    const guestMenuText = buildGuestMenuText(defaultMenu);

    expect(guestMenuText).toContain("私宴菜單");
    expect(guestMenuText).toContain("宴席主菜｜古法樹子蒸鱸魚");
    expect(guestMenuText).not.toContain("預製度");
  });

  it("builds thaw guide and dish-level reminder text", () => {
    const thawGuideText = buildThawGuideText();
    const thawReminderText = buildThawReminderText(defaultMenu);
    const thawSummary = buildThawSummary(defaultMenu);

    expect(thawGuideText).toContain("3% 鹽冰水解凍法");
    expect(thawGuideText).toContain("密封流水解凍法");
    expect(thawReminderText).toContain("【主帥】壓軸定海神針｜古法樹子蒸鱸魚");
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
    expect(cookingReminderText).toContain("【主帥】壓軸定海神針｜古法樹子蒸鱸魚");
    expect(cookingReminderText).toContain("類型：魚類清蒸");
    expect(cookingSummary).toContain("清蒸");
  });
});
