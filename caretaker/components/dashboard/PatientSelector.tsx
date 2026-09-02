"use client";

import type { Patient } from "@/lib/dashboard/types";
import { useI18n } from "@/lib/i18n/store";

export function PatientSelector({
  patients,
  selectedId,
  onSelect,
}: {
  patients: Patient[];
  selectedId: string;
  onSelect: (id: string) => void;
}) {
  const { t } = useI18n();
  return (
    <div className="flex items-center gap-3">
      <label htmlFor="patient-select" className="text-[15px] font-medium text-foreground">
        {t("dashboard.patient")}
      </label>
      <div className="relative">
        <select
          id="patient-select"
          value={selectedId}
          onChange={(e) => onSelect(e.target.value)}
          className="h-11 min-w-[200px] appearance-none rounded-2xl border-2 border-border bg-surface px-4 pr-10 text-[15px] font-medium text-foreground transition-colors focus:border-ring focus:outline-none"
        >
          {patients.map((patient) => (
            <option key={patient.id} value={patient.id}>
              {patient.name}
            </option>
          ))}
        </select>
        <i
          className="fa-solid fa-chevron-down pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-muted"
          aria-hidden="true"
        />
      </div>
    </div>
  );
}