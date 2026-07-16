"use client";

import { useState } from "react";
import { Ban, RefreshCcw, Search } from "lucide-react";
import { DishCard } from "@/components/dish-card";
import { StatCard } from "@/components/stat-card";
import type {
  MenuDish,
  RoleDishOption,
  RoleDishLibrary,
  CopyTarget,
  PoolDiversityWarning,
  PoolDiversityRadarItem,
} from "@/types/menu";
import { getPremadeReadyCount } from "@/utils/menu";

interface BanquetContentProps {
  dishes: MenuDish[];
  libraryState: RoleDishLibrary;
  selectedDishId: string | null;
  activeLibraryRole: string;
  cuisineOptions: string[];
  premadeOptions: string[];
  copiedTarget: CopyTarget | null;
  activeLibraryCount: number;
  activeLibraryWarnings: PoolDiversityWarning[];
  activeLibraryRadar: PoolDiversityRadarItem[];
  roleOrder: string[];
  libraryReviewPrompt: string;
  libraryExportJson: string;
  cuisineDistribution: Record<string, number>;
  changedDishCount: number;
  roleLibraryCount: number;
  onDishSelect: (id: string | null) => void;
  onDishChange: (id: string, field: "dishName" | "cuisine" | "premadeLevel", value: string) => void;
  onDishReplace: (id: string, option: RoleDishOption) => void;
  onLibraryRoleChange: (role: string) => void;
  onLibraryAdd: (role: string) => void;
  onLibraryDelete: (role: string, libraryId: string) => void;
  onLibraryUpdate: (role: string, libraryId: string, field: "dishName" | "cuisine" | "premadeLevel", value: string) => void;
  onLibraryApply: (option: RoleDishOption) => void;
  onLibraryCopy: (value: string, target: CopyTarget) => void;
  onOpenGuestPreview: () => void;
  onOpenOutput: () => void;
  onResetMenu: () => void;
}

export function BanquetContent(props: BanquetContentProps) {
  const {
    dishes,
    libraryState,
    selectedDishId,
    activeLibraryRole,
    cuisineOptions,
    premadeOptions,
    copiedTarget,
    activeLibraryCount,
    activeLibraryWarnings,
    activeLibraryRadar,
    roleOrder,
    libraryReviewPrompt,
    libraryExportJson,
    cuisineDistribution,
    changedDishCount,
    roleLibraryCount,
    onDishSelect,
    onDishChange,
    onDishReplace,
    onLibraryRoleChange,
    onLibraryAdd,
    onLibraryDelete,
    onLibraryUpdate,
    onLibraryApply,
    onLibraryCopy,
    onOpenGuestPreview,
    onOpenOutput,
    onResetMenu,
  } = props;

  const [keyword, setKeyword] = useState("");
  const [cuisineFilter, setCuisineFilter] = useState("");
  const [premadeFilter, setPremadeFilter] = useState("");

  const filteredDishes = dishes.filter((dish) => {
    const matchKeyword =
      !keyword ||
      dish.dishName.includes(keyword) ||
      dish.role.includes(keyword) ||
      dish.cuisine.includes(keyword) ||
      dish.premadeLevel.includes(keyword);

    const matchCuisine = !cuisineFilter || dish.cuisine === cuisineFilter;
    const matchPremade = !premadeFilter || dish.premadeLevel === premadeFilter;

    return matchKeyword && matchCuisine && matchPremade;
  });

  const premadeReadyCount = getPremadeReadyCount(dishes);

  return (
    <div className="space-y-8">
      {/* 當前宴席輪廓 */}
      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">當前宴席輪廓</p>
            <button
              type="button"
              onClick={onResetMenu}
              className="btn-muted inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs transition"
            >
              <RefreshCcw className="h-3.5 w-3.5" />
              回復預設
            </button>
          </div>
          <div className="mt-4 space-y-3 text-sm text-[color:var(--muted)]">
            <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
              <span>菜單總道數</span>
              <span className="font-semibold text-[color:var(--foreground)]">{dishes.length} 道</span>
            </p>
            <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
              <span>已調整模組</span>
              <span className="font-semibold text-[color:var(--foreground)]">{changedDishCount} 道</span>
            </p>
            <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
              <span>可快速完成品項</span>
              <span className="font-semibold text-[color:var(--foreground)]">{premadeReadyCount} 道</span>
            </p>
            <p className="flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3">
              <span>目前菜庫候選</span>
              <span className="font-semibold text-[color:var(--foreground)]">{roleLibraryCount} 筆</span>
            </p>
          </div>
          <p className="mt-4 rounded-2xl border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/10 px-4 py-3 text-xs leading-6 text-[color:var(--foreground)]">
            本機自動保存已啟用；系統偵測到版本更新時，會自動清除舊快取並套用新版資料。
          </p>
        </div>

        {/* 宴席統計卡 */}
        <div className="grid gap-4 content-start">
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
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={onOpenGuestPreview}
              className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
            >
              預覽賓客版
            </button>
            <button
              type="button"
              onClick={onOpenOutput}
              className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
            >
              打開工作輸出
            </button>
          </div>
        </div>
      </div>

      {/* 搜尋與篩選 */}
      <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
            <input
              value={keyword}
              onChange={(event) => setKeyword(event.target.value)}
              placeholder="搜尋宴席地位、菜名、菜系"
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

      {/* 工作台說明 */}
      <div className="rounded-[30px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-6 text-center">
        <p className="text-sm text-[color:var(--muted)]">
          以宴席地位為骨架，先編排菜單，再管理菜庫。工作輸出與賓客版菜單收進獨立面板，需要時再打開。
        </p>
        <p className="mt-1 text-xs text-[color:var(--muted)]">
          賓客視角不會看到候選菜、預製度或工作輸出資訊
        </p>
      </div>

      {/* 菜色卡片 */}
      <div className="grid gap-4">
        {filteredDishes.map((dish) => (
          <DishCard
            key={dish.id}
            dish={dish}
            roleOptions={libraryState[dish.role] ?? []}
            isSelected={selectedDishId === dish.id}
            onSelect={onDishSelect}
            onChange={onDishChange}
            onReplace={onDishReplace}
          />
        ))}

        {!filteredDishes.length ? (
          <div className="rounded-[30px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-8 text-center text-sm leading-7 text-[color:var(--muted)]">
            沒有符合條件的菜色，請放寬搜尋關鍵字或切換篩選條件。
          </div>
        ) : null}
      </div>

      {/* 菜庫提示 */}
      <div className="rounded-[30px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-8 text-center">
        <p className="text-sm text-[color:var(--muted)]">
          當前選定的地位已有 {activeLibraryCount} 筆候選菜
        </p>
      </div>
    </div>
  );
}
