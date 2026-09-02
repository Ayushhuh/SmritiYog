import "server-only";

import { API_BASE_URL } from "@/lib/auth/config";
import type { AuthError, CaregiverUser, LoginInput, RegisterInput, UserRole } from "@/lib/auth/types";

export class AuthApiError extends Error {
  kind: AuthError["kind"];

  constructor(message: string, kind: AuthError["kind"]) {
    super(message);
    this.kind = kind;
  }
}

async function request<T>(
  path: string,
  init: RequestInit,
  token?: string
): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(init.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new AuthApiError(
      "We couldn't connect right now. Please try again.",
      "network"
    );
  }

  if (!response.ok) {
    let detail: unknown;
    try {
      const body = (await response.json()) as { detail?: unknown };
      detail = body?.detail;
    } catch {
      detail = null;
    }
    throw mapApiError(response.status, detail);
  }

  return (await response.json()) as T;
}

function mapApiError(status: number, detail: unknown): AuthApiError {
  const message =
    typeof detail === "string" ? detail : "Something went wrong. Please try again.";
  if (status === 401) {
    return new AuthApiError("Email or password is incorrect.", "invalid-credentials");
  }
  if (status === 403) {
    return new AuthApiError(
      "This account does not have caregiver access.",
      "role"
    );
  }
  if (status === 409) {
    return new AuthApiError(
      "An account with this email already exists.",
      "email-exists"
    );
  }
  return new AuthApiError(message, "unknown");
}

interface BackendAuthResponse {
  access_token: string;
  role: UserRole;
  user: CaregiverUser;
}

export async function loginRemote(
  input: LoginInput
): Promise<{ authToken: string; user: CaregiverUser }> {
  const data = await request<BackendAuthResponse>("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email: input.email, password: input.password }),
  });
  return { authToken: data.access_token, user: data.user };
}

export async function registerRemote(
  input: RegisterInput
): Promise<{ authToken: string; user: CaregiverUser }> {
  const data = await request<BackendAuthResponse>("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name: input.name,
      email: input.email,
      password: input.password,
    }),
  });
  return { authToken: data.access_token, user: data.user };
}

export async function fetchCurrentUser(token: string): Promise<CaregiverUser> {
  return request<CaregiverUser>("/auth/me", { method: "GET" }, token);
}

export { API_BASE_URL };