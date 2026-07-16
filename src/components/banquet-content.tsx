"use client";

import { Ban, Search } from "lucide-react";
import { DishCard } from "@/components/dish-card";
import type {
  MenuDish,
  RoleDishOption,
  RoleDishLibrary,
  CopyTarget,
  PoolDiversityWarning,
  PoolDiversityRadarItem,
} from "@/types/menu";

interface BanquetContentProps {
  dishes: MenuDish[];
  libraryState: RoleDishLibrary;
  cuisineFilter: string;
  premadeFilter: string;
  keyword: string;
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
  onDishSelect: (id: string | null) => void;
  onDishChange: (id: string, field: "dishName" | "cuisine" | "premadeLevel", value: string) => void;
  onDishReplace: (id: string, option: RoleDishOption) => void;
  onCuisineFilterChange: (value: string) => void;
  onPremadeFilterChange: (value: string) => void;
  onKeywordChange: (value: string) => void;
  onClearFilters: () => void;
  onLibraryRoleChange: (role: string) => void;
  onLibraryAdd: (role: string) => void;
  onLibraryDelete: (role: string, libraryId: string) => void;
  onLibraryUpdate: (role: string, libraryId: string, field: "dishName" | "cuisine" | "premadeLevel", value: string) => void;
  onLibraryApply: (option: RoleDishOption) => void;
  onLibraryCopy: (value: string, target: CopyTarget) => void;
  onOpenGuestPreview: () => void;
  onOpenOutput: () => void;
}

export function BanquetContent(props: BanquetContentProps) {
  const {
    dishes,
    libraryState,
    cuisineFilter,
    premadeFilter,
    keyword,
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
    onDishSelect,
    onDishChange,
    onDishReplace,
    onCuisineFilterChange,
    onPremadeFilterChange,
    onKeywordChange,
    onClearFilters,
    onLibraryRoleChange,
    onLibraryAdd,
    onLibraryDelete,
    onLibraryUpdate,
    onLibraryApply,
    onLibraryCopy,
    onOpenGuestPreview,
    onOpenOutput,
  } = props;

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

  return (
    <div className="space-y-6">
      <div className="rounded-[30px] border border-[color:var(--line)] bg-[color:var(--surface)] p-5 backdrop-blur-xl">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr_0.8fr_auto]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted)]" />
            <input
              value={keyword}
              onChange={(event) => onKeywordChange(event.target.value)}
              placeholder="搜尋宴席地位、菜名、菜系或預製度"
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] py-3 pr-4 pl-11 text-sm text-[color:var(--foreground)] outline-none transition placeholder:text-[color:var(--muted)] focus:border-[color:var(--accent)]"
            />
          </label>

          <select
            value={cuisineFilter}
            onChange={(event) => onCuisineFilterChange(event.target.value)}
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
            onChange={(event) => onPremadeFilterChange(event.target.value)}
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
            onClick={onClearFilters}
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
              onClick={onOpenGuestPreview}
              className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition"
            >
              查看賓客版
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

      <div className="rounded-[30px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-8 text-center">
        <p className="text-sm text-[color:var(--muted)]">
          當前選定的地位已有 {activeLibraryCount} 筆候選菜
        </p>
      </div>
    </div>
  );
}
