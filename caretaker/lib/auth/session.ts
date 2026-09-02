import "server-only";

import { cookies } from "next/headers";
import { TOKEN_COOKIE_NAME } from "@/lib/auth/config";

const SEVEN_DAYS_SECONDS = 60 * 60 * 24 * 7;

export async function getToken(): Promise<string | undefined> {
  const store = await cookies();
  return store.get(TOKEN_COOKIE_NAME)?.value;
}

export async function storeToken(token: string): Promise<void> {
  const store = await cookies();
  store.set(TOKEN_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SEVEN_DAYS_SECONDS,
  });
}

export async function clearToken(): Promise<void> {
  const store = await cookies();
  store.delete(TOKEN_COOKIE_NAME);
}