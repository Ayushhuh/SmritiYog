"use client";

import type { ActivityRow } from "@/lib/dashboard/types";
import { useI18n } from "@/lib/i18n/store";

export function RecentActivity({ items }: { items: ActivityRow[] }) {
  const { t } = useI18n();

  return (
    <ul className="flex flex-col">
      {items.map((item) => {
        const result =
          item.resultScore ?? (item.result ? t(item.result) : undefined);
        const time = item.time ? `${t(item.timeLabel)} ${item.time}` : t(item.timeLabel);
        return (
          <li
            key={item.id}
            className="flex items-center gap-4 border-b border-border py-3.5 last:border-0 last:pb-0"
          >
            <span
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--surface-warm)", color: "var(--secondary)" }}
              aria-hidden="true"
            >
              <i className={`${item.icon} text-[16px]`} />
            </span>
            <div className="flex min-w-0 flex-1 flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="text-[15px] font-medium text-foreground">{t(item.label)}</span>
              <span className="text-[14px] font-semibold text-primary">
                {result}
              </span>
            </div>
            <span className="shrink-0 text-[13px] text-muted">{time}</span>
          </li>
        );
      })}
    </ul>
  );
}