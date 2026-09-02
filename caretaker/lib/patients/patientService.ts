import "server-only";

import { API_BASE_URL } from "@/lib/auth/config";
import type {
  Patient,
  PatientCreateInput,
  PatientError,
} from "@/lib/patients/types";

export class PatientApiError extends Error {
  kind: PatientError["kind"];

  constructor(message: string, kind: PatientError["kind"]) {
    super(message);
    this.kind = kind;
  }
}

async function request<T>(
  path: string,
  init: RequestInit,
  token: string
): Promise<T> {
  if (!token) {
    throw new PatientApiError(
      "You need to be logged in to add a patient.",
      "unauthorized"
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...((init.headers as Record<string, string>) ?? {}),
  };

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new PatientApiError(
      "We couldn't connect right now. Please try again.",
      "network"
    );
  }

  if (!response.ok) {
    try {
      const body = (await response.json()) as { detail?: unknown };
      throw mapApiError(response.status, body?.detail);
    } catch (error) {
      if (error instanceof PatientApiError) throw error;
      throw mapApiError(response.status, null);
    }
  }

  return (await response.json()) as T;
}

function mapApiError(status: number, detail: unknown): PatientApiError {
  const message =
    typeof detail === "string" ? detail : "Something went wrong. Please try again.";

  switch (status) {
    case 401:
      return new PatientApiError(
        "You need to be logged in to add a patient.",
        "unauthorized"
      );
    case 403:
      return new PatientApiError(
        "You don't have permission to add patients.",
        "permission"
      );
    case 404:
      return new PatientApiError("Patient not found.", "not-found");
    case 409:
      return new PatientApiError(
        "This patient is already connected to your account.",
        "duplicate"
      );
    case 422:
      return new PatientApiError(
        "Please check the highlighted fields.",
        "validation"
      );
    default:
      return new PatientApiError(
        message,
        status === 400 ? "validation" : "unknown"
      );
  }
}

export async function getPatients(token: string): Promise<Patient[]> {
  return request<Patient[]>("/patients", { method: "GET" }, token);
}

export async function getPatient(
  token: string,
  patientId: number
): Promise<Patient> {
  return request<Patient>(`/patients/${patientId}`, { method: "GET" }, token);
}

export async function createPatient(
  token: string,
  input: PatientCreateInput
): Promise<Patient> {
  try {
    return await request<Patient>("/patients", {
      method: "POST",
      body: JSON.stringify({
        full_name: input.full_name,
        preferred_name: input.preferred_name || null,
        date_of_birth: input.date_of_birth || null,
        preferred_language: input.preferred_language,
        relationship: input.relationship,
      }),
    }, token);
  } catch (error) {
    if (error instanceof PatientApiError) throw error;
    throw new PatientApiError(
      "We couldn't add this patient right now. Please try again.",
      "unknown"
    );
  }
}