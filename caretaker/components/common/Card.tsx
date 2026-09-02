import type { ReactNode } from "react";

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <section className={`rounded-2xl border border-border bg-surface ${padded ? "p-5 md:p-6" : ""} ${className ?? ""}`}>
      {children}
    </section>
  );
}