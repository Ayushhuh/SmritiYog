import type { AttentionItem } from "@/types/dashboard";

interface AttentionListProps {
  items: AttentionItem[];
}

export default function AttentionList({ items }: AttentionListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
        <h3 className="text-[17px] font-semibold text-text-primary mb-2">
          Needs Attention
        </h3>
        <div className="flex items-center gap-2 py-3">
          <div className="w-8 h-8 rounded-full bg-secondary/10 flex items-center justify-center">
            <i className="fa-solid fa-check text-secondary text-sm" aria-hidden="true" />
          </div>
          <p className="text-[14px] text-text-muted">
            All caught up! Nothing needs your attention right now.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[17px] font-semibold text-text-primary">
          Needs Attention
        </h3>
        <span className="text-[12px] font-medium text-text-muted bg-surface-warm px-2.5 py-1 rounded-full">
          {items.length} {items.length === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="space-y-3" role="list" aria-label="Items needing attention">
        {items.map((item) => (
          <div
            key={item.id}
            className={`flex items-start gap-3 p-3 rounded-[10px] ${
              item.type === "warning"
                ? "bg-accent-sun/5 border border-accent-sun/15"
                : "bg-secondary/5 border border-secondary/15"
            }`}
            role="listitem"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                item.type === "warning"
                  ? "bg-accent-sun/15"
                  : "bg-secondary/15"
              }`}
            >
              <i
                className={`fa-solid ${
                  item.type === "warning"
                    ? "fa-triangle-exclamation"
                    : "fa-circle-info"
                } text-[13px] ${
                  item.type === "warning" ? "text-accent-sun" : "text-secondary"
                }`}
                aria-hidden="true"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-[14px] text-text-primary leading-relaxed">
                {item.message}
              </p>
            </div>

            <a
              href={item.actionHref}
              className="shrink-0 text-[13px] font-medium text-primary hover:text-primary-dark transition-smooth underline-offset-2 hover:underline focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
            >
              {item.actionLabel}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}
