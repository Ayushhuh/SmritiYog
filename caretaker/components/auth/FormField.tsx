import { forwardRef, type InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  id: string;
  error?: string;
  hint?: string;
};

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  function FormField({ label, id, error, hint, className, ...props }, ref) {
    const describedBy =
      error != null
        ? `${id}-error`
        : hint != null
          ? `${id}-hint`
          : undefined;

    return (
      <div className="flex flex-col gap-2">
        <label htmlFor={id} className="text-[16px] font-semibold text-foreground">
          {label}
        </label>
        <input
          ref={ref}
          id={id}
          aria-invalid={error != null}
          aria-describedby={describedBy}
          className={`h-12 w-full rounded-2xl border-2 bg-surface px-4 text-[16px] text-foreground placeholder:text-muted transition-colors focus:border-ring focus:outline-none ${
            error != null ? "border-danger" : "border-border"
          } ${className ?? ""}`}
          {...props}
        />
        {error != null && (
          <p id={`${id}-error`} role="alert" className="flex items-center gap-2 text-[14px] font-medium text-danger">
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