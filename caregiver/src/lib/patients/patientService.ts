// Patient service for SmritiYog CG
// Handles patient creation, listing, and retrieval via the backend API.

import { ApiError, apiRequest } from "@/lib/auth/apiClient";
import { getToken } from "@/lib/auth/authService";
import type { Patient } from "@/types/dashboard";

export interface CreatePatientPayload {
  full_name: string;
  preferred_name?: string;
  date_of_birth?: string;
  gender?: string;
  preferred_language?: string;
  phone_number?: string;
  password: string;
}

export interface CreatePatientResponse {
  patient: Patient;
}

function authHeaders(): Record<string, string> {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function parseBackendError(error: ApiError): string {
  if (error.status === 0) {
    return "We couldn't connect right now. Please try again.";
  }
  if (error.status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (error.status === 422) {
    return "Please check the information and try again.";
  }
  return error.message || "Something went wrong. Please try again.";
}

export const patientService = {
  async createPatient(payload: CreatePatientPayload): Promise<Patient> {
    try {
      const response = await apiRequest<CreatePatientResponse>(
        "/caregiver/patients",
        {
          method: "POST",
          body: payload,
          headers: authHeaders(),
        }
      );
      return response.patient;
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(parseBackendError(error));
      }
      throw new Error("Something went wrong. Please try again.");
    }
  },

  async getPatients(): Promise<Patient[]> {
    try {
      return await apiRequest<Patient[]>("/caregiver/patients", {
        headers: authHeaders(),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(parseBackendError(error));
      }
      throw new Error("Failed to load patients.");
    }
  },

  async getPatient(patientId: number): Promise<Patient> {
    try {
      return await apiRequest<Patient>(`/caregiver/patients/${patientId}`, {
        headers: authHeaders(),
      });
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(parseBackendError(error));
      }
      throw new Error("Failed to load patient details.");
    }
  },
};
