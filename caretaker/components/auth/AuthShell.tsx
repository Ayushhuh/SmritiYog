"use client";

import type { ReactNode } from "react";

import { useI18n } from "@/lib/i18n/store";
import { Brand } from "@/components/auth/Brand";

type AuthShellProps = {
  children: ReactNode;
};

export function AuthShell({ children }: AuthShellProps) {
  const { t } = useI18n();

  return (
    <div className="min-h-full bg-background">
      <div className="mx-auto grid min-h-screen w-full max-w-[1200px] grid-cols-1 lg:grid-cols-2">
        <aside className="hidden flex-col justify-center gap-10 border-r border-border px-12 py-12 lg:flex">
          <Brand />
          <div className="flex flex-col gap-4">
            <h1 className="text-[30px] font-bold leading-snug text-foreground">
              {t("auth.head")}
            </h1>
            <p className="max-w-sm text-[16px] leading-relaxed text-secondary">
              {t("auth.body")}
            </p>
          </div>
          <div className="flex flex-col gap-3 pt-4">
            <FeatureLine icon="fa-regular fa-eye" label={t("auth.featureQuiet")} />
            <FeatureLine icon="fa-solid fa-shield-halved" label={t("auth.featurePrivate")} />
            <FeatureLine icon="fa-solid fa-chart-line" label={t("auth.featureProgress")} />
          </div>
        </aside>

        <main className="flex items-center justify-center px-6 py-10 sm:px-10">
          <div className="w-full max-w-[400px]">
            <div className="mb-8 flex justify-center lg:hidden">
              <Brand />
            </div>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}

function FeatureLine({ icon, label }: { icon: string; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span
        className="flex h-9 w-9 items-center justify-center rounded-xl text-secondary"
        style={{ backgroundColor: "var(--surface-warm)" }}
        aria-hidden="true"
      >
        <i className={`${icon} text-[16px]`} />
      </span>
      <span className="text-[15px] font-medium text-foreground">{label}</span>
    </div>
  );
}