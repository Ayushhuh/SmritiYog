// Auth context for the mobile app.
// Provides patient authentication state, login, logout, and session persistence.
// Tokens rotate automatically on refresh — the patient stays logged in until intentional logout.

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import type { Language } from '@/i18n/languages';
import { authService } from './authService';
import type { Patient } from '@/types/patient';

const PATIENT_KEY = 'smriti.patient';
const LANGUAGE_KEY = 'smriti.patient.language';

type AuthContextValue = {
  patient: Patient | null;
  loading: boolean;
  login: (uid: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  setLanguage: (lang: Language) => void;
  language: Language;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [language, setLanguageState] = useState<Language>('en');
  const [loading, setLoading] = useState(true);

  // Restore session on mount
  useEffect(() => {
    let active = true;

    async function restore() {
      try {
        const patientRaw = await AsyncStorage.getItem(PATIENT_KEY);
        const langRaw = await AsyncStorage.getItem(LANGUAGE_KEY);

        if (patientRaw && active) {
          const storedPatient = JSON.parse(patientRaw) as Patient;
          setPatient(storedPatient);

          // Set language from patient's preferred language
          if (langRaw) {
            setLanguageState(langRaw as Language);
          } else if (storedPatient.preferred_language) {
            setLanguageState(storedPatient.preferred_language as Language);
          }
        }
      } catch {
        // Corrupted data — clear and start fresh
        await AsyncStorage.multiRemove([PATIENT_KEY, LANGUAGE_KEY]);
      } finally {
        if (active) setLoading(false);
      }
    }

    restore();
    return () => {
      active = false;
    };
  }, []);

  const login = useCallback(async (uid: string, password: string) => {
    const result = await authService.login(uid, password);
    setPatient(result.patient);

    // Set language from login response
    const lang = result.preferred_language as Language;
    setLanguageState(lang);

    // Persist
    await AsyncStorage.setItem(PATIENT_KEY, JSON.stringify(result.patient));
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setPatient(null);
    setLanguageState('en');
    await AsyncStorage.multiRemove([PATIENT_KEY, LANGUAGE_KEY]);
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    setLanguageState(lang);
    await AsyncStorage.setItem(LANGUAGE_KEY, lang);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      patient,
      loading,
      login,
      logout,
      isAuthenticated: !!patient,
      setLanguage,
      language,
    }),
    [patient, loading, login, logout, setLanguage, language],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
