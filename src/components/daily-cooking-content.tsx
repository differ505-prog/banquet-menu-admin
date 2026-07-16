"use client";

import { Heart, Sparkles, Leaf, Shield, Brain, Moon, UtensilsCrossed } from "lucide-react";
import type { CuisineType } from "@/types/menu";

interface DailyCookingContentProps {
  activeCuisine: CuisineType;
}

const dailyContent: Record<CuisineType, {
  title: string;
  description: string;
  categories: Array<{
    key: string;
    label: string;
    icon: React.ReactNode;
    items: string[];
  }>;
}> = {
  chinese: {
    title: "日養自煮 · 中式",
    description: "依體質、時節、功效分類的日常養生食譜，幫助你在家輕鬆實踐食療之道。",
    categories: [
      {
        key: "constitution",
        label: "依體質",
        icon: <Shield className="h-4 w-4" aria-hidden="true" />,
        items: ["氣虛體質", "血虛體質", "陰虛體質", "陽虛體質", "痰濕體質", "濕熱體質"],
      },
      {
        key: "season",
        label: "依時節",
        icon: <Leaf className="h-4 w-4" aria-hidden="true" />,
        items: ["春季養肝", "夏季清熱", "秋季潤燥", "冬季溫補"],
      },
      {
        key: "efficacy",
        label: "依功效",
        icon: <Heart className="h-4 w-4" aria-hidden="true" />,
        items: ["護眼明目", "補鐵活血", "健脾養胃", "潤肺止咳", "安神助眠", "增強免疫"],
      },
    ],
  },
  japanese: {
    title: "日養自煮 · 日式",
    description: "融合和食智慧與現代營養學的日式家常料理，以天然發酵與鮮味萃取為核心。",
    categories: [
      {
        key: "miso",
        label: "味噌系列",
        icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
        items: ["味噌湯底黃金比例", "豆乳味噌鍋", "味噌銀鱈西京燒"],
      },
      {
        key: "dashi",
        label: "出汁系列",
        icon: <Leaf className="h-4 w-4" aria-hidden="true" />,
        items: ["昆布柴魚高湯", "日式茶碗蒸", "親子丼"],
      },
      {
        key: "pickle",
        label: "醃漬發酵",
        icon: <Shield className="h-4 w-4" aria-hidden="true" />,
        items: ["米糠醬菜", "淺漬小黃瓜", "自製鹽麴"],
      },
    ],
  },
  korean: {
    title: "日養自煮 · 韓式",
    description: "韓式發酵智慧與藥食同源的傳統飲食文化，日常餐桌上的元氣來源。",
    categories: [
      {
        key: "ferment",
        label: "發酵系列",
        icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
        items: ["辛奇（泡菜）", "大醬湯底", "辣椒醬料理"],
      },
      {
        key: "herbs",
        label: "藥食同源",
        icon: <Heart className="h-4 w-4" aria-hidden="true" />,
        items: ["人參雞湯", "蔘雞湯", "艾草煎餅"],
      },
      {
        key: "bbq",
        label: "烤肉家常",
        icon: <Shield className="h-4 w-4" aria-hidden="true" />,
        items: ["醬醃五花肉", "烤牛肉", "部隊鍋"],
      },
    ],
  },
  western: {
    title: "日養自煮 · 西式",
    description: "地中海飲食精神與法式料理技法，打造健康與優雅兼具的日常餐桌。",
    categories: [
      {
        key: "mediterranean",
        label: "地中海飲食",
        icon: <Leaf className="h-4 w-4" aria-hidden="true" />,
        items: ["橄欖油料理", "新鮮沙拉", "香草烤魚"],
      },
      {
        key: "french",
        label: "法式家常",
        icon: <Sparkles className="h-4 w-4" aria-hidden="true" />,
        items: ["洋蔥湯", "紅酒燉牛肉", "普羅旺斯燉菜"],
      },
      {
        key: "comfort",
        label: "療癒 comfort food",
        icon: <Moon className="h-4 w-4" aria-hidden="true" />,
        items: ["奶油白醬義大利麵", "焗烤馬鈴薯", "法式吐司"],
      },
    ],
  },
};

export function DailyCookingContent({ activeCuisine }: DailyCookingContentProps) {
  const content = dailyContent[activeCuisine];

  return (
    <div className="space-y-8">
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[color:var(--accent-strong)]">
          <Heart className="h-4 w-4" />
          日養自煮
        </div>
        <h2 className="serif-title mt-4 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
          {content.title}
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
          {content.description}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {content.categories.map((category) => (
          <div
            key={category.key}
            className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 backdrop-blur-xl"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/15 text-[color:var(--accent)]">
                {category.icon}
              </div>
              <h3 className="text-lg font-medium text-[color:var(--foreground)]">
                {category.label}
              </h3>
            </div>
            <ul className="mt-4 space-y-2">
              {category.items.map((item, index) => (
                <li
                  key={index}
                  className="flex items-center gap-2 text-sm text-[color:var(--muted)]"
                >
                  <span className="h-1 w-1 rounded-full bg-[color:var(--accent)]" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="rounded-[24px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-8 text-center">
        <div className="mx-auto max-w-md">
          <Brain className="mx-auto h-10 w-10 text-[color:var(--muted)]" aria-hidden="true" />
          <p className="mt-4 text-sm font-medium text-[color:var(--foreground)]">
            內容持續擴充中
          </p>
          <p className="mt-2 text-xs leading-6 text-[color:var(--muted)]">
            {activeCuisine === "chinese" && "中式養生內容最為豐富，依四季輪替、二十四節氣提供相應食譜推薦。"}
            {activeCuisine === "japanese" && "和食系列結合出汁、發酵與旬味概念，以天然鮮味打造健康餐桌。"}
            {activeCuisine === "korean" && "韓式藥食同源傳統，持續收錄宮廷料理與家常版本的養生食譜。"}
            {activeCuisine === "western" && "地中海飲食金字塔為核心，收錄各國經典家常料理的健康版本。"}
          </p>
        </div>
      </div>
    </div>
  );
}
