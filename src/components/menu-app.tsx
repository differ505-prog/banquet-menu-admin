"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { Ban, CookingPot, Eye, PanelRightOpen, RefreshCcw, Search, Sparkles, Utensils } from "lucide-react";

import { defaultMenu } from "@/data/default-menu";
import {
  buildPoolBuilderWarnings,
  buildPoolDiversityRadar,
  cloneRoleDishLibrary,
  createEmptyRoleDishOption,
} from "@/data/role-dish-library";
import { DishCard } from "@/components/dish-card";
import { GuestPreview } from "@/components/guest-preview";
import { LibraryManager } from "@/components/library-manager";
import { OutputPanel } from "@/components/output-panel";
import { StatCard } from "@/components/stat-card";
import { ThawGuideModal } from "@/components/thaw-guide-modal";
import { CulinaryGuideModal } from "@/components/culinary-guide-modal";
import {
  culinaryTechniques,
  culinarySkillRecommendations,
} from "@/data/culinary-techniques";
import type { CopyTarget } from "@/types/menu";
import {
  buildCookingGuideText,
  buildCookingReminderText,
  buildCookingSummary,
  addRoleDishOption,
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
  getCookingGuides,
  getCuisineDistribution,
  getPremadeReadyCount,
  getThawGuides,
  getUniqueValues,
  initialMenuState,
  LIBRARY_STORAGE_KEY,
  MENU_STORAGE_KEY,
  menuReducer,
  removeRoleDishOption,
  sanitizeStoredDishes,
  sanitizeRoleDishLibrary,
  updateRoleDishOption,
} from "@/utils/menu";

const createDefaultLibraryState = () => cloneRoleDishLibrary();
const CURRENT_STORAGE_VERSION = buildStorageVersion(defaultMenu, createDefaultLibraryState());

export function MenuApp() {
  const [state, dispatch] = useReducer(menuReducer, defaultMenu, initialMenuState);
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [premadeFilter, setPremadeFilter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isOutputOpen, setIsOutputOpen] = useState(false);
  const [isGuestPreviewOpen, setIsGuestPreviewOpen] = useState(false);
  const [isThawGuideOpen, setIsThawGuideOpen] = useState(false);
  const [isCulinaryGuideOpen, setIsCulinaryGuideOpen] = useState(false);
  const [libraryState, setLibraryState] = useState(() => {
    const fallback = createDefaultLibraryState();

    if (typeof window === "undefined") {
      return fallback;
    }

    try {
      ensureStorageVersion(window.localStorage, CURRENT_STORAGE_VERSION);
      const libraryRaw = window.localStorage.getItem(LIBRARY_STORAGE_KEY);

      return libraryRaw ? sanitizeRoleDishLibrary(JSON.parse(libraryRaw), fallback) : fallback;
    } catch {
      window.localStorage.removeItem(LIBRARY_STORAGE_KEY);
      return fallback;
    }
  });
  const [activeLibraryRole, setActiveLibraryRole] = useState(defaultMenu[0]?.role ?? "");

  const roleOrder = defaultMenu.map((dish) => dish.role);

  useEffect(() => {
    try {
      ensureStorageVersion(window.localStorage, CURRENT_STORAGE_VERSION);
      const raw = window.localStorage.getItem(MENU_STORAGE_KEY);

      if (raw) {
        const parsed = JSON.parse(raw);
        const restored = sanitizeStoredDishes(parsed, defaultMenu);
        dispatch({ type: "reset", payload: restored });
      }
    } catch {
      window.localStorage.removeItem(MENU_STORAGE_KEY);
    } finally {
      setHasHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(state.dishes));
  }, [hasHydrated, state.dishes]);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    window.localStorage.setItem(LIBRARY_STORAGE_KEY, JSON.stringify(libraryState));
  }, [hasHydrated, libraryState]);

  const visibleDishes = useMemo(
    () =>
      filterDishes(state.dishes, {
        cuisine: cuisineFilter,
        premadeLevel: premadeFilter,
        keyword,
      }),
    [cuisineFilter, keyword, premadeFilter, state.dishes],
  );

  const cuisineDistribution = useMemo(
    () => getCuisineDistribution(state.dishes),
    [state.dishes],
  );
  const summary = useMemo(() => buildMenuSummary(state.dishes), [state.dishes]);
  const prompt = useMemo(() => buildEvaluationPrompt(state.dishes), [state.dishes]);
  const exportJson = useMemo(() => buildExportJson(state.dishes), [state.dishes]);
  const guestMenuText = useMemo(() => buildGuestMenuText(state.dishes), [state.dishes]);
  const libraryReviewPrompt = useMemo(
    () => buildLibraryReviewPrompt(libraryState),
    [libraryState],
  );
  const libraryExportJson = useMemo(
    () => buildLibraryExportJson(libraryState),
    [libraryState],
  );
  const thawGuides = useMemo(() => getThawGuides(), []);
  const cookingGuides = useMemo(() => getCookingGuides(), []);
  const thawGuideText = useMemo(() => buildThawGuideText(), []);
  const thawReminderText = useMemo(() => buildThawReminderText(state.dishes), [state.dishes]);
  const thawSummary = useMemo(() => buildThawSummary(state.dishes), [state.dishes]);
  const cookingGuideText = useMemo(() => buildCookingGuideText(), []);
  const cookingReminderText = useMemo(() => buildCookingReminderText(state.dishes), [state.dishes]);
  const cookingSummary = useMemo(() => buildCookingSummary(state.dishes), [state.dishes]);

  const copyText = async (value: string, target: CopyTarget) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
    } else {
      const textArea = document.createElement("textarea");
      textArea.value = value;
      textArea.style.position = "fixed";
      textArea.style.opacity = "0";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand("copy");
      document.body.removeChild(textArea);
    }

    setCopiedTarget(target);
    window.setTimeout(
      () => setCopiedTarget((current) => (current === target ? null : current)),
      1800,
    );
  };

  const cuisineOptions = getUniqueValues(state.dishes, "cuisine");
  const premadeOptions = getUniqueValues(state.dishes, "premadeLevel");
  const roleLibraryCount = Object.values(libraryState).reduce(
    (total, options) => total + options.length,
    0,
  );
  const changedDishCount = getChangedDishCount(defaultMenu, state.dishes);
  const activeLibraryCount = libraryState[activeLibraryRole]?.length ?? 0;
  const activeLibraryWarnings = useMemo(
    () => buildPoolBuilderWarnings(libraryState, activeLibraryRole),
    [activeLibraryRole, libraryState],
  );
  const activeLibraryRadar = useMemo(
    () => buildPoolDiversityRadar(libraryState, activeLibraryRole),
    [activeLibraryRole, libraryState],
  );

  const applyLibraryOption = (option: (typeof libraryState)[string][number]) => {
    const targetDish = state.dishes.find((dish) => dish.role === option.role);

    if (!targetDish) {
      return;
    }

    dispatch({
      type: "replaceFromLibrary",
      payload: { id: targetDish.id, option },
    });
  };

  const handleLibraryOptionUpdate = (
    role: string,
    libraryId: string,
    field: "dishName" | "cuisine" | "premadeLevel",
    value: string,
  ) => {
    const previous = (libraryState[role] ?? []).find((option) => option.libraryId === libraryId);

    if (!previous) {
      return;
    }

    const next = {
      ...previous,
      [field]: value,
    };

    setLibraryState((current) => updateRoleDishOption(current, role, libraryId, field, value));
    dispatch({
      type: "syncLibraryOption",
      payload: { previous, next },
    });
  };

  return (
    <main className="relative mx-auto flex w-full max-w-[1440px] flex-col gap-8 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
      <section className="overflow-hidden rounded-[36px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top_left,rgba(160,186,176,0.22),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(211,190,176,0.18),transparent_24%),linear-gradient(135deg,rgba(15,24,33,0.96),rgba(9,15,22,0.95))] p-6 shadow-[0_30px_100px_rgba(2,12,20,0.42)] sm:p-8">
        <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[color:var(--accent-strong)]">
              <Sparkles className="h-4 w-4" />
              私宴菜單編排系統
            </div>
            <h1 className="serif-title mt-6 max-w-3xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              以宴席地位為骨架，組裝一份優雅、體面、從容上桌的私宴菜單。
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-8 text-[color:var(--muted)]">
              主畫面只保留你真正需要的編排工作區。工作輸出與賓客版菜單都收進獨立面板，需要時再打開。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsCulinaryGuideOpen(true)}
                className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <Utensils className="h-4 w-4" />
                職人技術修煉手冊
              </button>
              <button
                type="button"
                onClick={() => setIsThawGuideOpen(true)}
                className="btn-accent inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <CookingPot className="h-4 w-4" />
                查看廚房戰情室秘笈
              </button>
              <button
                type="button"
                onClick={() => setIsGuestPreviewOpen(true)}
                className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <Eye className="h-4 w-4" />
                預覽賓客版菜單
              </button>
              <button
                type="button"
                onClick={() => setIsOutputOpen(true)}
                className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <PanelRightOpen className="h-4 w-4" />
                打開工作輸出
              </button>
            </div>
          </div>

          <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5 backdrop-blur-xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">當前宴席輪廓</p>
            <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
              <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
                <span>菜單總道數</span>
                <span className="font-semibold text-[color:var(--foreground)]">{state.dishes.length} 道</span>
              </p>
              <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
                <span>已調整模組</span>
                <span className="font-semibold text-[color:var(--foreground)]">{changedDishCount} 道</span>
              </p>
              <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
                <span>可快速完成品項</span>
                <span className="font-semibold text-[color:var(--foreground)]">{getPremadeReadyCount(state.dishes)} 道</span>
              </p>
              <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
                <span>目前菜庫候選</span>
                <span className="font-semibold text-[color:var(--foreground)]">{roleLibraryCount} 筆</span>
              </p>
            </div>
            <p className="mt-4 rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 px-4 py-3 text-xs leading-6 text-[color:var(--foreground)]">
              已啟用本機自動保存；若系統偵測到預設菜單或候選菜庫版本更新，會自動清除舊快取並套用新版資料。
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => dispatch({ type: "reset", payload: defaultMenu })}
                className="btn-muted inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm transition"
              >
                <RefreshCcw className="h-4 w-4" />
                回復預設菜單
              </button>
              <span className="inline-flex items-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-2.5 text-xs text-[color:var(--muted)]">
                賓客視角不會看到候選菜、預製度或工作輸出資訊
              </span>
            </div>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard
            label="菜系分布"
            value={`${Object.keys(cuisineDistribution).length} 系`}
            hint={Object.entries(cuisineDistribution)
              .map(([name, count]) => `${name}${count}`)
              .join("｜")}
          />
          <StatCard
            label="宴席結構"
            value="八菜一湯"
            hint="保留湯、主食、甜品與兩道冷盤，維持整桌節奏。"
          />
          <StatCard
            label="調整進度"
            value={`${changedDishCount} 道`}
            hint="以預設菜單為基準，計算目前已替換或微調的模組數量。"
          />
          <StatCard
            label="操作模式"
            value="同位換菜"
            hint={`內建 ${roleLibraryCount} 筆同地位候選菜，選取後即時同步輸出。`}
          />
        </div>
      </section>

      <section className="space-y-6">
        <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur-xl">
          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
            <label className="relative block">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
              <input
                value={keyword}
                onChange={(event) => setKeyword(event.target.value)}
                placeholder="搜尋宴席地位、菜名、菜系或預製度"
                className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] py-3 pr-4 pl-11 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
              />
            </label>

            <select
              value={cuisineFilter}
              onChange={(event) => setCuisineFilter(event.target.value)}
              className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
            >
              <option value="">全部菜系</option>
              {cuisineOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <select
              value={premadeFilter}
              onChange={(event) => setPremadeFilter(event.target.value)}
              className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
            >
              <option value="">全部預製度</option>
              {premadeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                setKeyword("");
                setCuisineFilter("");
                setPremadeFilter("");
              }}
              className="btn-muted inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm transition"
            >
              <Ban className="h-4 w-4" />
              清除
            </button>
          </div>
        </div>

        <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                工作台模式
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
                先編排菜單，再管理菜庫
              </h2>
              <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                工作輸出已改為抽屜式收納，主畫面留給菜色調整與候選菜庫維護，不再被長篇指令與 JSON 擠壓。
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => setIsCulinaryGuideOpen(true)}
                className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <Utensils className="h-4 w-4" />
                職人技術修煉手冊
              </button>
              <button
                type="button"
                onClick={() => setIsThawGuideOpen(true)}
                className="btn-accent inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <CookingPot className="h-4 w-4" />
                查看廚房戰情室秘笈
              </button>
              <button
                type="button"
                onClick={() => setIsGuestPreviewOpen(true)}
                className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <Eye className="h-4 w-4" />
                查看賓客版
              </button>
              <button
                type="button"
                onClick={() => setIsOutputOpen(true)}
                className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
              >
                <PanelRightOpen className="h-4 w-4" />
                打開工作輸出
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {visibleDishes.map((dish) => (
            <DishCard
              key={dish.id}
              dish={dish}
              roleOptions={libraryState[dish.role] ?? []}
              isSelected={state.selectedDishId === dish.id}
              onSelect={(id) => dispatch({ type: "select", payload: id })}
              onChange={(id, field, value) =>
                dispatch({ type: "update", payload: { id, field, value } })
              }
              onReplace={(id, option) =>
                dispatch({ type: "replaceFromLibrary", payload: { id, option } })
              }
            />
          ))}

          {!visibleDishes.length ? (
            <div className="rounded-[30px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-8 text-center text-sm leading-7 text-[color:var(--muted)]">
              沒有符合條件的菜色，請放寬搜尋關鍵字或切換篩選條件。
            </div>
          ) : null}
        </div>

        <LibraryManager
          roles={roleOrder}
          activeRole={activeLibraryRole}
          library={libraryState}
          copiedTarget={copiedTarget}
          onRoleChange={setActiveLibraryRole}
          onAdd={(role) =>
            setLibraryState((current) =>
              addRoleDishOption(current, role, createEmptyRoleDishOption(role)),
            )
          }
          onDelete={(role, libraryId) =>
            setLibraryState((current) => removeRoleDishOption(current, role, libraryId))
          }
          onUpdate={handleLibraryOptionUpdate}
          onApply={applyLibraryOption}
          onCopy={copyText}
          libraryReviewPrompt={libraryReviewPrompt}
          libraryExportJson={libraryExportJson}
          poolWarnings={activeLibraryWarnings}
          diversityRadar={activeLibraryRadar}
        />

        <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur-xl">
          <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
            編排提醒
          </p>
          <div className="mt-4 grid gap-3 text-sm leading-7 text-[color:var(--muted)] lg:grid-cols-3">
            <p className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3">
              {thawSummary}
            </p>
            <p className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3">
              {cookingSummary}
            </p>
            <p className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3">
              當前選定的地位已有 {activeLibraryCount} 筆候選菜；需要逐道退冰與烹調順序時，可打開工作輸出查看完整提醒。
            </p>
          </div>
        </div>
      </section>

      <OutputPanel
        summary={summary}
        thawSummary={thawSummary}
        cookingSummary={cookingSummary}
        thawReminderText={thawReminderText}
        thawGuideText={thawGuideText}
        cookingReminderText={cookingReminderText}
        cookingGuideText={cookingGuideText}
        cookingGuides={cookingGuides}
        prompt={prompt}
        exportJson={exportJson}
        copiedTarget={copiedTarget}
        onCopy={copyText}
        open={isOutputOpen}
        onClose={() => setIsOutputOpen(false)}
      />

      <GuestPreview
        dishes={state.dishes}
        open={isGuestPreviewOpen}
        onClose={() => setIsGuestPreviewOpen(false)}
        onCopy={copyText}
        copiedTarget={copiedTarget}
        guestMenuText={guestMenuText}
      />

      <ThawGuideModal
        guides={thawGuides}
        cookingGuides={cookingGuides}
        open={isThawGuideOpen}
        onClose={() => setIsThawGuideOpen(false)}
        onCopy={copyText}
        copiedTarget={copiedTarget}
        guideText={thawGuideText}
        cookingGuideText={cookingGuideText}
        cookingSummary={cookingSummary}
      />

      <CulinaryGuideModal
        sections={culinaryTechniques}
        skillRecommendations={culinarySkillRecommendations}
        open={isCulinaryGuideOpen}
        onClose={() => setIsCulinaryGuideOpen(false)}
        onCopy={copyText}
        copiedTarget={copiedTarget}
      />
    </main>
  );
}
