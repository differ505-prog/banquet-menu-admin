"use client";

import type { CuisineType } from "@/types/menu";

interface CuisineSubTabProps {
  activeCuisine: CuisineType;
  onCuisineChange: (cuisine: CuisineType) => void;
}

const cuisines: { key: CuisineType; label: string }[] = [
  { key: "chinese", label: "中式" },
  { key: "japanese", label: "日式" },
  { key: "korean", label: "韓式" },
  { key: "western", label: "西式" },
];

export function CuisineSubTab({ activeCuisine, onCuisineChange }: CuisineSubTabProps) {
  return (
    <div
      className="flex flex-wrap gap-2"
      role="tablist"
      aria-label="菜系分類"
    >
      {cuisines.map((cuisine) => {
        const isActive = activeCuisine === cuisine.key;

        return (
          <button
            key={cuisine.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            aria-controls={`cuisine-panel-${cuisine.key}`}
            onClick={() => onCuisineChange(cuisine.key)}
            className={`
              rounded-full border px-4 py-1.5 text-xs font-medium tracking-wide transition-all
              ${
                isActive
                  ? "border-[color:var(--accent)]/50 bg-[color:var(--accent)]/20 text-[color:var(--accent-strong)]"
                  : "border-[color:var(--line)] text-[color:var(--muted)] hover:border-[color:var(--accent)]/30 hover:text-[color:var(--accent)]"
              }
            `}
          >
            {cuisine.label}
          </button>
        );
      })}
    </div>
  );
}
