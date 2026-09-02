import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/actions";
import { getPatientForUser } from "@/lib/patients/actions";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { PatientDetail } from "@/components/patients/PatientDetail";

export const metadata: Metadata = {
  title: "Patient",
  description: "Patient details in your SmritiYog CG caregiver dashboard.",
};

export default async function PatientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const patientId = Number(params.id);
  const patient = Number.isFinite(patientId) ? await getPatientForUser(patientId) : null;

  return (
    <DashboardShell user={user}>
      <PatientDetail patient={patient} />
    </DashboardShell>
  );
}