"use client";

import { Check, Clipboard, Eye, X } from "lucide-react";

import type { CopyTarget, MenuDish } from "@/types/menu";
import { getGuestCourseLabel } from "@/utils/menu";

type GuestPreviewProps = {
  dishes: MenuDish[];
  open: boolean;
  onClose: () => void;
  onCopy: (value: string, target: "guestMenu") => void;
  copiedTarget: CopyTarget | null;
  guestMenuText: string;
};

const CopyBadge = ({ active }: { active: boolean }) =>
  active ? <Check className="h-4 w-4" /> : <Clipboard className="h-4 w-4" />;

export function GuestPreview({
  dishes,
  open,
  onClose,
  onCopy,
  copiedTarget,
  guestMenuText,
}: GuestPreviewProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#081018]/78 p-4 backdrop-blur-sm">
      <div className="relative flex max-h-[92vh] w-full max-w-4xl flex-col overflow-hidden rounded-[32px] border border-[color:var(--line)] bg-[linear-gradient(180deg,rgba(19,28,36,0.98),rgba(12,20,28,0.98))] shadow-[0_30px_120px_rgba(2,12,20,0.45)]">
        <div className="flex items-start justify-between gap-4 border-b border-[color:var(--line)] px-6 py-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
              賓客版預覽
            </p>
            <h2 className="serif-title mt-3 text-3xl text-[color:var(--foreground)]">
              對外分享的私宴菜單
            </h2>
            <p className="mt-2 text-sm leading-7 text-[color:var(--muted)]">
              已隱藏候選菜、預製度、工作輸出等後台資訊，只保留適合對外呈現的菜單內容。
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="btn-muted rounded-full p-2 transition"
            aria-label="關閉賓客版預覽"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 border-b border-[color:var(--line)] px-6 py-4">
          <button
            type="button"
            onClick={() => onCopy(guestMenuText, "guestMenu")}
            className="btn-primary-warm inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm transition"
          >
            <CopyBadge active={copiedTarget === "guestMenu"} />
            {copiedTarget === "guestMenu" ? "已複製賓客版菜單" : "複製賓客版菜單"}
          </button>
          <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--accent-cool)]/25 bg-[color:var(--accent-cool)]/10 px-4 py-2 text-xs text-[color:var(--foreground)]">
            <Eye className="h-4 w-4" />
            可直接複製給親友、賓客或作為邀請頁文案底稿
          </div>
        </div>

        <div className="overflow-y-auto px-6 py-6">
          <div className="rounded-[32px] border border-[color:var(--line)] bg-[radial-gradient(circle_at_top,rgba(212,188,176,0.12),transparent_32%),rgba(244,239,232,0.04)] p-8">
            <div className="text-center">
              <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                私宴菜單
              </p>
              <h3 className="serif-title mt-4 text-4xl text-[color:var(--foreground)]">
                今晚的款待
              </h3>
              <p className="mt-3 text-sm leading-7 text-[color:var(--muted)]">
                以清雅節奏鋪陳冷盤、主菜、湯品與甜品，保留宴席層次與收束感。
              </p>
            </div>

            <div className="mt-8 grid gap-4 md:grid-cols-2">
              {dishes.map((dish, index) => (
                <article
                  key={dish.id}
                  className="rounded-[24px] border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] p-5"
                >
                  <p className="text-[11px] uppercase tracking-[0.32em] text-[color:var(--accent-soft)]">
                    {String(index + 1).padStart(2, "0")} · {getGuestCourseLabel(dish.role)}
                  </p>
                  <h4 className="mt-3 text-xl font-semibold tracking-tight text-[color:var(--foreground)]">
                    {dish.dishName}
                  </h4>
                  <p className="mt-2 text-sm text-[color:var(--muted)]">{dish.cuisine}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
