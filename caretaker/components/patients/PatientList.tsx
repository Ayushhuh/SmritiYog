"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n/store";
import type { Patient } from "@/lib/patients/types";
import { PatientCard } from "@/components/patients/PatientCard";

export function PatientList({ patients }: { patients: Patient[] }) {
  const { t } = useI18n();

  if (patients.length === 0) {
    return (
      <div
        role="status"
        className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center"
      >
        <span
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-secondary"
          style={{ backgroundColor: "var(--surface-warm)" }}
          aria-hidden="true"
        >
          <i className="fa-solid fa-users text-[28px]" />
        </span>
        <div className="flex max-w-sm flex-col gap-2">
          <h2 className="text-[22px] font-bold text-foreground">
            {t("patients.emptyTitle")}
          </h2>
          <p className="text-[16px] leading-relaxed text-secondary">
            {t("patients.emptySub")}
          </p>
        </div>
        <Link
          href="/patients/new"
          className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[16px] font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none"
        >
          <i className="fa-solid fa-user-plus text-[16px]" aria-hidden="true" />
          {t("patients.emptyCta")}
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-foreground">
          {t("patients.title")}
        </h1>
        <p className="text-[16px] text-muted">{t("patients.listSub")}</p>
      </div>

      <div className="flex justify-end">
        <Link
          href="/patients/new"
          className="flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[16px] font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none"
        >
          <i className="fa-solid fa-user-plus text-[16px]" aria-hidden="true" />
          {t("patients.addNew")}
        </Link>
      </div>

      <ul className="flex flex-col gap-3">
        {patients.map((patient) => (
          <PatientCard
            key={patient.id}
            patient={patient}
            relationshipLabel={t(`patients.rel_${patient.relationship}`)}
          />
        ))}
      </ul>
    </div>
  );
}