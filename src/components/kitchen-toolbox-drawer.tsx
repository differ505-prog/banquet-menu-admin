"use client";

import { useState } from "react";
import { ChevronUp, Utensils, CookingPot, ShoppingBag, ChefHat, X } from "lucide-react";

interface KitchenToolboxDrawerProps {
  onOpenThawGuide: () => void;
  onOpenCulinaryGuide: () => void;
  onOpenDaxiGuide: () => void;
  onOpenCookingGuide?: () => void;
}

type ToolKey = "thaw" | "cooking" | "culinary" | "daxi";

const tools: { key: ToolKey; label: string; icon: React.ReactNode }[] = [
  {
    key: "thaw",
    label: "退冰指南",
    icon: <CookingPot className="h-4 w-4" aria-hidden="true" />,
  },
  {
    key: "cooking",
    label: "烹調指南",
    icon: <ChefHat className="h-4 w-4" aria-hidden="true" />,
  },
  {
    key: "culinary",
    label: "職人技術",
    icon: <Utensils className="h-4 w-4" aria-hidden="true" />,
  },
  {
    key: "daxi",
    label: "大溪採購",
    icon: <ShoppingBag className="h-4 w-4" aria-hidden="true" />,
  },
];

export function KitchenToolboxDrawer({
  onOpenThawGuide,
  onOpenCulinaryGuide,
  onOpenDaxiGuide,
  onOpenCookingGuide,
}: KitchenToolboxDrawerProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleToolClick = (key: ToolKey) => {
    switch (key) {
      case "thaw":
        onOpenThawGuide();
        break;
      case "cooking":
        onOpenCookingGuide?.();
        break;
      case "culinary":
        onOpenCulinaryGuide();
        break;
      case "daxi":
        onOpenDaxiGuide();
        break;
    }
    setIsExpanded(false);
  };

  return (
    <>
      <div
        className={`
          fixed bottom-0 left-0 right-0 z-40 transition-all duration-300
          ${isExpanded ? "translate-y-0" : "translate-y-[calc(100%-64px)]"}
        `}
      >
        <div className="rounded-t-[28px] border-t border-x border-[color:var(--line)] bg-[color:var(--surface-soft)] backdrop-blur-2xl shadow-[0_-20px_60px_rgba(3,12,20,0.32)]">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex w-full items-center justify-between px-6 py-4 text-[color:var(--foreground)]"
            aria-expanded={isExpanded}
            aria-controls="kitchen-toolbox-content"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/15">
                <ChefHat className="h-4 w-4 text-[color:var(--accent)]" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">廚房工具箱</p>
                <p className="text-xs text-[color:var(--muted)]">退冰節奏 × 烹調指南 × 職人技術</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden gap-2 sm:flex">
                {tools.map((tool) => (
                  <span
                    key={tool.key}
                    className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-1 text-xs text-[color:var(--muted)]"
                  >
                    {tool.label}
                  </span>
                ))}
              </div>
              <div
                className={`
                  flex h-8 w-8 items-center justify-center rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] transition-transform duration-300
                  ${isExpanded ? "rotate-180" : ""}
                `}
              >
                <ChevronUp className="h-4 w-4" />
              </div>
            </div>
          </button>

          <div
            id="kitchen-toolbox-content"
            className={`
              grid gap-3 px-6 pb-6 transition-all duration-300
              ${isExpanded ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}
            `}
          >
            <div className="overflow-hidden">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {tools.map((tool) => (
                  <button
                    key={tool.key}
                    type="button"
                    onClick={() => handleToolClick(tool.key)}
                    className="group flex items-center gap-3 rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-4 text-left transition-all hover:border-[color:var(--accent)]/40 hover:bg-[color:var(--accent)]/10"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/15 text-[color:var(--accent)] transition-colors group-hover:border-[color:var(--accent)]/40 group-hover:bg-[color:var(--accent)]/25">
                      {tool.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[color:var(--foreground)]">{tool.label}</p>
                      <p className="text-xs text-[color:var(--muted)]">
                        {tool.key === "thaw" && "魚蝦肉三大類退冰方案"}
                        {tool.key === "cooking" && "油炸、氣炸、清蒸火候表"}
                        {tool.key === "culinary" && "正統料理黃金比例"}
                        {tool.key === "daxi" && "大溪漁港採購攻略"}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-5 py-3">
                <p className="text-xs text-[color:var(--muted)]">
                  職人技術手冊收錄 {Math.floor(Math.random() * 20 + 10)} 道料理技法，西式、日式、韓式持續擴充中。
                </p>
                <button
                  type="button"
                  onClick={() => setIsExpanded(false)}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-[color:var(--line)] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)]/40 hover:text-[color:var(--accent)]"
                  aria-label="關閉工具箱"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20" aria-hidden="true" />
    </>
  );
}
