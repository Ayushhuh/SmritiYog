"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import AddPatientForm from "@/components/patients/AddPatientForm";

export default function NewPatientPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <i className="fa-solid fa-spinner fa-spin text-2xl text-primary" aria-hidden="true" />
          <p className="text-[15px] text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <DashboardShell>
      {/* Breadcrumb */}
      <nav className="mb-6" aria-label="Breadcrumb">
        <ol className="flex items-center gap-2 text-[13px] text-text-muted">
          <li>
            <a href="/dashboard" className="hover:text-text-primary transition-smooth">
              Dashboard
            </a>
          </li>
          <li aria-hidden="true">
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </li>
          <li>
            <a href="/dashboard/patients" className="hover:text-text-primary transition-smooth">
              Patients
            </a>
          </li>
          <li aria-hidden="true">
            <i className="fa-solid fa-chevron-right text-[10px]" />
          </li>
          <li className="text-text-primary font-medium" aria-current="page">
            Add Patient
          </li>
        </ol>
      </nav>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary">
          Add Patient
        </h1>
        <p className="text-[15px] text-text-secondary mt-1">
          Create a new patient account with their profile and authentication credentials.
        </p>
      </div>

      {/* Form card */}
      <div className="max-w-[680px]">
        <div className="bg-surface rounded-[var(--radius-lg)] p-6 lg:p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
          <AddPatientForm />
        </div>
      </div>
    </DashboardShell>
  );
}
