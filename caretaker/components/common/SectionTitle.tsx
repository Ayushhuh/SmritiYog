import type { ReactNode } from "react";

export function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <div className="flex flex-col gap-1">
        <h2 className="text-[20px] font-semibold text-foreground">{title}</h2>
        {subtitle && <p className="text-[14px] text-muted">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}