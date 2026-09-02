import type { ScheduleItem } from "@/types/dashboard";

interface TodayScheduleProps {
  items: ScheduleItem[];
}

function StatusBadge({ status }: { status: ScheduleItem["status"] }) {
  const styles = {
    completed:
      "bg-secondary/10 text-secondary",
    upcoming:
      "bg-accent-sun/10 text-accent-sun",
    missed:
      "bg-danger/10 text-danger",
  };

  const labels = {
    completed: "Completed",
    upcoming: "Upcoming",
    missed: "Missed",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[12px] font-medium ${styles[status]}`}
    >
      <i
        className={`fa-solid ${
          status === "completed"
            ? "fa-check"
            : status === "upcoming"
            ? "fa-clock"
            : "fa-xmark"
        } text-[10px]`}
        aria-hidden="true"
      />
      {labels[status]}
    </span>
  );
}

export default function TodaySchedule({ items }: TodayScheduleProps) {
  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
        <h3 className="text-[17px] font-semibold text-text-primary mb-4">
          Today&apos;s Schedule
        </h3>
        <p className="text-[14px] text-text-muted">
          No scheduled activities for today.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
      <h3 className="text-[17px] font-semibold text-text-primary mb-4">
        Today&apos;s Schedule
      </h3>

      <div className="space-y-0" role="list" aria-label="Today's schedule">
        {items.map((item, index) => (
          <div
            key={item.id}
            className="flex items-start gap-3 relative"
            role="listitem"
          >
            {/* Timeline line + dot */}
            <div className="flex flex-col items-center shrink-0 pt-1">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  item.status === "completed"
                    ? "bg-secondary"
                    : item.status === "upcoming"
                    ? "bg-accent-sun"
                    : "bg-danger"
                }`}
                aria-hidden="true"
              />
              {index < items.length - 1 && (
                <div className="w-px h-8 bg-text-muted/15 mt-1" aria-hidden="true" />
              )}
            </div>

            {/* Content */}
            <div className="flex-1 flex items-center justify-between gap-3 pb-4">
              <div className="min-w-0">
                <p className="text-[14px] font-medium text-text-primary">
                  {item.title}
                </p>
                <p className="text-[13px] text-text-muted">{item.time}</p>
              </div>
              <StatusBadge status={item.status} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
