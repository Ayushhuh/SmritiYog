export type PatientLanguage = "en" | "hi" | "as" | "bn" | "brx" | "mni";

export type PatientRelationship =
  | "child"
  | "spouse"
  | "grandchild"
  | "sibling"
  | "other";

// Mirror of the backend PatientWithRelationship schema.
export interface Patient {
  id: number;
  full_name: string;
  preferred_name: string | null;
  date_of_birth: string | null;
  preferred_language: PatientLanguage;
  relationship: PatientRelationship;
  is_active: boolean;
  created_at: string;
}

export interface PatientCreateInput {
  full_name: string;
  preferred_name?: string;
  date_of_birth?: string;
  preferred_language: PatientLanguage;
  relationship: PatientRelationship;
}

export const PATIENT_LANGUAGES: { value: PatientLanguage; label: string }[] = [
  { value: "en", label: "en" },
  { value: "hi", label: "hi" },
  { value: "as", label: "as" },
  { value: "bn", label: "bn" },
  { value: "brx", label: "brx" },
  { value: "mni", label: "mni" },
];

export const PATIENT_RELATIONSHIPS: {
  value: PatientRelationship;
  label: string;
}[] = [
  { value: "child", label: "child" },
  { value: "spouse", label: "spouse" },
  { value: "grandchild", label: "grandchild" },
  { value: "sibling", label: "sibling" },
  { value: "other", label: "other" },
];

export type PatientErrorKind =
  | "unauthorized"
  | "permission"
  | "duplicate"
  | "validation"
  | "network"
  | "not-found"
  | "unknown";

export interface PatientError {
  kind: PatientErrorKind;
  message: string;
}

export function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

export function displayName(patient: Patient): string {
  return patient.preferred_name?.trim() || patient.full_name;
}