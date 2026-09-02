"use client";

import type { CaregiverUser } from "@/lib/auth/types";
import { useI18n } from "@/lib/i18n/store";
import { UserMenu } from "@/components/layout/UserMenu";
import { LanguageSelector } from "@/components/layout/LanguageSelector";

export function Topbar({ user }: { user: CaregiverUser }) {
  const { t } = useI18n();
  return (
    <div className="flex h-16 items-center justify-between border-b border-border bg-surface px-6 md:px-8">
      <div className="flex items-center gap-2 text-[15px] text-muted">
        <span className="font-medium text-muted">{t("nav.dashboard")}</span>
      </div>
      <div className="flex items-center gap-4">
        <LanguageSelector />
        <button
          type="button"
          aria-label={t("topbar.notifications")}
          className="relative flex h-10 w-10 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-surface-warm hover:text-foreground focus:outline-none"
        >
          <i className="fa-solid fa-bell text-[18px]" aria-hidden="true" />
          <span
            className="absolute right-2 top-2 flex h-2.5 w-2.5 items-center justify-center rounded-full bg-danger"
            aria-hidden="true"
          />
        </button>
        <UserMenu user={user} />
      </div>
    </div>
  );
}