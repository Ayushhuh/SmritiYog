// Mobile API client with automatic token refresh rotation.
// Tokens are stored in AsyncStorage. The refresh token rotates on every use.

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

const API_BASE_URL = Platform.select({
  web: 'http://localhost:8000',
  android: 'http://192.168.1.13:8000', // LAN IP for physical device
  ios: 'http://localhost:8000',         // iOS simulator
  default: 'http://localhost:8000',
})!;

const TOKENS_KEY = 'smriti.tokens';

export interface TokenPair {
  access_token: string;
  refresh_token: string;
}

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
}

export class ApiError extends Error {
  status: number;
  data: Record<string, unknown> | null;

  constructor(status: number, message: string, data?: Record<string, unknown>) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.data = data ?? null;
  }
}

// ── Token storage ──────────────────────────────────────────

export async function getStoredTokens(): Promise<TokenPair | null> {
  try {
    const raw = await AsyncStorage.getItem(TOKENS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as TokenPair;
  } catch {
    return null;
  }
}

export async function storeTokens(tokens: TokenPair): Promise<void> {
  await AsyncStorage.setItem(TOKENS_KEY, JSON.stringify(tokens));
}

export async function clearTokens(): Promise<void> {
  await AsyncStorage.removeItem(TOKENS_KEY);
}

// ── Refresh token rotation ─────────────────────────────────

async function refreshAccessToken(): Promise<TokenPair | null> {
  const stored = await getStoredTokens();
  if (!stored?.refresh_token) return null;

  try {
    const response = await fetch(`${API_BASE_URL}/auth/patient/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh_token: stored.refresh_token }),
    });

    if (!response.ok) {
      // Refresh token is revoked or expired — clear everything
      await clearTokens();
      return null;
    }

    const data: TokenPair = await response.json();
    await storeTokens(data);
    return data;
  } catch {
    await clearTokens();
    return null;
  }
}

// ── API request with auto-refresh ──────────────────────────

export async function apiRequest<T>(
  endpoint: string,
  options: RequestOptions = {},
): Promise<T> {
  const { method = 'GET', body, headers = {}, skipAuth = false } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  // Add auth header if we have a token
  if (!skipAuth) {
    const tokens = await getStoredTokens();
    if (tokens?.access_token) {
      (config.headers as Record<string, string>)['Authorization'] =
        `Bearer ${tokens.access_token}`;
    }
  }

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${endpoint}`, config);
  } catch {
    throw new ApiError(0, 'We could not connect right now. Please try again.');
  }

  // If 401 and not a refresh/login request, try refreshing
  if (response.status === 401 && !skipAuth && endpoint !== '/auth/patient/refresh') {
    const newTokens = await refreshAccessToken();
    if (newTokens) {
      // Retry with new access token
      (config.headers as Record<string, string>)['Authorization'] =
        `Bearer ${newTokens.access_token}`;
      try {
        response = await fetch(`${API_BASE_URL}${endpoint}`, config);
      } catch {
        throw new ApiError(0, 'We could not connect right now. Please try again.');
      }
    }
  }

  // 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      (data && typeof data === 'object' && 'detail' in data && typeof data.detail === 'string'
        ? data.detail
        : null) || 'Something went wrong. Please try again.';

    throw new ApiError(response.status, message, (data as Record<string, unknown>) ?? undefined);
  }

  return data as T;
}
