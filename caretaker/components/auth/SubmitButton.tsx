import type { ButtonHTMLAttributes, ReactNode } from "react";

type SubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  busy: boolean;
  busyLabel: string;
  children: ReactNode;
};

export function SubmitButton({
  busy,
  busyLabel,
  children,
  disabled,
  ...props
}: SubmitButtonProps) {
  return (
    <button
      type="submit"
      disabled={busy || disabled}
      className="flex h-[52px] w-full items-center justify-center gap-2 rounded-2xl bg-primary px-6 text-[16px] font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none disabled:cursor-not-allowed disabled:opacity-60"
      {...props}
    >
      {busy && (
        <>
          <i
            className="fa-solid fa-circle-notch fa-spin text-[16px]"
            aria-hidden="true"
          />
          {busyLabel}
        </>
      )}
      {!busy && children}
    </button>
  );
}