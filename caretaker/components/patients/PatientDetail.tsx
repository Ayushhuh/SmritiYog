"use client";

import Link from "next/link";

import { useI18n } from "@/lib/i18n/store";
import { localeLabels } from "@/lib/i18n/config";
import type { Patient } from "@/lib/patients/types";
import { displayName, initialsFor } from "@/lib/patients/types";
import { Card } from "@/components/common/Card";

export function PatientDetail({ patient }: { patient: Patient | null }) {
  const { t } = useI18n();

  if (!patient) {
    return (
      <Card className="max-w-2xl">
        <div role="alert" className="flex flex-col items-center gap-3 py-6 text-center">
          <span
            className="flex h-16 w-16 items-center justify-center rounded-2xl text-danger"
            style={{ backgroundColor: "var(--surface-warm)" }}
            aria-hidden="true"
          >
            <i className="fa-solid fa-circle-exclamation text-[28px]" />
          </span>
          <p className="text-[17px] font-semibold text-foreground">{t("patients.notFound")}</p>
          <Link
            href="/patients"
            className="mt-2 flex h-[52px] items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[16px] font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none"
          >
            <i className="fa-solid fa-arrow-left text-[16px]" aria-hidden="true" />
            {t("patients.title")}
          </Link>
        </div>
      </Card>
    );
  }

  const name = displayName(patient);

  return (
    <div className="flex max-w-2xl flex-col gap-5">
      <Link
        href="/patients"
        className="flex items-center gap-2 text-[15px] font-medium text-secondary transition-colors hover:text-foreground focus:outline-none"
      >
        <i className="fa-solid fa-arrow-left text-[14px]" aria-hidden="true" />
        {t("patients.title")}
      </Link>

      <Card>
        <div className="flex items-center gap-4">
          <span
            className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-surface-warm text-[22px] font-bold text-secondary"
            aria-hidden="true"
          >
            {initialsFor(name)}
          </span>
          <div className="flex flex-col gap-1">
            <h1 className="text-[28px] font-bold text-foreground">{name}</h1>
            <p className="text-[16px] text-secondary">
              {t(`patients.rel_${patient.relationship}`)}
            </p>
          </div>
        </div>
      </Card>

      <Card>
        <dl className="flex flex-col gap-4">
          <DetailRow label={t("patients.fullName")} value={patient.full_name} />
          {patient.preferred_name && (
            <DetailRow label={t("patients.preferredName")} value={patient.preferred_name} />
          )}
          <DetailRow
            label={t("patients.preferredLanguage")}
            value={localeLabels[patient.preferred_language]?.native ?? patient.preferred_language}
          />
          {patient.date_of_birth && (
            <DetailRow label={t("patients.dateOfBirth")} value={formatDate(patient.date_of_birth)} />
          )}
          <DetailRow
            label={t("patients.relationship")}
            value={t(`patients.rel_${patient.relationship}`)}
          />
        </dl>
      </Card>

      <p className="text-[14px] text-muted">{t("patients.pairComingSoon")}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <dt className="text-[15px] font-medium text-muted">{label}</dt>
      <dd className="text-[16px] font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso + "T00:00:00");
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}