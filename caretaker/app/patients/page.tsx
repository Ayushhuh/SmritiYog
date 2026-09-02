import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/actions";
import { getPatientsForUser } from "@/lib/patients/actions";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PatientList } from "@/components/patients/PatientList";

export const metadata: Metadata = {
  title: "My Patients",
  description: "View and manage the patients in your SmritiYog CG caregiver dashboard.",
};

export default async function PatientsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const patients = await getPatientsForUser();

  return (
    <DashboardShell user={user}>
      <PatientList patients={patients} />
    </DashboardShell>
  );
}