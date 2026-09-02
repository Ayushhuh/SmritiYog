"use client";

import { useI18n } from "@/lib/i18n/store";
import type { GamePerformanceRow } from "@/lib/dashboard/types";

export function GamePerformance({ items }: { items: GamePerformanceRow[] }) {
  const { t } = useI18n();

  return (
    <div className="flex flex-col gap-5">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="text-[15px] font-medium text-foreground">{t(item.name)}</span>
            <span className="text-[14px] font-semibold text-foreground">{item.scoreLabel}</span>
          </div>
          <ProgressBar value={item.score} />
        </div>
      ))}
    </div>
  );
}

function ProgressBar({ value }: { value: number }) {
  const { t } = useI18n();
  const width = Math.max(0, Math.min(100, value));
  const isPlaceholder = value === 0;
  return (
    <div
      role="progressbar"
      aria-valuenow={isPlaceholder ? undefined : width}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-label={t("chart.ariaGamePerformance")}
      className="h-3 w-full overflow-hidden rounded-full"
      style={{ backgroundColor: "var(--surface-warm)" }}
    >
      <div
        className="h-full rounded-full"
        style={{
          width: `${width}%`,
          backgroundColor: isPlaceholder ? "var(--border)" : "var(--secondary)",
        }}
      />
    </div>
  );
}