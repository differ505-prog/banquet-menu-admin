"use client";

import { Check, Clipboard, FileJson2, Plus, ScrollText, Sparkles, Trash2 } from "lucide-react";

import type { CopyTarget, RoleDishLibrary, RoleDishOption } from "@/types/menu";

type LibraryManagerProps = {
  roles: string[];
  activeRole: string;
  library: RoleDishLibrary;
  copiedTarget: CopyTarget | null;
  onRoleChange: (role: string) => void;
  onAdd: (role: string) => void;
  onDelete: (role: string, libraryId: string) => void;
  onUpdate: (
    role: string,
    libraryId: string,
    field: "dishName" | "cuisine" | "premadeLevel",
    value: string,
  ) => void;
  onApply: (option: RoleDishOption) => void;
  onCopy: (value: string, target: "libraryPrompt" | "libraryJson") => void;
  libraryReviewPrompt: string;
  libraryExportJson: string;
};

const CopyBadge = ({ active }: { active: boolean }) =>
  active ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />;

export function LibraryManager({
  roles,
  activeRole,
  library,
  copiedTarget,
  onRoleChange,
  onAdd,
  onDelete,
  onUpdate,
  onApply,
  onCopy,
  libraryReviewPrompt,
  libraryExportJson,
}: LibraryManagerProps) {
  const options = library[activeRole] ?? [];

  return (
    <section className="rounded-[32px] border border-[color:var(--line)] bg-[color:var(--surface)] p-6 backdrop-blur-xl">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
            菜庫管理器
          </p>
          <h2 className="mt-3 text-2xl font-semibold tracking-tight text-[color:var(--foreground)]">
            直接維護每個宴席地位的候選菜
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-[color:var(--muted)]">
            你可以依地位新增、刪除、修改候選菜。修改後，卡片下拉選單會立即反映新的菜庫內容。
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <p className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--muted)]">
            常用操作
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={() => onCopy(libraryReviewPrompt, "libraryPrompt")}
              className="btn-primary-warm inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition"
            >
              <CopyBadge active={copiedTarget === "libraryPrompt"} />
              {copiedTarget === "libraryPrompt" ? "已複製覆核指令" : "複製菜庫覆核指令"}
            </button>

            <button
              type="button"
              onClick={() => onCopy(libraryExportJson, "libraryJson")}
              className="btn-primary-cool inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition"
            >
              <FileJson2 className="h-4 w-4" />
              {copiedTarget === "libraryJson" ? "已複製菜庫 JSON" : "複製菜庫 JSON"}
            </button>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <select
              value={activeRole}
              onChange={(event) => onRoleChange(event.target.value)}
              className="rounded-2xl border border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
            >
              {roles.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => onAdd(activeRole)}
              className="btn-primary-warm inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-medium transition"
            >
              <Plus className="h-4 w-4" />
              新增候選菜
            </button>
          </div>
        </div>
      </div>

      <div className="mt-6 rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface-soft)] p-5">
        <p className="flex items-center gap-2 text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
          <Sparkles className="h-4 w-4" />
          菜庫覆核用途
        </p>
        <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
          點 `複製菜庫覆核指令` 可直接貼給 LLM，請它把「菜庫內容修改建議」與「未來覆核提示詞優化建議」分開輸出，最後各自整理成可直接貼回 IDE 的兩段提示詞。
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {options.map((option, index) => (
          <article
            key={option.libraryId}
            className="rounded-[28px] border border-[color:var(--line)] bg-[color:var(--surface-strong)] p-5"
          >
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                  候選 {index + 1}
                </p>
                <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
                  套用後會更新同地位卡片的菜名、菜系與預製度，但不改變宴席角色本身。
                </p>
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => onApply(option)}
                  className="btn-primary-cool rounded-full px-4 py-2 text-xs font-medium transition"
                >
                  套用到目前菜單
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(activeRole, option.libraryId)}
                  className="inline-flex items-center gap-2 rounded-full border border-rose-200/20 bg-rose-300/10 px-4 py-2 text-xs font-medium text-rose-100 transition hover:bg-rose-300/15"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  刪除
                </button>
              </div>
            </div>

            <div className="mt-5 grid gap-4 md:grid-cols-3">
              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
                  菜色名稱
                </span>
                <input
                  value={option.dishName}
                  onChange={(event) =>
                    onUpdate(activeRole, option.libraryId, "dishName", event.target.value)
                  }
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
                  菜系
                </span>
                <input
                  value={option.cuisine}
                  onChange={(event) =>
                    onUpdate(activeRole, option.libraryId, "cuisine", event.target.value)
                  }
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
                />
              </label>

              <label className="space-y-2">
                <span className="text-[11px] uppercase tracking-[0.28em] text-[color:var(--accent-soft)]">
                  預製度
                </span>
                <input
                  value={option.premadeLevel}
                  onChange={(event) =>
                    onUpdate(activeRole, option.libraryId, "premadeLevel", event.target.value)
                  }
                  className="w-full rounded-2xl border border-[color:var(--line)] bg-[color:var(--surface-soft)] px-4 py-3 text-sm text-[color:var(--foreground)] outline-none transition focus:border-[color:var(--accent)]"
                />
              </label>
            </div>
          </article>
        ))}

        {!options.length ? (
          <div className="rounded-[28px] border border-dashed border-[color:var(--line-strong)] bg-[color:var(--surface-soft)] p-8 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-[color:var(--muted)]">
              <ScrollText className="h-4 w-4" />
              這個地位目前沒有候選菜，請先新增一筆。
            </p>
          </div>
        ) : null}
      </div>
    </section>
  );
}
