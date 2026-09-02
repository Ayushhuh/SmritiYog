export const locales = ["en", "hi", "as", "bn", "brx", "mni"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeLabels: Record<Locale, { label: string; native: string }> = {
  en: { label: "English", native: "English" },
  hi: { label: "Hindi", native: "हिन्दी" },
  as: { label: "Assamese", native: "অসমীয়া" },
  bn: { label: "Bengali", native: "বাংলা" },
  brx: { label: "Bodo", native: "बड़ो" },
  mni: { label: "Manipuri", native: "মৈতৈলোন" },
};

const STORAGE_KEY = "smrityog_cg_lang";

export function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale;
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isLocale(stored) ? stored : defaultLocale;
}

export function setStoredLocale(locale: Locale) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, locale);
  }
}

export function isLocale(value: string | null | undefined): value is Locale {
  return typeof value === "string" && (locales as readonly string[]).includes(value);
}

export const STORAGE_KEY_NAME = STORAGE_KEY;