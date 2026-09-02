"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { useI18n } from "@/lib/i18n/store";

export interface NavItem {
  key: string;
  labelKey: string;
  icon: string;
  href?: string;
}

const NAV_KEYS = [
  { key: "dashboard", labelKey: "nav.dashboard", icon: "fa-solid fa-house", href: "/dashboard" },
  { key: "patient", labelKey: "nav.patient", icon: "fa-solid fa-user", href: "/patients" },
  { key: "games", labelKey: "nav.games", icon: "fa-solid fa-brain" },
  { key: "reminders", labelKey: "nav.reminders", icon: "fa-solid fa-calendar-check" },
  { key: "voice", labelKey: "nav.voice", icon: "fa-solid fa-microphone" },
  { key: "settings", labelKey: "nav.settings", icon: "fa-solid fa-gear" },
] as const satisfies NavItem[];

export function Sidebar({ onNavigate }: { onNavigate?: () => void } = {}) {
  const pathname = usePathname();
  const { t } = useI18n();

  return (
    <div className="flex h-full w-[248px] flex-col border-r border-border bg-surface">
      <div className="flex items-center justify-center border-b border-border px-6 py-6">
        <Link href="/dashboard" className="flex flex-col items-center text-center">
          <span className="text-[20px] font-bold tracking-tight text-primary">
            SmritiYog <span className="text-secondary">CG</span>
          </span>
          <span className="text-[13px] font-medium text-muted">{t("brand.tagline")}</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4" aria-label={t("nav.label")}>
        <ul className="flex flex-col gap-1">
          {(NAV_KEYS as NavItem[]).map((item) => {
            const active = pathname === item.href;
            return item.href ? (
              <li key={item.key}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  aria-current={active ? "page" : undefined}
                  className={`flex h-11 items-center gap-3 rounded-xl px-3 text-[15px] font-medium transition-colors focus:outline-none ${
                    active
                      ? "bg-primary text-white"
                      : "text-foreground hover:bg-surface-warm"
                  }`}
                >
                  <i className={`${item.icon} w-5 text-center`} aria-hidden="true" />
                  {t(item.labelKey)}
                </Link>
              </li>
            ) : (
              <li key={item.key}>
                <button
                  type="button"
                  disabled
                  className="flex h-11 w-full cursor-not-allowed items-center gap-3 rounded-xl px-3 text-[15px] font-medium text-muted"
                >
                  <i className={`${item.icon} w-5 text-center`} aria-hidden="true" />
                  {t(item.labelKey)}
                  <span className="ml-auto rounded-full bg-surface-warm px-2 py-0.5 text-[11px] font-semibold text-muted">
                    {t("common.soon")}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="border-t border-border px-6 py-4">
        <p className="text-[12px] text-muted">SmritiYog • {t("brand.portal")}</p>
      </div>
    </div>
  );
}