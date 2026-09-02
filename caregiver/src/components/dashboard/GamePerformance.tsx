import type { GamePerformanceItem } from "@/types/dashboard";

interface GamePerformanceProps {
  items: GamePerformanceItem[];
}

function PerformanceBar({ percentage }: { percentage: number }) {
  // Accessible: use aria-valuenow, aria-valuemin, aria-valuemax
  return (
    <div className="flex items-center gap-3">
      <div
        className="flex-1 h-3 bg-surface-warm rounded-full overflow-hidden"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${percentage}%`}
      >
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            percentage >= 75
              ? "bg-secondary"
              : percentage >= 50
              ? "bg-accent-sun"
              : "bg-danger"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="text-[13px] font-semibold text-text-primary w-[40px] text-right">
        {percentage}%
      </span>
    </div>
  );
}

export default function GamePerformance({ items }: GamePerformanceProps) {
  if (items.length === 0) {
    return (
      <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
        <h3 className="text-[17px] font-semibold text-text-primary mb-4">
          Game Performance
        </h3>
        <p className="text-[14px] text-text-muted">
          No game data available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-surface rounded-[var(--radius-md)] p-5 lg:p-6">
      <h3 className="text-[17px] font-semibold text-text-primary mb-4">
        Game Performance
      </h3>

      <div className="space-y-4">
        {items.map((item) => (
          <div key={item.gameName}>
            <p className="text-[14px] font-medium text-text-primary mb-2">
              {item.gameName}
            </p>
            {item.percentage >= 0 ? (
              <PerformanceBar percentage={item.percentage} />
            ) : (
              <p className="text-[13px] text-text-muted italic">Coming soon</p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
