"use client";

import { BookOpen, CookingPot, Flame, ShoppingBag, Utensils, Check, Clipboard } from "lucide-react";

import { getThawGuides, getCookingGuides, buildCookingGuideText, buildThawGuideText } from "@/utils/menu";
import {
  culinaryTechniques,
  culinarySkillRecommendations,
} from "@/data/culinary-techniques";
import {
  DAXI_PROCESSING_FEE,
  daxiCategoryLabels,
  daxiGoldenList,
  daxiSkipList,
  daxiWeightTiers,
} from "@/data/daxi-harbor-guide";
import type { CopyTarget } from "@/types/menu";

const CopyBadge = ({ active }: { active: boolean }) =>
  active ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />;

interface KnowledgeToolsContentProps {
  copiedTarget: CopyTarget | null;
  onCopy: (value: string, target: CopyTarget) => void;
  onOpenThawGuide: () => void;
  onOpenCulinaryGuide: () => void;
  onOpenSeafoodGuide: () => void;
}

const toolCards = [
  {
    key: "thaw",
    label: "退冰節奏",
    icon: <CookingPot className="h-5 w-5" aria-hidden="true" />,
    description: "魚蝦肉三大類退冰方案評分，室溫、冷藏、冷水、流水四種情境完整比較。",
    hint: "最適合你的退冰方式：",
  },
  {
    key: "cooking",
    label: "烹調火候表",
    icon: <Flame className="h-5 w-5" aria-hidden="true" />,
    description: "油炸、氣炸、清蒸三大烹調方式的溫度與時間參考，輕鬆掌握黃金熟度。",
    hint: "火候關鍵在於：",
  },
  {
    key: "culinary",
    label: "職人技術",
    icon: <Utensils className="h-5 w-5" aria-hidden="true" />,
    description: "正統料理黃金比例與操作步驟，從手打魚丸到法式澄清雞湯，職人秘笈完整收錄。",
    hint: "推薦技術等級：",
  },
  {
    key: "seafood",
    label: "海鮮採購指南",
    icon: <ShoppingBag className="h-5 w-5" aria-hidden="true" />,
    description: "代客料理黃金 CP 值指南，重量控制紅線與議價技巧，現場精準挑最划算的食材。",
    hint: "重量紅線：",
  },
];

export function KnowledgeToolsContent({
  copiedTarget,
  onCopy,
  onOpenThawGuide,
  onOpenCulinaryGuide,
  onOpenSeafoodGuide,
}: KnowledgeToolsContentProps) {  const thawGuides = getThawGuides();
  const cookingGuides = getCookingGuides();
  const thawGuideText = buildThawGuideText();
  const cookingGuideText = buildCookingGuideText();

  const thawReminderText = "";
  const cookingReminderText = "";

  const handleCopyThawGuide = () => {
    onCopy(thawGuideText, "thawGuide");
  };

  const handleCopyCookingGuide = () => {
    onCopy(cookingGuideText, "cookingGuide");
  };

  const handleCopyCulinaryGuide = () => {
    const text = [
      "職人技術手冊",
      "",
      ...culinaryTechniques.map((section) =>
        [
          `【${section.label}】核心技法：${section.coreTech}`,
          ...section.entries.map(
            (entry) =>
              `- ${entry.label}（${entry.cuisine}）${entry.goldenRatio ? `黃金比例：${entry.goldenRatio}` : ""} 核心：${entry.coreTechnique} ${entry.steps ? `\n  步驟：${entry.steps.replace(/\n/g, "\n  ")}` : ""}`,
          ),
        ].join("\n"),
      ),
      "",
      "技能推薦：",
      ...culinarySkillRecommendations.map(
        (rec) => `${rec.label}：${rec.dishes.join("、")}`,
      ),
    ].join("\n");
    onCopy(text, "culinaryGuide");
  };

  const handleCopySeafoodGuide = () => {
    const text = [
      `海鮮採購黃金 CP 值全指南（代工費 $${DAXI_PROCESSING_FEE}/道）`,
      "",
      "【重量控制紅線】",
      ...daxiWeightTiers.map(
        (tier) =>
          `${tier.label} ${tier.weight}（${tier.range}）：${tier.hint}`,
      ),
      "",
      "【黃金榜 — 推薦】",
      ...daxiGoldenList.map(
        (item) =>
          `${item.name}（${daxiCategoryLabels[item.category]}）｜$${item.pricePerKg.low.toLocaleString()} ~ $${item.pricePerKg.high.toLocaleString()}/kg（行情 $${item.pricePerKg.market.toLocaleString()}）｜${item.recommendedMethod}`,
      ),
      "",
      "【避坑/省錢榜】",
      ...daxiSkipList.map(
        (item) =>
          `${item.name}（${daxiCategoryLabels[item.category]}）｜$${item.pricePerKg.low.toLocaleString()} ~ $${item.pricePerKg.high.toLocaleString()}/kg（行情 $${item.pricePerKg.market.toLocaleString()}）｜${item.recommendedMethod}`,
      ),
      "",
      "【議價提醒】",
      "現場喊價若是「台斤」，請將價格乘以 1.6 才是公斤價。",
      "分袋策略：黃金榜現場吃，避坑榜買回家。",
    ].join("\n");
    onCopy(text, "daxiGuide");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[color:var(--accent-strong)]">
          <BookOpen className="h-4 w-4" />
          技法與備料
        </div>
        <h2 className="serif-title mt-4 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
          為任何烹飪前置什麼料、懂什麼技法
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
          退冰節奏、烹調火候、採購議價——在真正動手之前，這裡有你需要知道的一切。
        </p>
      </div>

      {/* Tool Cards Grid */}
      <div className="grid gap-6 lg:grid-cols-2">
        {toolCards.map((tool) => {
          let preview: React.ReactNode = null;

          if (tool.key === "thaw") {
            const best = thawGuides[0];
            preview = (
              <div className="mt-4 space-y-3">
                {thawGuides.map((guide) => (
                  <div
                    key={guide.key}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-3"
                  >
                    <div>
                      <p className="text-xs font-medium text-[color:var(--foreground)]">
                        {guide.label}
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">
                        {guide.shortLabel}：{guide.best.method}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[color:var(--accent)]/15 px-2.5 py-1 text-xs font-medium text-[color:var(--accent)]">
                      {guide.best.score}/10
                    </span>
                  </div>
                ))}
              </div>
            );
          }

          if (tool.key === "cooking") {
            preview = (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {cookingGuides.map((guide) => (
                  <div
                    key={guide.key}
                    className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-3 text-center"
                  >
                    <p className="text-xs font-medium text-[color:var(--foreground)]">
                      {guide.label}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">
                      {guide.summary}
                    </p>
                  </div>
                ))}
              </div>
            );
          }

          if (tool.key === "culinary") {
            preview = (
              <div className="mt-4 space-y-3">
                {culinarySkillRecommendations.map((rec) => (
                  <div
                    key={rec.level}
                    className="flex items-start justify-between gap-3 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-3"
                  >
                    <div>
                      <p className="text-xs font-medium text-[color:var(--foreground)]">
                        {rec.label}
                      </p>
                      <p className="mt-1 text-xs text-[color:var(--muted)]">
                        {rec.dishes.join("、")}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[color:var(--accent-warm)]/15 px-2.5 py-1 text-xs font-medium text-[color:var(--accent-warm)]">
                      {rec.dishes.length} 道
                    </span>
                  </div>
                ))}
              </div>
            );
          }

          if (tool.key === "seafood") {
            preview = (
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {daxiWeightTiers.map((tier) => (
                  <div
                    key={tier.label}
                    className={`rounded-xl border p-3 text-center ${
                      tier.label === "最佳"
                        ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10"
                        : "border-[color:var(--line)] bg-[color:var(--surface-strong)]"
                    }`}
                  >
                    <p className="text-[10px] uppercase tracking-wider text-[color:var(--accent-soft)]">
                      {tier.label}
                    </p>
                    <p className="serif-title mt-1 text-xl text-[color:var(--foreground)]">
                      {tier.weight}
                    </p>
                    <p className="mt-1 text-xs text-[color:var(--muted)]">
                      {tier.range}
                    </p>
                  </div>
                ))}
              </div>
            );
          }

          return (
            <div
              key={tool.key}
              className="group rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 backdrop-blur-xl transition-all hover:border-[color:var(--accent)]/30 hover:shadow-[0_12px_40px_rgba(3,12,20,0.24)]"
            >
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/15 text-[color:var(--accent)] transition-colors group-hover:border-[color:var(--accent)]/40 group-hover:bg-[color:var(--accent)]/25">
                  {tool.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-[color:var(--foreground)]">
                    {tool.label}
                  </h3>
                  <p className="mt-1.5 text-sm leading-6 text-[color:var(--muted)]">
                    {tool.description}
                  </p>
                </div>
              </div>

              {preview}

              <div className="mt-5 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (tool.key === "thaw") onOpenThawGuide();
                    if (tool.key === "culinary") onOpenCulinaryGuide();
                    if (tool.key === "seafood") onOpenSeafoodGuide();
                  }}
                  className="btn-accent inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
                >
                  開啟完整指南
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if (tool.key === "thaw") handleCopyThawGuide();
                    if (tool.key === "cooking") handleCopyCookingGuide();
                    if (tool.key === "culinary") handleCopyCulinaryGuide();
                    if (tool.key === "seafood") handleCopySeafoodGuide();
                  }}
                  className="btn-muted inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition"
                >
                  <CopyBadge active={copiedTarget === `${tool.key}Guide`} />
                  {copiedTarget === `${tool.key}Guide` ? "已複製" : "複製指南"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Culinary Technique Summary */}
      <section className="rounded-[24px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-8">
        <div className="text-center">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-medium text-[color:var(--foreground)]">
              職人技術涵蓋 {culinaryTechniques.length} 大類別，共{" "}
              {culinaryTechniques.reduce((acc, s) => acc + s.entries.length, 0)} 道料理技法
            </p>
            <p className="mt-2 text-xs leading-6 text-[color:var(--muted)]">
              從白切雞的蝦眼水浸熟技術，到法式澄清雞湯的蛋白質凝結美學，每一道技法都附黃金比例與操作步驟。
            </p>
          </div>
        </div>
      </section>

    </div>
  );
}
