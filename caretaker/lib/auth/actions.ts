"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import {
  AuthApiError,
  fetchCurrentUser,
  loginRemote,
  registerRemote,
} from "@/lib/auth/authService";
import { clearToken, getToken, storeToken } from "@/lib/auth/session";
import type { AuthError, CaregiverUser, LoginInput, RegisterInput } from "@/lib/auth/types";

export type AuthActionResult =
  | { ok: true; user: CaregiverUser; error?: never }
  | { ok: false; error: AuthError; user?: never };

function toResult(
  error: unknown
): { ok: false; error: AuthError } {
  if (error instanceof AuthApiError) {
    return { ok: false, error: { kind: error.kind, message: error.message } };
  }
  return {
    ok: false,
    error: { kind: "unknown", message: "Something went wrong. Please try again." },
  };
}

export async function login(formInput: LoginInput): Promise<AuthActionResult> {
  try {
    const { authToken, user } = await loginRemote(formInput);
    await storeToken(authToken);
    revalidatePath("/dashboard");
    revalidatePath("/login");
    revalidatePath("/register");
    return { ok: true, user };
  } catch (error) {
    return toResult(error);
  }
}

export async function register(
  formInput: RegisterInput
): Promise<AuthActionResult> {
  try {
    const { authToken, user } = await registerRemote(formInput);
    await storeToken(authToken);
    revalidatePath("/dashboard");
    revalidatePath("/login");
    revalidatePath("/register");
    return { ok: true, user };
  } catch (error) {
    return toResult(error);
  }
}

export async function logout(): Promise<void> {
  await clearToken();
  revalidatePath("/dashboard");
  revalidatePath("/login");
  redirect("/login");
}

export async function getCurrentUser(): Promise<CaregiverUser | null> {
  const token = await getToken();
  if (!token) return null;
  try {
    return await fetchCurrentUser(token);
  } catch (error) {
    if (error instanceof AuthApiError && error.kind !== "network") {
      await clearToken();
    }
    return null;
  }
}

export { clearToken };