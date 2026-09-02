import type { QuickAction } from "@/types/dashboard";

interface QuickActionsProps {
  actions: QuickAction[];
}

export default function QuickActions({ actions }: QuickActionsProps) {
  if (actions.length === 0) return null;

  return (
    <div>
      <h3 className="text-[17px] font-semibold text-text-primary mb-4">
        Quick Actions
      </h3>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {actions.map((action) => (
          <a
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2.5 p-4 bg-surface rounded-[var(--radius-md)] text-center hover:bg-surface-warm hover:shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-smooth focus:outline-none focus:ring-2 focus:ring-primary group"
          >
            <div className="w-11 h-11 rounded-full bg-primary/8 group-hover:bg-primary/12 flex items-center justify-center transition-smooth">
              <i
                className={`fa-solid ${action.icon} text-[16px] text-primary`}
                aria-hidden="true"
              />
            </div>
            <span className="text-[13px] font-medium text-text-secondary group-hover:text-text-primary transition-smooth">
              {action.label}
            </span>
          </a>
        ))}
      </div>
    </div>
  );
}
