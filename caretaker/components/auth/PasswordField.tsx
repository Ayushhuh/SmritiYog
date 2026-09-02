"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";
import { useI18n } from "@/lib/i18n/store";

type PasswordFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
  label: string;
  id: string;
  error?: string;
  hint?: string;
};

export const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  function PasswordField({ label, id, error, hint, className, ...props }, ref) {
    const { t } = useI18n();
    const [visible, setVisible] = useState(false);
    const inputType = visible ? "text" : "password";
    const describedBy =
      error != null ? `${id}-error` : hint != null ? `${id}-hint` : undefined;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-[16px] font-semibold text-foreground">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={inputType}
            autoComplete={props.autoComplete ?? "current-password"}
            aria-invalid={error != null}
            aria-describedby={describedBy}
            className={`h-12 w-full rounded-2xl border-2 bg-surface pr-12 pl-4 text-[16px] text-foreground placeholder:text-muted transition-colors focus:border-ring focus:outline-none ${
              error != null ? "border-danger" : "border-border"
            } ${className ?? ""}`}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            aria-label={visible ? t("auth.hidePassword") : t("auth.showPassword")}
            aria-pressed={visible}
            className="absolute right-1 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-2xl text-muted transition-colors hover:text-foreground focus:outline-none"
          >
            <i
              className={`fa-solid ${visible ? "fa-eye-slash" : "fa-eye"} text-[18px]`}
              aria-hidden="true"
            />
          </button>
        </div>
        {error != null && (
          <p
            id={`${id}-error`}
            role="alert"
            className="flex items-center gap-2 text-[14px] font-medium text-danger"
          >
            <i className="fa-solid fa-circle-exclamation text-[14px]" aria-hidden="true" />
            {error}
          </p>
        )}
        {error == null && hint != null && (
          <p id={`${id}-hint`} className="text-[14px] text-muted">
            {hint}
          </p>
        )}
      </div>
    );
  }
);