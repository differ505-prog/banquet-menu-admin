"use client";

import { useState } from "react";
import { Heart, BookOpen, ChevronDown, Check } from "lucide-react";

import {
  healthCookingSections,
  healthCookingDifficultyLevels,
  type HealthCookingDifficulty,
  type HealthCookingSection,
  type HealthCookingEntry,
} from "@/data/health-cooking";

const difficultyColors: Record<HealthCookingDifficulty, string> = {
  entry: "text-[color:var(--accent)]",
  intermediate: "text-[color:var(--accent-warm)]",
  master: "text-[color:var(--accent-cool)]",
};

const difficultyBgColors: Record<HealthCookingDifficulty, string> = {
  entry: "bg-[color:var(--accent)]/10 border-[color:var(--accent)]/25",
  intermediate: "bg-[color:var(--accent-warm)]/10 border-[color:var(--accent-warm)]/25",
  master: "bg-[color:var(--accent-cool)]/10 border-[color:var(--accent-cool)]/25",
};

function getDifficulty(entry: HealthCookingEntry): HealthCookingDifficulty {
  const entryLabel = entry.label;
  for (const level of healthCookingDifficultyLevels) {
    if (level.dishes.some((d) => entryLabel.includes(d) || d.includes(entryLabel))) {
      return level.level;
    }
  }
  return "entry";
}

function EntryCard({ entry }: { entry: HealthCookingEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const difficulty = getDifficulty(entry);

  return (
    <div
      className={`rounded-2xl border p-4 transition-all ${difficultyBgColors[difficulty]}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-sm font-medium text-[color:var(--foreground)]">
              {entry.label}
            </h4>
            <span className="rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-2 py-0.5 text-[10px] text-[color:var(--muted)]">
              {entry.cuisine}
            </span>
          </div>
          <p className="mt-1.5 text-xs leading-6 text-[color:var(--muted)]">
            {entry.coreTechnique}
          </p>
          {entry.goldenRatio && (
            <p className="mt-1.5 rounded-xl border border-[color:var(--line)] bg-[color:var(--surface)] px-3 py-1.5 text-xs text-[color:var(--accent)]">
              {entry.goldenRatio}
            </p>
          )}
          {entry.healthNote && (
            <p className="mt-1.5 text-xs leading-5 text-[color:var(--muted)]">
              {entry.healthNote}
            </p>
          )}
        </div>
        <span className={`shrink-0 rounded-full border px-2.5 py-1 text-[10px] font-medium ${difficultyBgColors[difficulty]} ${difficultyColors[difficulty]}`}>
          {healthCookingDifficultyLevels.find((l) => l.level === difficulty)?.label}
        </span>
      </div>

      {entry.steps && (
        <>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="mt-3 flex items-center gap-1.5 text-[11px] text-[color:var(--muted)] transition-colors hover:text-[color:var(--foreground)]"
          >
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform ${isExpanded ? "rotate-180" : ""}`}
            />
            {isExpanded ? "收起步驟" : "展開職人步驟"}
          </button>
          {isExpanded && (
            <div className="mt-3 space-y-2">
              {entry.steps.split("\n").map((step, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  <p className="text-xs leading-6 text-[color:var(--muted)]">{step}</p>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {entry.troubleshooting && (
        <div className="mt-3 rounded-xl border border-[color:var(--accent-warm)]/20 bg-[color:var(--accent-warm)]/8 p-3">
          <p className="text-[10px] uppercase tracking-wider text-[color:var(--accent-warm)]">
            Troubleshooting
          </p>
          <p className="mt-1 text-xs font-medium text-[color:var(--foreground)]">
            {entry.troubleshooting.problem}
          </p>
          <p className="mt-1 text-xs leading-5 text-[color:var(--muted)]">
            {entry.troubleshooting.solution}
          </p>
        </div>
      )}
    </div>
  );
}

function CategorySection({ section }: { section: HealthCookingSection }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 backdrop-blur-xl">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex w-full items-start justify-between gap-4 text-left"
      >
        <div className="flex items-center gap-3">
          <span className="text-2xl">{section.emoji}</span>
          <div>
            <h3 className="text-lg font-medium text-[color:var(--foreground)]">
              {section.label}
            </h3>
            <p className="mt-0.5 text-xs text-[color:var(--muted)]">
              {section.coreTech}
            </p>
          </div>
        </div>
        <ChevronDown
          className={`mt-1 h-4 w-4 shrink-0 text-[color:var(--muted)] transition-transform ${isExpanded ? "rotate-180" : ""}`}
        />
      </button>

      {isExpanded && (
        <>
          <p className="mt-3 text-xs leading-6 text-[color:var(--muted)] italic">
            {section.principle}
          </p>
          <div className="mt-5 space-y-3">
            {section.entries.map((entry, index) => (
              <EntryCard key={index} entry={entry} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export function DailyCookingContent() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent)]/30 bg-[color:var(--accent)]/10 px-4 py-2 text-xs uppercase tracking-[0.32em] text-[color:var(--accent-strong)]">
          <Heart className="h-4 w-4" />
          健康自煮
        </div>
        <h2 className="serif-title mt-4 text-3xl font-semibold tracking-tight text-[color:var(--foreground)]">
          精準調味，職人比例
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-[color:var(--muted)]">
          正統性・健康度・廚藝價值。每一道都是經典技術的練習教材，拒絕替代品，只給你真正值得做的菜。
        </p>
      </div>

      {/* Difficulty Levels Summary */}
      <div className="grid gap-3 sm:grid-cols-3">
        {healthCookingDifficultyLevels.map((level) => (
          <div
            key={level.level}
            className={`rounded-2xl border p-4 ${difficultyBgColors[level.level]}`}
          >
            <p className={`text-[10px] uppercase tracking-wider ${difficultyColors[level.level]}`}>
              {level.label}
            </p>
            <p className="mt-1 text-sm font-medium text-[color:var(--foreground)]">
              {level.dishes.join(" · ")}
            </p>
          </div>
        ))}
      </div>

      {/* Category Sections */}
      <div className="space-y-5">
        {healthCookingSections.map((section) => (
          <CategorySection key={section.key} section={section} />
        ))}
      </div>
    </div>
  );
}
