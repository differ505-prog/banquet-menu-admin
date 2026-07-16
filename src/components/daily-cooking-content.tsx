"use client";

import { useState } from "react";
import { Heart, ChevronDown } from "lucide-react";

import {
  healthCookingSections,
  type HealthCookingSection,
  type HealthCookingEntry,
} from "@/data/health-cooking";

function EntryCard({ entry }: { entry: HealthCookingEntry }) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface)] p-4 transition-all">
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
        </div>

        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="shrink-0 rounded-full border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-2.5 py-1 text-[10px] text-[color:var(--muted)] transition-colors hover:border-[color:var(--accent)] hover:text-[color:var(--accent)]"
        >
          {isExpanded ? "收起" : "展開"}
        </button>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 border-t border-[color:var(--line)] pt-4">
          {entry.goldenRatio && (
            <p className="rounded-xl border border-[color:var(--line)] bg-[color:var(--surface-strong)] px-3 py-2 text-xs leading-6 text-[color:var(--accent)]">
              {entry.goldenRatio}
            </p>
          )}
          {entry.healthNote && (
            <p className="text-xs leading-6 text-[color:var(--muted)]">
              {entry.healthNote}
            </p>
          )}
          {entry.steps && (
            <div className="space-y-2">
              {entry.steps.split("\n").map((step, i) => (
                <div key={i} className="flex gap-2.5">
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--accent)]" />
                  <p className="text-xs leading-6 text-[color:var(--muted)]">{step}</p>
                </div>
              ))}
            </div>
          )}
          {entry.troubleshooting && (
            <div className="rounded-xl border border-[color:var(--accent-warm)]/20 bg-[color:var(--accent-warm)]/8 p-3">
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

      {/* Category Sections */}
      <div className="space-y-5">
        {healthCookingSections.map((section) => (
          <CategorySection key={section.key} section={section} />
        ))}
      </div>
    </div>
  );
}
