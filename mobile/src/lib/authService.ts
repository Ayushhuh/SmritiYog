// Patient authentication service for mobile app.
// Handles login with UID + password, logout, and token management.

import { ApiError, apiRequest, clearTokens, storeTokens } from './apiClient';
import type { PatientAuthResponse, Patient } from '@/types/patient';

export interface LoginResult {
  patient: Patient;
  preferred_language: string;
}

function parseBackendError(error: ApiError): string {
  if (error.status === 0) {
    return 'We could not connect right now. Please try again.';
  }
  if (error.status === 401) {
    return 'Invalid UID or password. Please try again.';
  }
  return error.message || 'Something went wrong. Please try again.';
}

export const authService = {
  async login(uid: string, password: string): Promise<LoginResult> {
    try {
      const response = await apiRequest<PatientAuthResponse>(
        '/auth/patient/login',
        {
          method: 'POST',
          body: { uid, password },
          skipAuth: true,
        },
      );

      // Store tokens
      await storeTokens({
        access_token: response.access_token,
        refresh_token: response.refresh_token,
      });

      return {
        patient: response.patient,
        preferred_language: response.preferred_language,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw new Error(parseBackendError(error));
      }
      throw new Error('Something went wrong. Please try again.');
    }
  },

  async logout(): Promise<void> {
    try {
      // Revoke the refresh token on the server
      const { getStoredTokens } = await import('./apiClient');
      const tokens = await getStoredTokens();
      if (tokens?.refresh_token) {
        await apiRequest('/auth/patient/logout', {
          method: 'POST',
          body: { refresh_token: tokens.refresh_token },
        }).catch(() => {}); // Best effort — clear tokens even if server fails
      }
    } finally {
      await clearTokens();
    }
  },

  async isAuthenticated(): Promise<boolean> {
    const { getStoredTokens } = await import('./apiClient');
    const tokens = await getStoredTokens();
    return !!tokens?.access_token;
  },
};
