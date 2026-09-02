"use client";

import { forwardRef, type InputHTMLAttributes } from "react";

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  id: string;
}

const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, error, id, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-[6px]">
        <label
          htmlFor={id}
          className="text-[15px] font-medium text-text-primary"
        >
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          className={[
            "h-12 rounded-[var(--radius-md)] border bg-surface px-4 text-[16px] text-text-primary placeholder:text-text-muted transition-smooth",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
            error ? "border-danger" : "border-text-muted/30 hover:border-text-muted/50",
            className,
          ].join(" ")}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : undefined}
          {...props}
        />
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

FormField.displayName = "FormField";

export default FormField;
