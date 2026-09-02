"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import DashboardShell from "@/components/layout/DashboardShell";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import { patientService } from "@/lib/patients/patientService";
import type { Patient } from "@/types/dashboard";

type PageState = "loading" | "ready" | "error";

export default function PatientsPage() {
  const { loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [pageState, setPageState] = useState<PageState>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  async function loadPatients() {
    setPageState("loading");
    try {
      const data = await patientService.getPatients();
      setPatients(data);
      setPageState("ready");
    } catch {
      setErrorMsg("Failed to load patients.");
      setPageState("error");
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadPatients();
    }
  }, [isAuthenticated]);

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
          <li className="text-text-primary font-medium" aria-current="page">
            Patients
          </li>
        </ol>
      </nav>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-[24px] sm:text-[28px] font-bold text-text-primary">
            Patients
          </h1>
          <p className="text-[15px] text-text-secondary mt-1">
            Manage your connected patients
          </p>
        </div>
        <Link
          href="/dashboard/patients/new"
          className="inline-flex items-center gap-2 h-11 px-5 rounded-[10px] bg-primary text-on-primary text-[14px] font-semibold transition-smooth hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <i className="fa-solid fa-plus text-sm" aria-hidden="true" />
          Add Patient
        </Link>
      </div>

      {/* Content */}
      {pageState === "loading" ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-surface rounded-[var(--radius-md)] p-5 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-surface-warm" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-40 bg-surface-warm rounded" />
                  <div className="h-3 w-24 bg-surface-warm rounded" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : pageState === "error" ? (
        <ErrorState onRetry={loadPatients} message={errorMsg} />
      ) : patients.length === 0 ? (
        <EmptyState
          icon="fa-user-plus"
          title="No patients yet"
          description="Add your first patient to start monitoring their cognitive health activities."
          actionLabel="Add Patient"
          actionHref="/dashboard/patients/new"
        />
      ) : (
        <div className="space-y-3">
          {patients.map((patient) => {
            const displayName = patient.preferred_name || patient.full_name;
            const initials = displayName
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            return (
              <Link
                key={patient.id}
                href={`/dashboard/patients/${patient.id}`}
                className="block bg-surface rounded-[var(--radius-md)] p-5 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-full bg-secondary/10 flex items-center justify-center shrink-0">
                    <span className="text-[14px] font-semibold text-secondary">
                      {initials}
                    </span>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[16px] font-semibold text-text-primary truncate">
                      {displayName}
                    </h3>
                    <div className="flex items-center gap-3 mt-0.5">
                      <span className="text-[13px] text-text-muted">
                        UID: {patient.uid}
                      </span>
                      <span className="text-[13px] text-text-muted">
                        {languageMap[patient.preferred_language] || patient.preferred_language}
                      </span>
                    </div>
                  </div>

                  {/* Status */}
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary/10 text-secondary text-[12px] font-medium">
                      <i className="fa-solid fa-check text-[10px]" aria-hidden="true" />
                      Active
                    </span>
                    <i className="fa-solid fa-chevron-right text-[12px] text-text-muted" aria-hidden="true" />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
