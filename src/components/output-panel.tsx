"use client";

import { Check, Clipboard, CookingPot, FileJson2, FileSearch, Snowflake, Sparkles, X } from "lucide-react";

import type { CopyTarget } from "@/types/menu";

type OutputPanelProps = {
  summary: string;
  thawSummary: string;
  cookingSummary: string;
  thawReminderText: string;
  thawGuideText: string;
  cookingReminderText: string;
  cookingGuideText: string;
  prompt: string;
  exportJson: string;
  copiedTarget: CopyTarget | null;
  onCopy: (
    value: string,
    target: "prompt" | "json" | "thawGuide" | "thawReminder" | "cookingGuide" | "cookingReminder",
  ) => void;
  open: boolean;
  onClose: () => void;
};

const CopyBadge = ({ active }: { active: boolean }) =>
  active ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />;

export function OutputPanel({
  summary,
  thawSummary,
  cookingSummary,
  thawReminderText,
  thawGuideText,
  cookingReminderText,
  cookingGuideText,
  prompt,
  exportJson,
  copiedTarget,
  onCopy,
  open,
  onClose,
}: OutputPanelProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-[#081018]/70 backdrop-blur-sm">
      <aside className="flex h-full w-full max-w-2xl flex-col border-l border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(15,24,33,0.98),rgba(10,17,25,0.96))] p-6 shadow-[-30px_0_100px_rgba(3,12,20,0.45)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              工作輸出
            </p>
            <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
              評估指令與資料匯出
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              收納給 LLM 與備份使用的工作內容，平常不佔據主畫面空間。
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="btn-muted rounded-full p-2 transition"
            aria-label="關閉工作輸出"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 md:col-span-1">
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              宴席摘要
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">{summary}</p>
          </div>

          <div className="rounded-[22px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-4 md:col-span-2">
            <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              <Sparkles className="h-4 w-4" />
              建議用途
            </p>
            <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
              需要請模型評分、備份當前菜單、或交叉比對菜色邏輯時，再打開這個抽屜即可。
            </p>
            <p className="mt-4 rounded-[18px] border border-[color:var(--accent-cool)]/20 bg-[color:var(--accent-cool)]/8 px-4 py-3 text-sm leading-7 text-[color:var(--foreground)]">
              {thawSummary}
            </p>
            <p className="mt-3 rounded-[18px] border border-[color:var(--accent)]/20 bg-[color:var(--accent)]/8 px-4 py-3 text-sm leading-7 text-[color:var(--foreground)]">
              {cookingSummary}
            </p>
          </div>
        </div>

        <div className="mt-5 flex-1 overflow-y-auto pr-1">
          <div className="rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                <Snowflake className="h-4 w-4" />
                廚房退冰提醒
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onCopy(thawReminderText, "thawReminder")}
                  className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition"
                >
                  <CopyBadge active={copiedTarget === "thawReminder"} />
                  {copiedTarget === "thawReminder" ? "已複製提醒" : "複製提醒"}
                </button>
                <button
                  type="button"
                  onClick={() => onCopy(thawGuideText, "thawGuide")}
                  className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition"
                >
                  <CopyBadge active={copiedTarget === "thawGuide"} />
                  {copiedTarget === "thawGuide" ? "已複製指南" : "複製退冰指南"}
                </button>
              </div>
            </div>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[20px] border border-[color:var(--line)] bg-[#0b1218] p-4 text-xs leading-6 text-[#d7d8d9]">
              {thawReminderText}
            </pre>
          </div>

          <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                <CookingPot className="h-4 w-4" />
                廚房烹調提醒
              </p>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onCopy(cookingReminderText, "cookingReminder")}
                  className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition"
                >
                  <CopyBadge active={copiedTarget === "cookingReminder"} />
                  {copiedTarget === "cookingReminder" ? "已複製提醒" : "複製烹調提醒"}
                </button>
                <button
                  type="button"
                  onClick={() => onCopy(cookingGuideText, "cookingGuide")}
                  className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition"
                >
                  <CopyBadge active={copiedTarget === "cookingGuide"} />
                  {copiedTarget === "cookingGuide" ? "已複製火候表" : "複製油炸/清蒸火候表"}
                </button>
              </div>
            </div>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[20px] border border-[color:var(--line)] bg-[#0b1218] p-4 text-xs leading-6 text-[#d7d8d9]">
              {cookingReminderText}
            </pre>
          </div>

          <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                <FileSearch className="h-4 w-4" />
                評估指令
              </p>
              <button
                type="button"
                onClick={() => onCopy(prompt, "prompt")}
                className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition"
              >
                <CopyBadge active={copiedTarget === "prompt"} />
                {copiedTarget === "prompt" ? "已複製" : "複製指令"}
              </button>
            </div>
            <pre className="mt-4 overflow-x-auto whitespace-pre-wrap rounded-[20px] border border-[color:var(--line)] bg-[#0b1218] p-4 text-xs leading-6 text-[#d7d8d9]">
              {prompt}
            </pre>
          </div>

          <div className="mt-5 rounded-[24px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
            <div className="flex items-center justify-between gap-4">
              <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                <FileJson2 className="h-4 w-4" />
                匯出 JSON
              </p>
              <button
                type="button"
                onClick={() => onCopy(exportJson, "json")}
                className="btn-primary-cool inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition"
              >
                <CopyBadge active={copiedTarget === "json"} />
                {copiedTarget === "json" ? "已複製" : "複製 JSON"}
              </button>
            </div>
            <pre className="mt-4 max-h-[24rem] overflow-auto rounded-[20px] border border-[color:var(--line)] bg-[#0b1218] p-4 text-xs leading-6 text-[#d7d8d9]">
              {exportJson}
            </pre>
          </div>
        </div>
      </aside>
    </div>
  );
}
