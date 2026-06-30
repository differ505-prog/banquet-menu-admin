"use client";

import { useEffect, useMemo, useState } from "react";
import { Check, Clipboard, CookingPot, Snowflake, X } from "lucide-react";

import type { CookingGuide, CopyTarget, ThawGuide } from "@/types/menu";
import { buildCookingGuideSectionText } from "@/utils/menu";

type ThawGuideModalProps = {
  guides: ThawGuide[];
  cookingGuides: CookingGuide[];
  open: boolean;
  onClose: () => void;
  onCopy: (value: string, target: "thawGuide" | "cookingGuide") => void;
  copiedTarget: CopyTarget | null;
  guideText: string;
  cookingGuideText: string;
  cookingSummary: string;
};

const CopyBadge = ({ active }: { active: boolean }) =>
  active ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />;

export function ThawGuideModal({
  guides,
  cookingGuides,
  open,
  onClose,
  onCopy,
  copiedTarget,
  guideText,
  cookingGuideText,
  cookingSummary,
}: ThawGuideModalProps) {
  const preferredCookingGuideKey =
    cookingGuides.find((guide) => guide.key === "air-fryer")?.key ?? cookingGuides[0]?.key ?? "fry";
  const [activeCookingGuideKey, setActiveCookingGuideKey] =
    useState<CookingGuide["key"]>(preferredCookingGuideKey);
  const activeCookingGuide =
    cookingGuides.find((guide) => guide.key === activeCookingGuideKey) ?? cookingGuides[0] ?? null;
  const activeCookingGuideText = useMemo(
    () =>
      activeCookingGuide ? buildCookingGuideSectionText(activeCookingGuide.key) : cookingGuideText,
    [activeCookingGuide, cookingGuideText],
  );

  useEffect(() => {
    if (!cookingGuides.some((guide) => guide.key === activeCookingGuideKey)) {
      setActiveCookingGuideKey(preferredCookingGuideKey);
    }
  }, [activeCookingGuideKey, cookingGuides, preferredCookingGuideKey]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081018]/78 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[32px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(19,28,36,0.98),rgba(12,20,28,0.98))] shadow-[0_30px_120px_rgba(2,12,20,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              廚房戰情室秘笈
            </p>
            <h2 className="serif-title mt-3 text-3xl text-[color:var(--foreground)]">
              退冰節奏與烹調指南一次收齊
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              我把魚蝦肉退冰判斷，以及油炸、清蒸、氣炸烤箱等烹調指南集中成一份工作秘笈，方便你開席前快速排兵布陣。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-muted rounded-full p-2 transition"
            aria-label="關閉退冰指南"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--line)] px-6 py-4">
          <button
            type="button"
            onClick={() => onCopy(guideText, "thawGuide")}
            className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
          >
            <CopyBadge active={copiedTarget === "thawGuide"} />
            {copiedTarget === "thawGuide" ? "已複製退冰指南" : "複製退冰指南"}
          </button>
          <button
            type="button"
            onClick={() => onCopy(activeCookingGuideText, "cookingGuide")}
            className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
          >
            <CopyBadge active={copiedTarget === "cookingGuide"} />
            {copiedTarget === "cookingGuide" ? "已複製目前指南" : "複製目前指南"}
          </button>
          <button
            type="button"
            onClick={() => onCopy(cookingGuideText, "cookingGuide")}
            className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
          >
            <CopyBadge active={false} />
            複製完整烹調指南
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-cool)]/25 bg-[color:var(--accent-cool)]/10 px-4 py-2 text-xs text-[color:var(--foreground)]">
            <Snowflake className="h-4 w-4" />
            內含 3% 鹽冰水、流水解凍與冷藏慢退的適用時機
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/10 px-4 py-2 text-xs text-[color:var(--foreground)]">
            <CookingPot className="h-4 w-4" />
            {cookingSummary}
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              退冰判斷
            </p>
            <div className="mt-4 grid gap-4 lg:grid-cols-3">
            {guides.map((guide) => (
              <article
                key={guide.key}
                className="rounded-[28px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top,rgba(140,168,189,0.12),transparent_26%),rgba(255,255,255,0.03)] p-5"
              >
                <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                  {guide.label}
                </p>
                <div className="mt-4 rounded-[22px] border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--accent-strong)]">
                    最佳方案
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
                    {guide.best.title}
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--accent-strong)]">
                    {guide.best.score}/10
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                    {guide.best.method}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">
                    {guide.best.reason}
                  </p>
                </div>

                <div className="mt-4 rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
                    次佳方案
                  </p>
                  <h3 className="mt-2 text-lg font-semibold text-[color:var(--foreground)]">
                    {guide.secondBest.title}
                  </h3>
                  <p className="mt-1 text-sm text-[color:var(--accent-soft)]">
                    {guide.secondBest.score}/10
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                    {guide.secondBest.method}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">
                    {guide.secondBest.reason}
                  </p>
                </div>

                <p className="mt-4 rounded-[20px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-4 py-3 text-sm leading-7 text-[color:var(--muted)]">
                  {guide.reminder}
                </p>
              </article>
            ))}
            </div>
          </div>

          <div className="mt-8">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              烹調指南
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {cookingGuides.map((guide) => {
                const active = guide.key === activeCookingGuideKey;

                return (
                  <button
                    key={guide.key}
                    type="button"
                    onClick={() => setActiveCookingGuideKey(guide.key)}
                    className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                      active
                        ? "border-[color:var(--accent)] bg-[color:var(--accent)]/15 text-[color:var(--foreground)]"
                        : "border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                    }`}
                  >
                    {guide.label}
                  </button>
                );
              })}
            </div>
            {activeCookingGuide ? (
              <article className="mt-4 rounded-[28px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top,rgba(170,151,126,0.12),transparent_26%),rgba(255,255,255,0.03)] p-5">
                <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                  <CookingPot className="h-4 w-4" />
                  {activeCookingGuide.label}
                </p>
                <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                  {activeCookingGuide.summary}
                </p>
                <div className="mt-4 space-y-3">
                  {activeCookingGuide.entries.map((entry) => (
                    <div
                      key={`${activeCookingGuide.key}-${entry.label}`}
                      className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <h3 className="text-base font-semibold text-[color:var(--foreground)]">
                          {entry.label}
                        </h3>
                        <span className="text-sm text-[color:var(--accent-strong)]">
                          {entry.score}/10
                        </span>
                      </div>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--foreground)]">
                        火候：{entry.temperature}
                      </p>
                      <p className="mt-1 text-sm leading-7 text-[color:var(--foreground)]">
                        時間：{entry.duration}
                      </p>
                      <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                        {entry.note}
                      </p>
                    </div>
                  ))}
                </div>
              </article>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
