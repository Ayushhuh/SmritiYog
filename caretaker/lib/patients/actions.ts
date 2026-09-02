"use server";

import { revalidatePath } from "next/cache";

import {
  PatientApiError,
  createPatient,
  getPatient,
  getPatients,
} from "@/lib/patients/patientService";
import { getToken } from "@/lib/auth/session";
import type {
  Patient,
  PatientCreateInput,
  PatientError,
} from "@/lib/patients/types";

export type CreatePatientResult =
  | { ok: true; patient: Patient; error?: never }
  | { ok: false; patient?: never; error: PatientError };

export async function createPatientAction(
  input: PatientCreateInput
): Promise<CreatePatientResult> {
  const token = await getToken();
  if (!token) {
    return {
      ok: false,
      error: {
        kind: "unauthorized",
        message: "You need to be logged in to add a patient.",
      },
    };
  }
  try {
    const patient = await createPatient(token, input);
    revalidatePath("/dashboard");
    revalidatePath("/patients");
    return { ok: true, patient };
  } catch (error) {
    if (error instanceof PatientApiError) {
      return { ok: false, error: { kind: error.kind, message: error.message } };
    }
    return {
      ok: false,
      error: {
        kind: "unknown",
        message: "We couldn't add this patient right now. Please try again.",
      },
    };
  }
}

export async function getPatientsForUser(): Promise<Patient[]> {
  const token = await getToken();
  if (!token) return [];
  try {
    return await getPatients(token);
  } catch {
    return [];
  }
}

export async function getPatientForUser(
  patientId: number
): Promise<Patient | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await getPatient(token, patientId);
  } catch {
    return null;
  }
}

export async function createPatientFromFields(
  fullName: string,
  preferredName: string,
  dateOfBirth: string,
  preferredLanguage: string,
  relationship: string
): Promise<CreatePatientResult> {
  return createPatientAction({
    full_name: fullName.trim(),
    preferred_name: preferredName.trim() || undefined,
    date_of_birth: dateOfBirth || undefined,
    preferred_language: preferredLanguage as PatientCreateInput["preferred_language"],
    relationship: relationship as PatientCreateInput["relationship"],
  });
}