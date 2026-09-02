export function StatCard({
  icon,
  accent,
  label,
  value,
  caption,
}: {
  icon: string;
  accent: "primary" | "secondary" | "accent" | "info";
  label: string;
  value: string;
  caption: string;
}) {
  const chip = {
    primary: { bg: "var(--surface-warm)", color: "var(--primary)" },
    secondary: { bg: "var(--surface-warm)", color: "var(--secondary)" },
    accent: { bg: "var(--surface-warm)", color: "var(--accent-sun)" },
    info: { bg: "var(--surface-warm)", color: "var(--text-secondary)" },
  }[accent];

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 md:p-6">
      <div className="flex items-center justify-between">
        <span className="text-[15px] font-medium text-foreground">{label}</span>
        <span
          className="flex h-10 w-10 items-center justify-center rounded-xl"
          style={{ backgroundColor: chip.bg, color: chip.color }}
          aria-hidden="true"
        >
          <i className={`${icon} text-[18px]`} />
        </span>
      </div>
      <div className="flex flex-col gap-1">
        <span className="text-[30px] font-bold leading-none text-foreground">{value}</span>
        <span className="text-[13px] text-muted">{caption}</span>
      </div>
    </div>
  );
}