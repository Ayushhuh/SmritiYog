interface StatCardProps {
  label: string;
  value: string | number;
  subtitle: string;
  icon: string;
  iconColor?: string;
  iconBg?: string;
}

export default function StatCard({
  label,
  value,
  subtitle,
  icon,
  iconColor = "text-primary",
  iconBg = "bg-primary/10",
}: StatCardProps) {
  return (
    <div className="bg-surface rounded-[var(--radius-md)] p-5 flex flex-col gap-3 hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-smooth">
      <div className="flex items-center gap-3">
        <div
          className={`w-10 h-10 rounded-[10px] ${iconBg} flex items-center justify-center shrink-0`}
        >
          <i className={`fa-solid ${icon} text-[15px] ${iconColor}`} aria-hidden="true" />
        </div>
        <span className="text-[13px] font-medium text-text-muted uppercase tracking-wide">
          {label}
        </span>
      </div>
      <div>
        <p className="text-[28px] font-bold text-text-primary leading-none">
          {value}
        </p>
        <p className="text-[13px] text-text-muted mt-1.5">{subtitle}</p>
      </div>
    </div>
  );
}
