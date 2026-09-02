import type { GameActivity } from "@/types/dashboard";

interface RecentActivityProps {
  activities: GameActivity[];
}

function formatActivityTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMinutes = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `Today, ${displayHours}:${displayMinutes} ${ampm}`;
  }

  // Yesterday
  if (diffHours < 48) {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes.toString().padStart(2, "0");
    return `Yesterday, ${displayHours}:${displayMinutes} ${ampm}`;
  }

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function ScoreDisplay({ score, total }: { score?: number; total?: number }) {
  if (score === undefined || total === undefined) {
    return (
      <span className="text-[13px] font-medium text-secondary">
        Completed
      </span>
    );
  }

  const percentage = Math.round((score / total) * 100);
  const color =
    percentage >= 75
      ? "text-secondary"
      : percentage >= 50
      ? "text-accent-sun"
      : "text-danger";

  return (
    <span className={`text-[13px] font-semibold ${color}`}>
      {score} / {total}
    </span>
  );
}

export default function RecentActivity({ activities }: RecentActivityProps) {
  if (activities.length === 0) {
    return (
      <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
        <h3 className="text-[17px] font-semibold text-text-primary mb-4">
          Recent Activity
        </h3>
        <p className="text-[14px] text-text-muted">
          No recent activity to show.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
      <h3 className="text-[17px] font-semibold text-text-primary mb-4">
        Recent Activity
      </h3>

      <div className="space-y-0 divide-y divide-text-muted/10">
        {activities.map((activity) => (
          <div
            key={activity.id}
            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
          >
            {/* Icon */}
            <div className="w-9 h-9 rounded-full bg-surface-warm flex items-center justify-center shrink-0">
              <i
                className={`fa-solid ${activity.gameIcon} text-[14px] text-text-muted`}
                aria-hidden="true"
              />
            </div>

            {/* Game name */}
            <div className="flex-1 min-w-0">
              <p className="text-[14px] font-medium text-text-primary truncate">
                {activity.gameType}
              </p>
            </div>

            {/* Score */}
            <div className="shrink-0">
              <ScoreDisplay score={activity.score} total={activity.total} />
            </div>

            {/* Time */}
            <div className="hidden sm:block shrink-0 w-[140px] text-right">
              <span className="text-[13px] text-text-muted">
                {formatActivityTime(activity.completedAt)}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
