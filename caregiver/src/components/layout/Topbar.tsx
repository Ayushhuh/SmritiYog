"use client";

import UserMenu from "./UserMenu";

interface TopbarProps {
  notificationCount?: number;
}

export default function Topbar({ notificationCount = 0 }: TopbarProps) {
  return (
    <header className="h-16 bg-surface border-b border-text-muted/10 flex items-center justify-between px-6 sticky top-0 z-40 shrink-0">
      {/* Left: mobile brand (shown below lg) */}
      <div className="flex items-center gap-3 lg:hidden">
        <div className="w-8 h-8 rounded-[8px] bg-primary flex items-center justify-center">
          <i
            className="fa-solid fa-heart-pulse text-on-primary text-xs"
            aria-hidden="true"
          />
        </div>
        <span className="text-[16px] font-bold text-text-primary">
          SmritiYog CG
        </span>
      </div>

      {/* Left: page context (shown on desktop) */}
      <div className="hidden lg:block">
        <p className="text-[13px] text-text-muted">Caregiver Dashboard</p>
      </div>

      {/* Right: notifications + user */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button
          className="relative w-10 h-10 rounded-[10px] flex items-center justify-center text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label={`Notifications${notificationCount > 0 ? `, ${notificationCount} unread` : ""}`}
        >
          <i className="fa-solid fa-bell text-[17px]" aria-hidden="true" />
          {notificationCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-[18px] h-[18px] rounded-full bg-danger text-on-primary text-[10px] font-bold flex items-center justify-center leading-none">
              {notificationCount > 9 ? "9+" : notificationCount}
            </span>
          )}
        </button>

        {/* Divider */}
        <div className="w-px h-6 bg-text-muted/15 hidden sm:block" />

        {/* User menu */}
        <UserMenu />
      </div>
    </header>
  );
}
