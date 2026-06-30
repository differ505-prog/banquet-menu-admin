"use client";

import { BookCopy, ChevronRight, CookingPot, Drumstick, ScrollText } from "lucide-react";

import type { MenuDish, RoleDishOption } from "@/types/menu";
import { getMatchingLibraryOption } from "@/utils/menu";

type DishCardProps = {
  dish: MenuDish;
  roleOptions: RoleDishOption[];
  isSelected: boolean;
  onSelect: (id: string) => void;
  onChange: (
    id: string,
    field: "dishName" | "cuisine" | "premadeLevel",
    value: string,
  ) => void;
  onReplace: (id: string, option: RoleDishOption) => void;
};

export function DishCard({
  dish,
  roleOptions,
  isSelected,
  onSelect,
  onChange,
  onReplace,
}: DishCardProps) {
  const matchedOption = getMatchingLibraryOption(dish, roleOptions);

  return (
    <article
      className={`rounded-[30px] border p-5 transition duration-300 ${
        isSelected
          ? "border-[color:var(--accent)]/60 bg-[linear-gradient(180deg,rgba(156,184,172,0.18),rgba(17,27,37,0.9))] shadow-[0_24px_80px_rgba(4,12,20,0.42)]"
          : "border-[color:var(--line)] bg-[color:var(--surface)] hover:border-[color:var(--accent-cool)]/40 hover:bg-[color:var(--surface-soft)]"
      }`}
    >
      <button
        type="button"
        onClick={() => onSelect(dish.id)}
        className="flex w-full items-start justify-between gap-4 text-left"
        aria-expanded={isSelected}
      >
        <div>
          <p className="text-[11px] uppercase tracking-[0.3em] text-[color:var(--accent-soft)]">
            模組 {dish.id}
          </p>
          <h3 className="mt-3 text-lg font-semibold tracking-tight text-[color:var(--foreground)]">
            {dish.role}
          </h3>
          <p className="mt-2 text-sm text-[color:var(--muted)]">{dish.dishName}</p>
        </div>
        <span
          className={`mt-1 inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
            isSelected
              ? "border-[color:var(--accent)]/50 bg-[color:var(--accent)]/18 text-[color:var(--foreground)]"
              : "border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--muted)]"
          }`}
        >
          <ChevronRight className={`h-4 w-4 transition ${isSelected ? "rotate-90" : ""}`} />
        </span>
      </button>

      <div className="mt-5 flex flex-wrap gap-2 text-xs text-[color:var(--foreground)]">
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-1.5">
          <Drumstick className="h-3.5 w-3.5" />
          {dish.cuisine}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-1.5">
          <CookingPot className="h-3.5 w-3.5" />
          {dish.premadeLevel}
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-1.5">
          <BookCopy className="h-3.5 w-3.5" />
          候選 {roleOptions.length} 款
        </span>
        <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-3 py-1.5">
          {matchedOption ? "儲存庫版本" : "自訂版本"}
        </span>
      </div>

      {isSelected ? (
        <div className="mt-5 grid gap-4 border-t border-[color:var(--line)] pt-5 md:grid-cols-3">
          <label className="space-y-2 md:col-span-3">
            <span className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
              <BookCopy className="h-3.5 w-3.5" />
              同地位菜色儲存庫
            </span>
            <select
              value={matchedOption?.libraryId ?? ""}
              onChange={(event) => {
                const nextOption = roleOptions.find(
                  (option) => option.libraryId === event.target.value,
                );

                if (nextOption) {
                  onReplace(dish.id, nextOption);
                }
              }}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
            >
              {!matchedOption ? <option value="">目前是自訂內容</option> : null}
              {roleOptions.map((option) => (
                <option key={option.libraryId} value={option.libraryId}>
                  {option.dishName}｜{option.cuisine}｜{option.premadeLevel}
                </option>
              ))}
            </select>
            <p className="text-xs leading-6 text-[color:var(--muted)]">
              這裡只列出「{dish.role}」可用的候選菜，切換時會保留宴席地位，只整組替換菜色內容。
            </p>
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
              菜色名稱
            </span>
            <input
              value={dish.dishName}
              onChange={(event) => onChange(dish.id, "dishName", event.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
              菜系
            </span>
            <input
              value={dish.cuisine}
              onChange={(event) => onChange(dish.id, "cuisine", event.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
            />
          </label>

          <label className="space-y-2">
            <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
              預製度
            </span>
            <input
              value={dish.premadeLevel}
              onChange={(event) => onChange(dish.id, "premadeLevel", event.target.value)}
              className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
            />
          </label>

          <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 md:col-span-3">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
              <ScrollText className="h-3.5 w-3.5" />
              宴席定位說明
            </p>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              保留「{dish.role}」這個宴席位置不動，只替換菜色模組內容，能維持整體上菜節奏與角色分工。
            </p>
          </div>
        </div>
      ) : null}
    </article>
  );
}
