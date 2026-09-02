"use client";

import Link from "next/link";
import type { Patient } from "@/types/dashboard";

interface PatientSummaryCardProps {
  patient: Patient;
}

export default function PatientSummaryCard({ patient }: PatientSummaryCardProps) {
  const displayName = patient.preferred_name || patient.full_name;
  const initials = displayName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const createdDate = new Date(patient.created_at);
  const now = new Date();
  const diffMs = now.getTime() - createdDate.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  function formatConnected(): string {
    if (diffDays === 0) return "Connected today";
    if (diffDays === 1) return "Connected yesterday";
    return `Connected ${diffDays} days ago`;
  }

  return (
    <div className="bg-surface rounded-[var(--radius-md)] p-5 flex items-center gap-4">
      {/* Avatar */}
      <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
        <span className="text-[15px] font-semibold text-secondary">
          {initials}
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h3 className="text-[16px] font-semibold text-text-primary truncate">
          {displayName}
        </h3>
        <p className="text-[13px] text-text-muted">
          UID: {patient.uid}
        </p>
        <p className="text-[13px] text-text-muted">
          {formatConnected()}
        </p>
      </div>

      {/* Actions */}
      <div className="hidden sm:flex flex-col items-end gap-1">
        <Link
          href={`/dashboard/patients/${patient.id}`}
          className="text-[13px] font-medium text-primary hover:text-primary-dark transition-smooth"
        >
          View Patient
        </Link>
      </div>
    </div>
  );
}
