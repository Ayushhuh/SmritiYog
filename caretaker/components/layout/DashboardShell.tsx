"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";

import type { CaregiverUser } from "@/lib/auth/types";
import { useI18n } from "@/lib/i18n/store";
import { Sidebar } from "@/components/layout/Sidebar";
import { Topbar } from "@/components/layout/Topbar";

export function DashboardShell({
  user,
  children,
}: {
  user: CaregiverUser;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-background lg:flex">
      {/* Mobile / tablet header */}
      <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-3 lg:hidden">
        <Link href="/dashboard" className="text-[18px] font-bold text-primary">
          SmritiYog <span className="text-secondary">CG</span>
        </Link>
        <button
          type="button"
          aria-label={t("topbar.openNavigation")}
          aria-expanded={navOpen}
          onClick={() => setNavOpen((o) => !o)}
          className="flex h-10 w-10 items-center justify-center rounded-xl text-foreground focus:outline-none"
        >
          <i className={`fa-solid ${navOpen ? "fa-xmark" : "fa-bars"} text-[20px]`} aria-hidden="true" />
        </button>
      </div>

      {/* Mobile navigation drawer */}
      {navOpen && <MobileNav onNavigate={() => setNavOpen(false)} onClose={() => setNavOpen(false)} />}

      {/* Persistent sidebar (desktop) */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile topbar (compact) */}
        <div className="lg:hidden">
          <Topbar user={user} />
        </div>

        {/* Desktop topbar */}
        <div className="hidden lg:block">
          <Topbar user={user} />
        </div>

        <main className="flex-1 px-4 py-6 sm:px-6 md:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}

function MobileNav({
  onNavigate,
  onClose,
}: {
  onNavigate: () => void;
  onClose: () => void;
}) {
  const { t } = useI18n();
  return (
    <div className="fixed inset-0 z-40 lg:hidden">
      <button
        type="button"
        aria-label={t("topbar.closeNavigation")}
        onClick={onClose}
        className="absolute inset-0 bg-black/30"
      />
      <div className="absolute inset-y-0 left-0">
        <Sidebar onNavigate={onNavigate} />
      </div>
      <span className="sr-only">{t("topbar.closedNavArea")}</span>
    </div>
  );
}