import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { DEVANAGARI_SCRIPT, LANGUAGES, type Language } from './languages';
import { translations, type TranslationKey, type Translator } from './strings';

const STORAGE_KEY = 'smriti.language';

type LanguageContextValue = {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: Translator;
  isDevanagari: boolean;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

function isLanguage(value: string | null): value is Language {
  return !!value && (LANGUAGES as readonly string[]).includes(value);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');

  useEffect(() => {
    let active = true;
    AsyncStorage.getItem(STORAGE_KEY)
      .then((stored) => {
        if (active && isLanguage(stored)) setLanguageState(stored);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    AsyncStorage.setItem(STORAGE_KEY, lang).catch(() => {});
  };

  const value = useMemo<LanguageContextValue>(() => {
    const dict = translations[language];
    const t: Translator = (key) => dict[key] ?? key;
    return {
      language,
      setLanguage,
      t,
      isDevanagari: DEVANAGARI_SCRIPT[language],
    };
  }, [language]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return ctx;
}

export type { Language, Translator, TranslationKey };
export { translations };