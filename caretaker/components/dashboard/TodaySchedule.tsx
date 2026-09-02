"use client";

import type { ScheduleItem } from "@/lib/dashboard/types";
import { useI18n } from "@/lib/i18n/store";

export function TodaySchedule({ items }: { items: ScheduleItem[] }) {
  const { t } = useI18n();

  return (
    <ol className="flex flex-col">
      {items.map((item) => {
        const isUpcoming = item.status === "upcoming";
        const isCompleted = item.status === "completed";
        const isMissed = item.status === "missed";
        return (
          <li key={item.id} className="relative flex gap-4 border-l-2 border-border pb-5 pl-5 last:pb-0">
            <span
              className="absolute -left-[13px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-surface"
              style={{
                borderColor: isMissed
                  ? "var(--danger)"
                  : isUpcoming
                    ? "var(--primary)"
                    : "var(--secondary)",
              }}
              aria-hidden="true"
            >
              <i
                className={`fa-solid ${isCompleted ? "fa-check" : isMissed ? "fa-xmark" : "fa-clock"} text-[10px] ${
                  isCompleted ? "text-secondary" : isMissed ? "text-danger" : "text-primary"
                }`}
              />
            </span>

            <div className="flex w-full flex-wrap items-center gap-x-4 gap-y-1">
              <span className="text-[15px] font-semibold text-foreground">{t(item.title)}</span>
              <span className="ml-auto flex items-center gap-3">
                <span className="text-[14px] font-medium text-foreground">{item.time}</span>
                <StatusPill status={item.status} />
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function StatusPill({ status }: { status: ScheduleItem["status"] }) {
  const { t } = useI18n();
  const style = {
    completed: { bg: "var(--surface-warm)", color: "var(--secondary)" },
    upcoming: { bg: "var(--surface-warm)", color: "var(--primary)" },
    missed: { bg: "var(--surface-warm)", color: "var(--danger)" },
  }[status];
  const label = t(`scheduleStatus.${status}`);

  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[12px] font-semibold"
      style={{ backgroundColor: style.bg, color: style.color }}
    >
      {label}
    </span>
  );
}