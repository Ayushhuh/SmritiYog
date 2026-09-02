"use client";

export function ErrorState({
  title,
  description,
  onRetry,
}: {
  title: string;
  description: string;
  onRetry?: () => void;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-border bg-surface px-6 py-14 text-center"
      role="alert"
    >
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-danger"
        style={{ backgroundColor: "var(--surface-warm)" }}
        aria-hidden="true"
      >
        <i className="fa-solid fa-triangle-exclamation text-[28px]" />
      </span>
      <div className="flex max-w-sm flex-col gap-2">
        <h2 className="text-[22px] font-bold text-foreground">{title}</h2>
        <p className="text-[16px] leading-relaxed text-secondary">{description}</p>
      </div>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="flex h-12 items-center gap-2 rounded-2xl bg-primary px-6 text-[15px] font-semibold text-white transition-colors hover:bg-primary-dark focus:outline-none"
        >
          <i className="fa-solid fa-rotate-right text-[15px]" aria-hidden="true" />
          Try Again
        </button>
      )}
    </div>
  );
}