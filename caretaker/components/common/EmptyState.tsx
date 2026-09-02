import type { ReactNode } from "react";

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: string;
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-5 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center"
      role="status"
    >
      <span
        className="flex h-16 w-16 items-center justify-center rounded-2xl text-secondary"
        style={{ backgroundColor: "var(--surface-warm)" }}
        aria-hidden="true"
      >
        <i className={`${icon} text-[28px]`} />
      </span>
      <div className="flex max-w-sm flex-col gap-2">
        <h2 className="text-[22px] font-bold text-foreground">{title}</h2>
        <p className="text-[16px] leading-relaxed text-secondary">{description}</p>
      </div>
      {action}
    </div>
  );
}