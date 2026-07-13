"use client";

import { useState } from "react";
import { Check, Clipboard, GraduationCap, X } from "lucide-react";

import type {
  CulinarySkillLevel,
  CulinarySkillRecommendation,
  CulinaryTechniqueCategory,
  CulinaryTechniqueSection,
} from "@/data/culinary-techniques";
import type { CopyTarget } from "@/types/menu";

type CulinaryGuideModalProps = {
  sections: CulinaryTechniqueSection[];
  skillRecommendations: CulinarySkillRecommendation[];
  open: boolean;
  onClose: () => void;
  onCopy: (value: string, target: CopyTarget) => void;
  copiedTarget: CopyTarget | null;
};

const CopyBadge = ({ active }: { active: boolean }) =>
  active ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />;

const skillLevelColors: Record<CulinarySkillLevel, { border: string; bg: string; text: string }> = {
  entry: {
    border: "border-[color:var(--accent)]/30",
    bg: "bg-[color:var(--accent)]/10",
    text: "text-[color:var(--accent-strong)]",
  },
  intermediate: {
    border: "border-[color:var(--accent-warm)]/30",
    bg: "bg-[color:var(--accent-warm)]/10",
    text: "text-[color:var(--accent-strong)]",
  },
  master: {
    border: "border-[color:var(--accent-cool)]/30",
    bg: "bg-[color:var(--accent-cool)]/10",
    text: "text-[color:var(--accent-strong)]",
  },
};

const skillLevelLabels: Record<CulinarySkillLevel, string> = {
  entry: "入門級",
  intermediate: "進階級",
  master: "大師級",
};

const categoryColors: Record<CulinaryTechniqueCategory, string> = {
  protein: "accent",
  soup: "accent-warm",
  "non-meat-protein": "accent-cool",
  fiber: "accent",
  "all-in-one": "accent-warm",
};

export function CulinaryGuideModal({
  sections,
  skillRecommendations,
  open,
  onClose,
  onCopy,
  copiedTarget,
}: CulinaryGuideModalProps) {
  const [activeCategory, setActiveCategory] = useState<CulinaryTechniqueCategory>(
    sections[0]?.key ?? "protein",
  );
  const [activeSkillLevel, setActiveSkillLevel] = useState<CulinarySkillLevel>("entry");

  const activeSection = sections.find((s) => s.key === activeCategory);
  const activeSkill = skillRecommendations.find((s) => s.level === activeSkillLevel);

  const buildCulinaryGuideText = () =>
    [
      "正統料理技術指南",
      ...sections.map(
        (section) =>
          [
            `${section.label} — ${section.coreTech}`,
            ...section.entries.map(
              (entry) =>
                [
                  `【${entry.label}】${entry.cuisine}`,
                  entry.goldenRatio ? `黃金比例：${entry.goldenRatio}` : null,
                  entry.coreTechnique,
                  entry.steps ?? null,
                  entry.troubleshooting
                    ? [
                        `排錯：${entry.troubleshooting.problem}`,
                        `解法：${entry.troubleshooting.solution}`,
                      ].join("\n")
                    : null,
                ]
                  .filter(Boolean)
                  .join("\n"),
            ),
          ].join("\n\n"),
      ),
      "",
      "廚藝等級建議",
      ...skillRecommendations.map(
        (rec) =>
          `${skillLevelLabels[rec.level]}：${rec.dishes.join("、")}`,
      ),
    ].join("\n\n");

  const buildSkillText = () =>
    [
      `廚藝等級建議`,
      ...skillRecommendations.map(
        (rec) =>
          `${skillLevelLabels[rec.level]}（${rec.dishes.length} 道）：${rec.dishes.join("、")}`,
      ),
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
              職人技術修煉手冊
            </p>
            <h2 className="serif-title mt-3 text-3xl text-[color:var(--foreground)]">
              健康正統料理技術指南
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              精選全球正統名菜的職人比例與操作步驟，練習刀工、火候、乳化與溫控等經典技術。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-muted rounded-full p-2 transition"
            aria-label="關閉技術指南"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--line)] px-6 py-4">
          <button
            type="button"
            onClick={() => onCopy(buildCulinaryGuideText(), "culinaryGuide")}
            className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
          >
            <CopyBadge active={copiedTarget === "culinaryGuide"} />
            {copiedTarget === "culinaryGuide" ? "已複製技術指南" : "複製技術指南"}
          </button>
          <button
            type="button"
            onClick={() => onCopy(buildSkillText(), "culinarySkill")}
            className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition"
          >
            <CopyBadge active={copiedTarget === "culinarySkill"} />
            {copiedTarget === "culinarySkill" ? "已複製等級建議" : "複製等級建議"}
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/10 px-4 py-2 text-xs text-[color:var(--foreground)]">
            <GraduationCap className="h-4 w-4" />
            {sections.length} 大類 {sections.reduce((acc, s) => acc + s.entries.length, 0)} 道經典技術
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <div className="grid gap-8 lg:grid-cols-[1fr_280px]">
            <div>
              <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                技術分類
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {sections.map((section) => {
                  const active = section.key === activeCategory;
                  const color = categoryColors[section.key];

                  return (
                    <button
                      key={section.key}
                      type="button"
                      onClick={() => setActiveCategory(section.key)}
                      className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                        active
                          ? `border-[color:var(--${color})] bg-[color:var(--${color})]/15 text-[color:var(--foreground)]`
                          : "border-[color:var(--line)] bg-[color:var(--surface-soft)] text-[color:var(--muted)] hover:text-[color:var(--foreground)]"
                      }`}
                    >
                      {section.label}
                    </button>
                  );
                })}
              </div>

              {activeSection ? (
                <article className="mt-6 rounded-[28px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top,rgba(170,151,126,0.12),transparent_26%),rgba(255,255,255,0.03)] p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                        核心技術
                      </p>
                      <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">
                        {activeSection.coreTech}
                      </p>
                    </div>
                    <span className="rounded-full border border-[color:var(--accent)]/25 bg-[color:var(--accent)]/10 px-3 py-1 text-xs text-[color:var(--accent-strong)]">
                      {activeSection.entries.length} 道
                    </span>
                  </div>

                  <div className="mt-5 space-y-4">
                    {activeSection.entries.map((entry) => (
                      <div
                        key={`${activeSection.key}-${entry.label}`}
                        className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-base font-semibold text-[color:var(--foreground)]">
                              {entry.label}
                            </h3>
                            <p className="mt-1 text-xs text-[color:var(--accent-soft)]">
                              {entry.cuisine}
                            </p>
                          </div>
                          {entry.score ? (
                            <span className="rounded-full border border-[color:var(--accent-strong)]/30 bg-[color:var(--accent-strong)]/10 px-3 py-1 text-xs font-medium text-[color:var(--accent-strong)]">
                              {entry.score}/10
                            </span>
                          ) : null}
                        </div>

                        {entry.goldenRatio ? (
                          <div className="mt-3 rounded-[16px] border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-3 py-2">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent)]">
                              黃金比例
                            </p>
                            <p className="mt-1 text-sm text-[color:var(--foreground)]">
                              {entry.goldenRatio}
                            </p>
                          </div>
                        ) : null}

                        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                          {entry.coreTechnique}
                        </p>

                        {entry.steps ? (
                          <div className="mt-3 rounded-[16px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-3">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                              職人操作步驟
                            </p>
                            <div className="mt-2 space-y-1">
                              {entry.steps.split("\n").map((step, i) => (
                                <p key={i} className="text-sm leading-7 text-[color:var(--muted)]">
                                  {step}
                                </p>
                              ))}
                            </div>
                          </div>
                        ) : null}

                        {entry.troubleshooting ? (
                          <div className="mt-3 rounded-[16px] border border-[color:var(--accent-warm)]/25 bg-[color:var(--accent-warm)]/8 px-3 py-3">
                            <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent-warm)]">
                              排錯指南
                            </p>
                            <p className="mt-2 text-sm font-medium text-[color:var(--foreground)]">
                              {entry.troubleshooting.problem}
                            </p>
                            <p className="mt-1 text-sm leading-7 text-[color:var(--muted)]">
                              {entry.troubleshooting.solution}
                            </p>
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>
                </article>
              ) : null}
            </div>

            <aside className="space-y-4">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                廚藝等級建議
              </p>
              <div className="space-y-2">
                {skillRecommendations.map((rec) => {
                  const colors = skillLevelColors[rec.level];
                  const active = rec.level === activeSkillLevel;

                  return (
                    <button
                      key={rec.level}
                      type="button"
                      onClick={() => setActiveSkillLevel(rec.level)}
                      className={`w-full rounded-[20px] border p-4 text-left transition ${
                        active ? `${colors.border} ${colors.bg}` : "border-[color:var(--line)] bg-[color:var(--surface-soft)]"
                      }`}
                    >
                      <p className={`text-xs font-medium ${active ? colors.text : "text-[color:var(--muted)]"}`}>
                        {skillLevelLabels[rec.level]}
                      </p>
                      <p className={`mt-1 text-sm font-medium ${active ? "text-[color:var(--foreground)]" : "text-[color:var(--muted)]"}`}>
                        {rec.dishes.length} 道精選
                      </p>
                    </button>
                  );
                })}
              </div>

              {activeSkill ? (
                <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4">
                  <p className="text-[10px] uppercase tracking-[0.24em] text-[color:var(--accent-soft)]">
                    精選菜單
                  </p>
                  <div className="mt-3 space-y-2">
                    {activeSkill.dishes.map((dish, i) => (
                      <p key={i} className="text-sm leading-7 text-[color:var(--foreground)]">
                        {dish}
                      </p>
                    ))}
                  </div>
                  <p className="mt-3 text-xs leading-6 text-[color:var(--muted)]">
                    {activeSkill.level === "entry"
                      ? "練習比例掌握與基礎熟度控制"
                      : activeSkill.level === "intermediate"
                        ? "練習乳化原理與蛋白質打漿"
                        : "挑戰極致的味覺與技術平衡"}
                  </p>
                </div>
              ) : null}
            </aside>
          </div>
        </div>
      </div>
    </div>
  );
}
