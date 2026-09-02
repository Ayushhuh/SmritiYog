import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentUser } from "@/lib/auth/actions";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { AddPatientForm } from "@/components/patients/AddPatientForm";

export const metadata: Metadata = {
  title: "Add Patient",
  description: "Add a patient to your SmritiYog CG caregiver dashboard.",
};

export default async function AddPatientPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <DashboardShell user={user}>
      <AddPatientForm />
    </DashboardShell>
  );
}