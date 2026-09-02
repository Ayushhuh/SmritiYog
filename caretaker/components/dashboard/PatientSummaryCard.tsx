"use client";

import type { PatientSummary } from "@/lib/dashboard/types";
import { useI18n } from "@/lib/i18n/store";
import { Card } from "@/components/common/Card";

export function PatientSummaryCard({ summary }: { summary: PatientSummary }) {
  const { t } = useI18n();

  const connected = summary.connectedDaysAgo != null
    ? t(summary.connectedLabel, { count: summary.connectedDaysAgo })
    : t(summary.connectedLabel);

  return (
    <Card className="flex flex-col gap-4">
      <div className="flex items-center gap-4">
        {summary.avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={summary.avatarUrl}
            alt=""
            className="h-14 w-14 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary text-white">
            <span className="text-[18px] font-semibold">{summary.initials}</span>
          </span>
        )}
        <div className="flex flex-col gap-0.5">
          <span className="text-[18px] font-bold text-foreground">{summary.name}</span>
          {connected && (
            <span className="text-[13px] text-muted">{connected}</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 border-t border-border pt-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1">
          <span className="text-[12px] font-medium uppercase tracking-wide text-muted">
            {t(summary.lastActiveLabel)}
          </span>
          <span className="text-[15px] font-semibold text-foreground">
            {summary.lastActiveAt ? t(summary.lastActiveAt) : t("dashboard.noRecentActivity")}
          </span>
        </div>
      </div>

      <button
        type="button"
        className="mt-auto flex h-11 items-center justify-center gap-2 rounded-2xl border-2 border-border bg-surface text-[15px] font-semibold text-foreground transition-colors hover:border-primary hover:text-primary focus:outline-none"
      >
        {t("dashboard.viewPatient")}
        <i className="fa-solid fa-arrow-right text-[14px]" aria-hidden="true" />
      </button>
    </Card>
  );
}