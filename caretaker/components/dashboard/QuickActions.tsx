"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n/store";

export function QuickActions() {
  const { t } = useI18n();

  const ACTIONS: {
    key: string;
    icon: string;
    label: string;
    href?: string;
  }[] = [
    { key: "add-patient", icon: "fa-solid fa-user-plus", label: t("quickAction.addPatient"), href: "/patients/new" },
    { key: "reminder", icon: "fa-solid fa-calendar-plus", label: t("quickAction.createReminder") },
    { key: "voice", icon: "fa-solid fa-microphone-lines", label: t("quickAction.configureVoice") },
    { key: "progress", icon: "fa-solid fa-chart-simple", label: t("quickAction.viewProgress") },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {ACTIONS.map((action) =>
        action.href ? (
          <Link
            key={action.key}
            href={action.href}
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-4 text-center transition-colors hover:border-primary hover:text-primary focus:outline-none"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--surface-warm)", color: "var(--secondary)" }}
              aria-hidden="true"
            >
              <i className={`${action.icon} text-[18px]`} />
            </span>
            <span className="text-[14px] font-semibold text-foreground">{action.label}</span>
          </Link>
        ) : (
          <button
            key={action.key}
            type="button"
            className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-surface px-4 py-4 text-center transition-colors hover:border-primary hover:text-primary focus:outline-none"
          >
            <span
              className="flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ backgroundColor: "var(--surface-warm)", color: "var(--secondary)" }}
              aria-hidden="true"
            >
              <i className={`${action.icon} text-[18px]`} />
            </span>
            <span className="text-[14px] font-semibold text-foreground">{action.label}</span>
          </button>
        )
      )}
    </div>
  );
}