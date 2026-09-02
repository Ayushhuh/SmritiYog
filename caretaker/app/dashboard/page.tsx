import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/actions";
import { getPatientsForUser } from "@/lib/patients/actions";
import type { Patient as BackendPatient } from "@/lib/patients/types";
import { displayName, initialsFor } from "@/lib/patients/types";
import { dashboardRepository } from "@/lib/dashboard/dashboardService";
import type { Patient as DashboardPatient } from "@/lib/dashboard/types";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { DashboardView } from "@/components/dashboard/DashboardView";
import { DashboardEmptyState, DashboardLoadError } from "@/components/dashboard/DashboardMessage";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Your SmritiYog CG caregiver dashboard.",
};

function toDashboardPatient(patient: BackendPatient): DashboardPatient {
  const name = displayName(patient);
  const createdAt = new Date(patient.created_at);
  const connectedDaysAgo = Number.isNaN(createdAt.getTime())
    ? 0
    : Math.max(
        0,
        Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24))
      );
  return {
    id: String(patient.id),
    name,
    initials: initialsFor(name),
    connectedDaysAgo,
  };
}

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  let patients: DashboardPatient[];
  try {
    const realPatients = await getPatientsForUser();
    patients = realPatients.map(toDashboardPatient);
  } catch {
    return (
      <DashboardShell user={user}>
        <DashboardLoadError />
      </DashboardShell>
    );
  }

  if (patients.length === 0) {
    return (
      <DashboardShell user={user}>
        <DashboardEmptyState />
      </DashboardShell>
    );
  }

  const defaultId = patients[0].id;
  const defaultName = patients[0].name;
  let initialData;
  try {
    initialData = await dashboardRepository.getDashboardData(defaultId, defaultName);
  } catch {
    initialData = null;
  }

  return (
    <DashboardShell user={user}>
      <DashboardView
        caregiverName={user.name}
        initialPatients={patients}
        initialPatientId={defaultId}
        initialData={initialData}
      />
    </DashboardShell>
  );
}