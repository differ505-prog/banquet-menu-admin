"use client";

import { useMemo, useState } from "react";
import { Anchor, Check, Clipboard, ShoppingBag, X } from "lucide-react";

import {
  DAXI_PROCESSING_FEE,
  daxiCategoryLabels,
  daxiGoldenList,
  daxiPrawnSpecial,
  daxiRedVsYan,
  daxiSkipList,
  daxiWeightTiers,
  type DaxiIngredient,
  type DaxiIngredientCategory,
} from "@/data/daxi-harbor-guide";
import type { CopyTarget } from "@/types/menu";

type DaxiHarborGuideModalProps = {
  goldenList: DaxiIngredient[];
  skipList: DaxiIngredient[];
  open: boolean;
  onClose: () => void;
  onCopy: (value: string, target: CopyTarget) => void;
  copiedTarget: CopyTarget | null;
};

type GuideTab = "golden" | "skip";

const formatPrice = (value: number) =>
  `$${value.toLocaleString("en-US")}/kg`;

const CopyBadge = ({ active }: { active: boolean }) =>
  active ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />;

export function DaxiHarborGuideModal({
  goldenList,
  skipList,
  open,
  onClose,
  onCopy,
  copiedTarget,
}: DaxiHarborGuideModalProps) {
  const [activeTab, setActiveTab] = useState<GuideTab>("golden");
  const [activeCategory, setActiveCategory] = useState<DaxiIngredientCategory>("fish");

  const visibleList = activeTab === "golden" ? goldenList : skipList;

  const categories = useMemo(() => {
    const present = new Set<DaxiIngredientCategory>();
    visibleList.forEach((item) => present.add(item.category));
    return Array.from(present);
  }, [visibleList]);

  const filteredList = visibleList.filter((item) => item.category === activeCategory);

  const buildGuideText = () =>
    [
      `大溪漁港代客料理黃金 CP 值全指南（代工費 $${DAXI_PROCESSING_FEE}/道）`,
      "",
      "【重量控制紅線】",
      ...daxiWeightTiers.map(
        (tier) => `${tier.label} ${tier.weight}（${tier.range}）：${tier.hint}`,
      ),
      "",
      "【黃金榜 — 推薦 8.0 以上】",
      ...goldenList.map(
        (item) =>
          `${item.name}（${daxiCategoryLabels[item.category]}）｜${formatPrice(item.pricePerKg.low)} ~ ${formatPrice(item.pricePerKg.high)}（行情 ${formatPrice(item.pricePerKg.market)}）｜${item.recommendedMethod}｜${item.valueNote}`,
      ),
      "",
      "【避坑/省錢榜 — 推薦 7.5 以下】",
      ...skipList.map(
        (item) =>
          `${item.name}（${daxiCategoryLabels[item.category]}）｜${formatPrice(item.pricePerKg.low)} ~ ${formatPrice(item.pricePerKg.high)}（行情 ${formatPrice(item.pricePerKg.market)}）｜${item.recommendedMethod}｜${item.valueNote}`,
      ),
      "",
      "【紅條 vs 燕尾紅條石斑辨識】",
      ...daxiRedVsYan.map(
        (entry) => `${entry.species}：${entry.identification} 口感：${entry.texture}`,
      ),
      "",
      "【明蝦特別解析】",
      `${daxiPrawnSpecial.name}：${daxiPrawnSpecial.valueCore} 最佳份量：${daxiPrawnSpecial.bestPortion ?? "-"}`,
      "",
      "【現場議價提醒】",
      "現場喊價若是「台斤」，請將價格乘以 1.6 才是公斤價。",
      "分袋策略：黃金榜現場吃，避坑榜（白帶、土魠）買回家。",
    ].join("\n");

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081018]/78 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(19,28,36,0.98),rgba(12,20,28,0.98))] shadow-[0_30px_120px_rgba(2,12,20,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              採購議價指南
            </p>
            <h2 className="serif-title mt-3 text-3xl text-[color:var(--foreground)]">
              大溪漁港代客料理黃金 CP 值全指南
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              以代工費 ${DAXI_PROCESSING_FEE}/道 為基準，整合價格上下限與食材類別，助你現場精準議價、挑最划算的代工食材。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-muted rounded-full p-2 transition"
            aria-label="關閉大溪漁港指南"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--line)] px-6 py-4">
          <button
            type="button"
            onClick={() => onCopy(buildGuideText(), "daxiGuide")}
            className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
          >
            <CopyBadge active={copiedTarget === "daxiGuide"} />
            {copiedTarget === "daxiGuide" ? "已複製指南" : "複製完整指南"}
          </button>

          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/10 px-4 py-2 text-xs text-[color:var(--foreground)]">
            <ShoppingBag className="h-4 w-4" />
            {goldenList.length} 道黃金榜 ・ {skipList.length} 道避坑榜
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <section>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              重量控制紅線（每袋食材建議）
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {daxiWeightTiers.map((tier) => (
                <div
                  key={tier.label}
                  className={`rounded-[20px] border p-4 ${
                    tier.label === "最佳"
                      ? "border-[color:var(--accent)]/40 bg-[color:var(--accent)]/10"
                      : "border-[color:var(--line)] bg-[color:var(--surface-soft)]"
                  }`}
                >
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                    {tier.label} {tier.range}
                  </p>
                  <p className="serif-title mt-2 text-2xl text-[color:var(--foreground)]">
                    {tier.weight}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-[color:var(--muted)]">
                    {tier.hint}
                  </p>
                </div>
              ))}
            </div>
          </section>

          <section className="mt-8">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  setActiveTab("golden");
                  const firstGolden = goldenList.find((item) => item.category === activeCategory);
                  if (!firstGolden) setActiveCategory("fish");
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeTab === "golden"
                    ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--foreground)]"
                    : "border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                }`}
              >
                黃金榜（推薦 8.0↑）
              </button>
              <button
                type="button"
                onClick={() => {
                  setActiveTab("skip");
                  const firstSkip = skipList.find((item) => item.category === activeCategory);
                  if (!firstSkip) setActiveCategory("fish");
                }}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  activeTab === "skip"
                    ? "border-[color:var(--accent-warm)] bg-[color:var(--accent-warm)]/15 text-[color:var(--foreground)]"
                    : "border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                }`}
              >
                避坑/省錢榜（7.5↓）
              </button>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-3 py-1.5 text-xs font-medium transition ${
                    activeCategory === category
                      ? "border-[color:var(--accent-cool)] bg-[color:var(--accent-cool)]/15 text-[color:var(--foreground)]"
                      : "border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                  }`}
                >
                  {daxiCategoryLabels[category]}
                </button>
              ))}
            </div>

            <div className="mt-5 overflow-x-auto rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)]">
              <table className="w-full min-w-[640px] text-left">
                <thead className="border-b border-[color:var(--line)] text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                  <tr>
                    <th className="px-4 py-3">食材名稱</th>
                    <th className="px-4 py-3">偏便宜(下限)</th>
                    <th className="px-4 py-3">行情參考</th>
                    <th className="px-4 py-3">偏貴(上限)</th>
                    <th className="px-4 py-3">建議吃法</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredList.map((item) => (
                    <tr
                      key={`${activeTab}-${item.name}`}
                      className="border-b border-[color:var(--line)]/60 last:border-0"
                    >
                      <td className="px-4 py-3 text-sm font-medium text-[color:var(--foreground)]">
                        <p>{item.name}</p>
                        <p className="mt-1 text-xs leading-6 text-[color:var(--muted)]">
                          {item.valueNote}
                        </p>
                      </td>
                      <td className="px-4 py-3 text-sm text-[color:var(--muted)]">
                        {formatPrice(item.pricePerKg.low)}
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-[color:var(--foreground)]">
                        {formatPrice(item.pricePerKg.market)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[color:var(--muted)]">
                        {formatPrice(item.pricePerKg.high)}
                      </td>
                      <td className="px-4 py-3 text-sm text-[color:var(--foreground)]">
                        {item.recommendedMethod}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <article className="rounded-[24px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top,rgba(140,168,189,0.12),transparent_28%),rgba(255,255,255,0.03)] p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                紅條 vs 燕尾紅條石斑辨識
              </p>
              <div className="mt-4 space-y-4">
                {daxiRedVsYan.map((entry) => (
                  <div
                    key={entry.species}
                    className="rounded-[18px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                  >
                    <h3 className="text-sm font-semibold text-[color:var(--foreground)]">
                      {entry.species}
                    </h3>
                    <p className="mt-2 text-xs leading-6 text-[color:var(--muted)]">
                      <span className="font-medium text-[color:var(--accent-soft)]">辨識：</span>
                      {entry.identification}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-[color:var(--muted)]">
                      <span className="font-medium text-[color:var(--accent-soft)]">口感：</span>
                      {entry.texture}
                    </p>
                  </div>
                ))}
                <p className="text-xs leading-6 text-[color:var(--muted)]">
                  注意：燕尾紅條與長尾鳥（濱鯛）不同，長尾鳥是笛鯛類，身形較修長且無斑點。
                </p>
                <p className="text-xs leading-6 text-[color:var(--foreground)]">
                  這兩者在大溪都是頂級清蒸魚。代客料理的 ${DAXI_PROCESSING_FEE} 元保險主要買師傅對「石斑魚皮」與「肉質含水量」的精確控制。
                </p>
              </div>
            </article>

            <article className="rounded-[24px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top,rgba(212,188,176,0.12),transparent_28%),rgba(255,255,255,0.03)] p-5">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                明蝦 (Kuruma Prawn) 特別解析
              </p>
              <h3 className="serif-title mt-3 text-2xl text-[color:var(--foreground)]">
                {daxiPrawnSpecial.name}
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                {daxiPrawnSpecial.valueCore}
              </p>
              <div className="mt-4 rounded-[16px] border border-[color:var(--accent-warm)]/25 bg-[color:var(--accent-warm)]/8 px-3 py-2">
                <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent-warm)]">
                  最佳份量
                </p>
                <p className="mt-1 text-sm text-[color:var(--foreground)]">
                  {daxiPrawnSpecial.bestPortion}
                </p>
              </div>
              <div className="mt-5 rounded-[18px] border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/8 px-4 py-3">
                <div className="flex items-start gap-3">
                  <Anchor className="mt-0.5 h-4 w-4 text-[color:var(--accent)]" />
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
                      現場議價提醒
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--foreground)]">
                      現場喊價若是「台斤」，請將價格 <span className="font-medium">乘以 1.6</span>
                      才是表格中的公斤價。
                    </p>
                    <p className="mt-2 text-sm leading-7 text-[color:var(--foreground)]">
                      分袋策略：黃金榜現場吃，避坑榜（白帶、土魠）買回家。
                    </p>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </div>
  );
}
