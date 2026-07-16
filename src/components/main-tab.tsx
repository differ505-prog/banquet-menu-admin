"use client";

import { UtensilsCrossed, Heart, BookOpen } from "lucide-react";
import type { MainTabKey } from "@/types/menu";

interface MainTabProps {
  activeTab: MainTabKey;
  onTabChange: (tab: MainTabKey) => void;
}

const tabs: { key: MainTabKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "banquet",
    label: "待客宴",
    icon: <UtensilsCrossed className="h-4 w-4" aria-hidden="true" />,
  },
  {
    key: "daily",
    label: "健康自煮",
    icon: <Heart className="h-4 w-4" aria-hidden="true" />,
  },
  {
    key: "knowledge",
    label: "技法與備料",
    icon: <BookOpen className="h-4 w-4" aria-hidden="true" />,
  },
];

export function MainTab({ activeTab, onTabChange }: MainTabProps) {
  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-1.5 backdrop-blur-xl">
      <div className="flex gap-1.5" role="tablist" aria-label="功能模組切換">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.key;

          return (
            <button
              key={tab.key}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-controls={`panel-${tab.key}`}
              onClick={() => onTabChange(tab.key)}
              className={`
                relative flex flex-1 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-medium transition-all
                ${
                  isActive
                    ? "bg-[color:var(--surface-strong)] text-[color:var(--foreground)] shadow-[0_8px_24px_rgba(3,12,20,0.28)]"
                    : "text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                }
              `}
            >
              {tab.icon}
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
