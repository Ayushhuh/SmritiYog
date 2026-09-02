"use client";

import { useRef, useState } from "react";

import { useI18n } from "@/lib/i18n/store";
import { localeLabels, type Locale } from "@/lib/i18n/config";

export function LanguageSelector() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const entries = (Object.keys(localeLabels) as Locale[]).map((key) => ({
    key,
    ...localeLabels[key],
  }));

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Change language"
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-10 w-10 items-center justify-center rounded-2xl text-muted transition-colors hover:bg-surface-warm hover:text-foreground focus:outline-none"
      >
        <i className="fa-solid fa-earth-asia text-[18px]" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-border bg-surface p-1.5 shadow-sm"
        >
          <p className="border-b border-border px-3 py-2.5 text-[13px] font-medium text-muted">
            {t("common.chooseLanguage")}
          </p>
          <ul className="flex flex-col py-1">
            {entries.map((item) => {
              const active = item.key === locale;
              return (
                <li key={item.key}>
                  <button
                    type="button"
                    role="menuitemradio"
                    aria-checked={active}
                    onClick={() => {
                      setLocale(item.key);
                      setOpen(false);
                    }}
                    className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-[14px] font-medium transition-colors focus:outline-none ${
                      active
                        ? "bg-surface-warm text-primary"
                        : "text-foreground hover:bg-surface-warm"
                    }`}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{ backgroundColor: "var(--surface-warm)", color: "var(--secondary)" }}
                      aria-hidden="true"
                    >
                      <i className="fa-solid fa-globe text-[14px]" />
                    </span>
                    <span className="flex-1 text-left">
                      <span className="block text-foreground">{item.native}</span>
                      <span className="block text-[12px] text-muted">{item.label}</span>
                    </span>
                    {active && (
                      <i className="fa-solid fa-check text-[13px] text-primary" aria-hidden="true" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}