import Link from "next/link";

import type { Patient } from "@/lib/patients/types";
import { displayName, initialsFor } from "@/lib/patients/types";

export function PatientCard({
  patient,
  relationshipLabel,
}: {
  patient: Patient;
  relationshipLabel: string;
}) {
  const name = displayName(patient);

  return (
    <li>
      <Link
        href={`/patients/${patient.id}`}
        className="group flex items-center gap-4 rounded-2xl border border-border bg-surface p-4 transition-colors hover:border-ring focus:outline-none"
      >
        <span
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-surface-warm text-[16px] font-bold text-secondary"
          aria-hidden="true"
        >
          {initialsFor(name)}
        </span>
        <span className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="truncate text-[17px] font-semibold text-foreground">
            {name}
          </span>
          <span className="text-[14px] text-muted">{relationshipLabel}</span>
        </span>
        <i
          className="fa-solid fa-chevron-right text-[16px] text-muted transition-transform group-hover:translate-x-0.5"
          aria-hidden="true"
        />
      </Link>
    </li>
  );
}