"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n/store";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";

export function DashboardEmptyState() {
  const { t } = useI18n();
  return (
    <EmptyState
      icon="fa-solid fa-user-plus"
      title={t("dashboard.addFirstPatient")}
      description={t("dashboard.addFirstPatientDesc")}
      action={
        <Link
          href="/patients/new"
          className="flex h-12 items-center gap-2 rounded-2xl bg-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none"
        >
          <i className="fa-solid fa-user-plus text-[15px]" aria-hidden="true" />
          {t("dashboard.addPatient")}
        </Link>
      }
    />
  );
}

export function DashboardLoadError({ onRetry }: { onRetry?: () => void }) {
  const { t } = useI18n();
  return (
    <ErrorState
      title={t("dashboard.somethingWrong")}
      description={t("dashboard.couldNotLoad")}
      onRetry={onRetry}
    />
  );
}