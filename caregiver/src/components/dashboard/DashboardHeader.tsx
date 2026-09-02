"use client";

import PatientSelector from "./PatientSelector";
import type { Patient } from "@/types/dashboard";

interface DashboardHeaderProps {
  caregiverName: string;
  patient: Patient | null;
  patients: Patient[];
  onPatientChange: (patientId: number) => void;
}

function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 17) return "Good afternoon";
  return "Good evening";
}

export default function DashboardHeader({
  caregiverName,
  patient,
  patients,
  onPatientChange,
}: DashboardHeaderProps) {
  const firstName = caregiverName.split(" ")[0];

  return (
    <div className="mb-6 lg:mb-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary leading-tight">
            {getGreeting()}, {firstName}
          </h1>
          {patient ? (
            <p className="text-[15px] text-text-secondary mt-1">
              Here&apos;s how {(patient.preferred_name || patient.full_name).split(" ")[0]} is doing today.
            </p>
          ) : (
            <p className="text-[15px] text-text-secondary mt-1">
              Welcome to SmritiYog CG
            </p>
          )}
        </div>

        {patients.length > 0 && (
          <PatientSelector
            patients={patients}
            selectedId={patient?.id ?? null}
            onChange={onPatientChange}
          />
        )}
      </div>
    </div>
  );
}
