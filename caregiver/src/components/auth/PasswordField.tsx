"use client";

import { forwardRef, useState, type InputHTMLAttributes } from "react";

interface PasswordFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

const PasswordField = forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor={id}
          className="text-[15px] font-medium text-text-primary"
        >
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            id={id}
            type={visible ? "text" : "password"}
            className={[
              "h-12 w-full rounded-[var(--radius-md)] border bg-surface px-4 pr-12 text-[16px] text-text-primary placeholder:text-text-muted transition-smooth",
              "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
              error ? "border-danger" : "border-text-muted/30 hover:border-text-muted/50",
              className,
            ].join(" ")}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : undefined}
            {...props}
          />
          <button
            type="button"
            onClick={() => setVisible((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-text-muted hover:text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
            aria-label={visible ? "Hide password" : "Show password"}
            tabIndex={-1}
          >
            {visible ? (
              <i className="fa-regular fa-eye-slash text-lg" aria-hidden="true" />
            ) : (
              <i className="fa-regular fa-eye text-lg" aria-hidden="true" />
            )}
          </button>
        </div>
        {error && (
          <p
            id={`${id}-error`}
            className="text-[14px] text-danger flex items-center gap-1"
            role="alert"
          >
            <svg
              className="w-4 h-4 shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  }
);

PasswordField.displayName = "PasswordField";

export default PasswordField;
