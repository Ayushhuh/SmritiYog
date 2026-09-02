import type {
  DashboardData,
  Patient,
  PatientSummary,
} from "@/lib/dashboard/types";
import {
  getMockDashboardData,
  getMockPatientSummary,
  getMockPatients,
} from "@/lib/dashboard/mockData";

// ─────────────────────────────────────────────────────────────────────────────
// Dashboard service.
// This is the single data source for the dashboard. Today it reads from the
// isolated mock provider; when the backend analytics API is ready, each method
// should call the real endpoints instead. The UI only talks to this layer.
// ─────────────────────────────────────────────────────────────────────────────

export interface DashboardRepository {
  getPatients: () => Promise<Patient[]>;
  getPatientSummary: (patientId: string, name?: string) => Promise<PatientSummary>;
  getDashboardData: (patientId: string, name?: string) => Promise<DashboardData>;
}

export const dashboardRepository: DashboardRepository = {
  async getPatients() {
    // Replace with: fetch API_BASE_URL + "/patients"
    return getMockPatients();
  },
  async getPatientSummary(patientId, name) {
    return getMockPatientSummary(patientId, name);
  },
  async getDashboardData(patientId, name) {
    return getMockDashboardData(patientId, name);
  },
};