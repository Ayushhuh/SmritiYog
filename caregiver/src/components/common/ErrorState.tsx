"use client";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = "Something went wrong",
  message = "We couldn't load the patient's information.",
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center mb-5">
        <i
          className="fa-solid fa-triangle-exclamation text-2xl text-danger"
          aria-hidden="true"
        />
      </div>
      <h3 className="text-[20px] font-semibold text-text-primary mb-2">
        {title}
      </h3>
      <p className="text-[15px] text-text-secondary max-w-[360px] leading-relaxed mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 h-12 px-6 rounded-[var(--radius-md)] bg-primary text-on-primary text-[15px] font-semibold transition-smooth hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          <i className="fa-solid fa-rotate-right text-sm" aria-hidden="true" />
          Try Again
        </button>
      )}
    </div>
  );
}
