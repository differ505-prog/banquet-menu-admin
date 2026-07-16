"use client";

import { useEffect, useMemo, useReducer, useState } from "react";
import { Eye, PanelRightOpen, RefreshCcw, Sparkles } from "lucide-react";

import { defaultMenu } from "@/data/default-menu";
import {
  buildPoolBuilderWarnings,
  buildPoolDiversityRadar,
  cloneRoleDishLibrary,
  createEmptyRoleDishOption,
} from "@/data/role-dish-library";
import { StatCard } from "@/components/stat-card";
import { ThawGuideModal } from "@/components/thaw-guide-modal";
import { CulinaryGuideModal } from "@/components/culinary-guide-modal";
import { DaxiHarborGuideModal } from "@/components/daxi-harbor-guide-modal";
import {
  culinaryTechniques,
  culinarySkillRecommendations,
} from "@/data/culinary-techniques";
import {
  daxiGoldenList,
  daxiSkipList,
} from "@/data/daxi-harbor-guide";
import type { CopyTarget, MainTabKey } from "@/types/menu";
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
import { MainTab } from "@/components/main-tab";
import { DailyCookingContent } from "@/components/daily-cooking-content";
import { BanquetContent } from "@/components/banquet-content";
import { KnowledgeToolsContent } from "@/components/knowledge-tools-content";
import { OutputPanel } from "@/components/output-panel";
import { GuestPreview } from "@/components/guest-preview";
import { LibraryManager } from "@/components/library-manager";

const createDefaultLibraryState = () => cloneRoleDishLibrary();
const CURRENT_STORAGE_VERSION = buildStorageVersion(defaultMenu, createDefaultLibraryState());

export function MenuApp() {
  const [state, dispatch] = useReducer(menuReducer, defaultMenu, initialMenuState);
  const [copiedTarget, setCopiedTarget] = useState<CopyTarget | null>(null);
  const [hasHydrated, setHasHydrated] = useState(false);
  const [isOutputOpen, setIsOutputOpen] = useState(false);
  const [isGuestPreviewOpen, setIsGuestPreviewOpen] = useState(false);
  const [isThawGuideOpen, setIsThawGuideOpen] = useState(false);
  const [isCulinaryGuideOpen, setIsCulinaryGuideOpen] = useState(false);
  const [isDaxiGuideOpen, setIsDaxiGuideOpen] = useState(false);
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

  const [activeTab, setActiveTab] = useState<MainTabKey>("banquet");

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
      {/* Brand Header */}
      <section className="overflow-hidden rounded-[36px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top_left,rgba(160,186,176,0.22),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(211,190,176,0.18),transparent_24%),linear-gradient(135deg,rgba(15,24,33,0.96),rgba(9,15,22,0.95))] p-6 shadow-[0_30px_100px_rgba(2,12,20,0.42)] sm:p-8">
        <div className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-start sm:text-left">
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[color:var(--accent-strong)]">
              <Sparkles className="h-4 w-4" />
              我的烹飪手冊
            </div>
            <h1 className="serif-title mt-6 max-w-2xl text-4xl font-semibold tracking-tight text-[color:var(--foreground)] sm:text-5xl">
              為任何烹飪，前置什麼料、懂什麼技法。
            </h1>
            <p className="mt-4 max-w-xl text-sm leading-8 text-[color:var(--muted)]">
              三個入口：宴客備什麼菜、日常備什麼菜、備菜前要懂什麼技法。選擇你的需求，系統為你整理好一切。
            </p>
          </div>

          <div className="flex shrink-0 flex-wrap justify-center gap-3 sm:flex-nowrap">
            <button
              type="button"
              onClick={() => setIsGuestPreviewOpen(true)}
              className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
            >
              <Eye className="h-4 w-4" />
              預覽賓客版
            </button>
            <button
              type="button"
              onClick={() => setIsOutputOpen(true)}
              className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
            >
              <PanelRightOpen className="h-4 w-4" />
              工作輸出
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mt-8">
          <MainTab activeTab={activeTab} onTabChange={setActiveTab} />
        </div>
      </section>

      {/* Tab Content */}
      <section className="space-y-6">
        {activeTab === "banquet" ? (
          <BanquetContent
            dishes={state.dishes}
            libraryState={libraryState}
            selectedDishId={state.selectedDishId}
            activeLibraryRole={activeLibraryRole}
            cuisineOptions={cuisineOptions}
            premadeOptions={premadeOptions}
            copiedTarget={copiedTarget}
            activeLibraryCount={activeLibraryCount}
            activeLibraryWarnings={activeLibraryWarnings}
            activeLibraryRadar={activeLibraryRadar}
            roleOrder={roleOrder}
            libraryReviewPrompt={libraryReviewPrompt}
            libraryExportJson={libraryExportJson}
            cuisineDistribution={cuisineDistribution}
            changedDishCount={changedDishCount}
            roleLibraryCount={roleLibraryCount}
            onDishSelect={(id) => dispatch({ type: "select", payload: id })}
            onDishChange={(id, field, value) =>
              dispatch({ type: "update", payload: { id, field, value } })
            }
            onDishReplace={(id, option) =>
              dispatch({ type: "replaceFromLibrary", payload: { id, option } })
            }
            onLibraryRoleChange={setActiveLibraryRole}
            onLibraryAdd={(role) =>
              setLibraryState((current) =>
                addRoleDishOption(current, role, createEmptyRoleDishOption(role)),
              )
            }
            onLibraryDelete={(role, libraryId) =>
              setLibraryState((current) => removeRoleDishOption(current, role, libraryId))
            }
            onLibraryUpdate={handleLibraryOptionUpdate}
            onLibraryApply={applyLibraryOption}
            onLibraryCopy={copyText}
            onOpenGuestPreview={() => setIsGuestPreviewOpen(true)}
            onOpenOutput={() => setIsOutputOpen(true)}
            onResetMenu={() => dispatch({ type: "reset", payload: defaultMenu })}
          />
        ) : activeTab === "daily" ? (
          <DailyCookingContent />
        ) : (
          <KnowledgeToolsContent
            copiedTarget={copiedTarget}
            onCopy={copyText}
            onOpenThawGuide={() => setIsThawGuideOpen(true)}
            onOpenCulinaryGuide={() => setIsCulinaryGuideOpen(true)}
            onOpenSeafoodGuide={() => setIsDaxiGuideOpen(true)}
          />
        )}
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

      <DaxiHarborGuideModal
        goldenList={daxiGoldenList}
        skipList={daxiSkipList}
        open={isDaxiGuideOpen}
        onClose={() => setIsDaxiGuideOpen(false)}
        onCopy={copyText}
        copiedTarget={copiedTarget}
      />
    </main>
  );
}
