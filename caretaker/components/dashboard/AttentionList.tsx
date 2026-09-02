"use client";

import type { AttentionItem } from "@/lib/dashboard/types";
import { useI18n } from "@/lib/i18n/store";

export function AttentionList({ items }: { items: AttentionItem[] }) {
  const { t } = useI18n();

  if (items.length === 0) {
    return (
      <div className="flex items-center gap-3 rounded-2xl p-3" style={{ backgroundColor: "var(--surface-warm)" }}>
        <i className="fa-solid fa-check-circle text-[20px] text-secondary" aria-hidden="true" />
        <span className="text-[15px] font-medium text-foreground">{t("dashboard.noAttention")}</span>
      </div>
    );
  }

  return (
    <ul className="flex flex-col gap-3">
      {items.map((item) => {
        const warning = item.tone === "warning";
        return (
          <li
            key={item.id}
            className="flex items-center gap-3 rounded-2xl p-3"
            style={{ backgroundColor: "var(--surface-warm)" }}
          >
            <i
              className={`${item.icon} text-[18px]`}
              style={{ color: warning ? "var(--accent-sun)" : "var(--secondary)" }}
              aria-hidden="true"
            />
            <span className="flex-1 text-[15px] font-medium text-foreground">{t(item.message)}</span>
            <button
              type="button"
              className="flex h-10 items-center gap-2 rounded-xl border border-border bg-surface px-3 text-[14px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none"
            >
              {t(item.actionLabel)}
            </button>
          </li>
        );
      })}
    </ul>
  );
}