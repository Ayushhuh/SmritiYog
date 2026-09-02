import { ApiError, apiRequest } from "./apiClient";
import type { AuthResponse, LoginPayload, RegisterPayload, User } from "@/types/auth";

const TOKEN_COOKIE = "smrityog_token";
const USER_COOKIE = "smrityog_user";

function setCookie(name: string, value: string, maxAge: number) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`;
}

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

function deleteCookie(name: string) {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

export function getToken(): string | null {
  return getCookie(TOKEN_COOKIE);
}

export function getStoredUser(): User | null {
  const raw = getCookie(USER_COOKIE);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as User;
  } catch {
    return null;
  }
}

function parseBackendError(error: ApiError, action: "login" | "register"): string {
  const msg = error.message.toLowerCase();

  if (action === "login") {
    if (msg.includes("email or password is incorrect")) {
      return "Email or password is incorrect.";
    }
    if (msg.includes("no longer active")) {
      return "This account is no longer active.";
    }
    if (error.status === 403) {
      return "This account does not have caregiver access.";
    }
  }

  if (action === "register") {
    if (msg.includes("already exists")) {
      return "An account with this email already exists.";
    }
  }

  if (error.status === 0) {
    return "We couldn't connect right now. Please try again.";
  }

  return "Something went wrong. Please try again.";
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  try {
    const response = await apiRequest<AuthResponse>("/auth/login", {
      method: "POST",
      body: { email: payload.email, password: payload.password },
    });

    setCookie(TOKEN_COOKIE, response.access_token, 60 * 60 * 24 * 7);
    setCookie(USER_COOKIE, JSON.stringify(response.user), 60 * 60 * 24 * 7);

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(parseBackendError(error, "login"));
    }
    throw new Error("Something went wrong. Please try again.");
  }
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  try {
    const response = await apiRequest<AuthResponse>("/auth/register", {
      method: "POST",
      body: { name: payload.name, email: payload.email, password: payload.password },
    });

    setCookie(TOKEN_COOKIE, response.access_token, 60 * 60 * 24 * 7);
    setCookie(USER_COOKIE, JSON.stringify(response.user), 60 * 60 * 24 * 7);

    return response;
  } catch (error) {
    if (error instanceof ApiError) {
      throw new Error(parseBackendError(error, "register"));
    }
    throw new Error("Something went wrong. Please try again.");
  }
}

export function logout(): void {
  deleteCookie(TOKEN_COOKIE);
  deleteCookie(USER_COOKIE);
}

export async function getCurrentUser(): Promise<User | null> {
  const token = getToken();
  if (!token) return null;

  try {
    const user = await apiRequest<User>("/auth/me", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCookie(USER_COOKIE, JSON.stringify(user), 60 * 60 * 24 * 7);
    return user;
  } catch {
    logout();
    return null;
  }
}
