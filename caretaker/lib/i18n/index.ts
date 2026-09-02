import en, { type Dictionary } from "./dictionaries/en";
import hi from "./dictionaries/hi";
import as_ from "./dictionaries/as";
import bn from "./dictionaries/bn";
import brx from "./dictionaries/bodo";
import mni from "./dictionaries/mni";
import { type Locale } from "./config";

const dictionaries: Record<Locale, Dictionary> = {
  en,
  hi,
  as: as_,
  bn,
  brx,
  mni,
};

export { type Dictionary, type Locale };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] ?? en;
}

function lookup(dict: Dictionary, path: string): string | undefined {
  const parts = path.split(".");
  let value: unknown = dict;
  for (const part of parts) {
    if (value && typeof value === "object" && part in (value as object)) {
      value = (value as Record<string, unknown>)[part];
    } else {
      return undefined;
    }
  }
  return typeof value === "string" ? value : undefined;
}

export type Translate = (path: string, params?: Record<string, string | number>) => string;

export function makeTranslator(locale: Locale): Translate {
  const dict = getDictionary(locale);
  return function translate(path: string, params?: Record<string, string | number>) {
    const text = lookup(dict, path) ?? lookup(en, path) ?? path;
    if (!params) return text;
    return Object.entries(params).reduce(
      (acc, [key, value]) => acc.replace(new RegExp(`\\{\\{${key}\\}\\}`, "g"), String(value)),
      text
    );
  };
}