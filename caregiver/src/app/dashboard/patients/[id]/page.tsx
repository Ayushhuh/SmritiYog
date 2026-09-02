"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter, useParams } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import ErrorState from "@/components/common/ErrorState";
import { patientService } from "@/lib/patients/patientService";
import type { Patient } from "@/types/dashboard";

type PageState = "loading" | "ready" | "error";

export default function PatientDetailPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const patientId = Number(params.id);

  const [patient, setPatient] = useState<Patient | null>(null);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  async function loadPatient() {
    setPageState("loading");
    try {
      const data = await patientService.getPatient(patientId);
      setPatient(data);
      setPageState("ready");
    } catch {
      setErrorMsg("Failed to load patient details.");
      setPageState("error");
    }
  }

  useEffect(() => {
    if (isAuthenticated && patientId) {
      loadPatient();
    }
  }, [isAuthenticated, patientId]);

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

  const languageMap: Record<string, string> = {
    en: "English",
    hi: "Hindi",
    as: "Assamese",
    bn: "Bengali",
    mni: "Meitei",
  };

  const genderMap: Record<string, string> = {
    male: "Male",
    female: "Female",
    other: "Other",
    prefer_not_to_say: "Prefer not to say",
  };

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
            Patient Details
          </li>
        </ol>
      </nav>

      {pageState === "loading" ? (
        <div className="space-y-4">
          <div className="bg-surface rounded-[var(--radius-md)] p-6 animate-pulse">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 rounded-full bg-surface-warm" />
              <div className="space-y-2">
                <div className="h-5 w-48 bg-surface-warm rounded" />
                <div className="h-4 w-32 bg-surface-warm rounded" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-3 w-20 bg-surface-warm rounded" />
                  <div className="h-4 w-32 bg-surface-warm rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : pageState === "error" ? (
        <ErrorState onRetry={loadPatient} message={errorMsg} />
      ) : patient ? (
        <div className="space-y-6 max-w-[720px]">
          {/* Header */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
              <span className="text-[20px] font-semibold text-secondary">
                {(patient.preferred_name || patient.full_name)
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase()}
              </span>
            </div>
            <div>
              <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary">
                {patient.preferred_name || patient.full_name}
              </h1>
              <p className="text-[15px] text-text-secondary">
                Patient Account
              </p>
            </div>
          </div>

          {/* Patient Info Card */}
          <div className="bg-surface rounded-[var(--radius-lg)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h2 className="text-[17px] font-semibold text-text-primary mb-5 flex items-center gap-2">
              <i className="fa-solid fa-user text-[14px] text-primary" aria-hidden="true" />
              Patient Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                  Full Name
                </p>
                <p className="text-[15px] text-text-primary font-medium">
                  {patient.full_name}
                </p>
              </div>

              {patient.preferred_name && (
                <div>
                  <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                    Preferred Name
                  </p>
                  <p className="text-[15px] text-text-primary font-medium">
                    {patient.preferred_name}
                  </p>
                </div>
              )}

              {patient.date_of_birth && (
                <div>
                  <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                    Date of Birth
                  </p>
                  <p className="text-[15px] text-text-primary font-medium">
                    {patient.date_of_birth}
                  </p>
                </div>
              )}

              {patient.gender && (
                <div>
                  <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                    Gender
                  </p>
                  <p className="text-[15px] text-text-primary font-medium">
                    {genderMap[patient.gender] || patient.gender}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                  Preferred Language
                </p>
                <p className="text-[15px] text-text-primary font-medium">
                  {languageMap[patient.preferred_language] || patient.preferred_language}
                </p>
              </div>

              {patient.phone_number && (
                <div>
                  <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                    Phone Number
                  </p>
                  <p className="text-[15px] text-text-primary font-medium">
                    {patient.phone_number}
                  </p>
                </div>
              )}

              <div>
                <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                  Created
                </p>
                <p className="text-[15px] text-text-primary font-medium">
                  {new Date(patient.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>

          {/* Authentication Card */}
          <div className="bg-surface rounded-[var(--radius-lg)] p-6 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <h2 className="text-[17px] font-semibold text-text-primary mb-5 flex items-center gap-2">
              <i className="fa-solid fa-shield-halved text-[14px] text-primary" aria-hidden="true" />
              Authentication
            </h2>

            <div className="space-y-4">
              <div>
                <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                  Patient UID
                </p>
                <div className="inline-flex items-center gap-2 bg-surface-warm rounded-[8px] px-4 py-2.5">
                  <span className="text-[20px] font-bold text-text-primary tracking-[0.1em]">
                    {patient.uid}
                  </span>
                  <button
                    onClick={() => navigator.clipboard.writeText(patient.uid)}
                    className="text-text-muted hover:text-text-primary transition-smooth p-1 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                    aria-label="Copy UID"
                  >
                    <i className="fa-solid fa-copy text-[14px]" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div>
                <p className="text-[12px] text-text-muted uppercase tracking-wide mb-1">
                  Password
                </p>
                <div className="flex items-center gap-3">
                  <span className="text-[15px] text-text-muted">
                    &bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;
                  </span>
                  <span className="text-[13px] text-text-muted italic">
                    Stored securely (hashed)
                  </span>
                </div>
              </div>

              <div className="pt-2">
                <button
                  className="inline-flex items-center gap-2 h-10 px-4 rounded-[10px] border border-text-muted/20 text-[14px] font-medium text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
                  disabled
                  title="Coming soon"
                >
                  <i className="fa-solid fa-key text-sm" aria-hidden="true" />
                  Reset Password
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </DashboardShell>
  );
}
