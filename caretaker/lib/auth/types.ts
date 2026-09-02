export type UserRole = "caregiver";

export interface CaregiverUser {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  language: string;
  created_at: string;
}

export interface AuthSession {
  user: CaregiverUser;
}

export type AuthErrorKind =
  | "invalid-credentials"
  | "email-exists"
  | "network"
  | "role"
  | "unknown";

export interface AuthError {
  kind: AuthErrorKind;
  message: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  name: string;
  email: string;
  password: string;
}