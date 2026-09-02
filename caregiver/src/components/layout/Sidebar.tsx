"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  label: string;
  icon: string;
  href: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", icon: "fa-house", href: "/dashboard" },
  { label: "Patients", icon: "fa-user", href: "/dashboard/patients" },
  { label: "Games", icon: "fa-brain", href: "/dashboard/games" },
  { label: "Reminders", icon: "fa-calendar-check", href: "/dashboard/reminders" },
  { label: "Voice", icon: "fa-microphone", href: "/dashboard/voice" },
  { label: "Settings", icon: "fa-gear", href: "/dashboard/settings" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className="hidden lg:flex flex-col w-[250px] bg-surface border-r border-text-muted/10 h-screen sticky top-0 shrink-0"
        role="navigation"
        aria-label="Main navigation"
      >
        {/* Brand */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-text-muted/10">
          <div className="w-9 h-9 rounded-[10px] bg-primary flex items-center justify-center shrink-0">
            <i
              className="fa-solid fa-heart-pulse text-on-primary text-sm"
              aria-hidden="true"
            />
          </div>
          <span className="text-[17px] font-bold text-text-primary tracking-tight">
            SmritiYog CG
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex-1 py-4 px-3 flex flex-col gap-1">
          {navItems.map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-[15px] font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary ${
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-text-secondary hover:bg-surface-warm hover:text-text-primary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <i className={`fa-solid ${item.icon} w-5 text-center text-[15px]`} aria-hidden="true" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-text-muted/10">
          <p className="text-[12px] text-text-muted">SmritiYog CG v0.1</p>
        </div>
      </aside>

      {/* Mobile bottom navigation */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-text-muted/10 z-50 safe-area-bottom"
        role="navigation"
        aria-label="Mobile navigation"
      >
        <div className="flex items-center justify-around h-16 px-2">
          {navItems.slice(0, 5).map((item) => {
            const isActive =
              item.href === "/dashboard"
                ? pathname === "/dashboard"
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex flex-col items-center gap-1 px-2 py-1.5 rounded-lg transition-smooth focus:outline-none focus:ring-2 focus:ring-primary min-w-[48px] ${
                  isActive
                    ? "text-primary"
                    : "text-text-muted hover:text-text-secondary"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                <i className={`fa-solid ${item.icon} text-[18px]`} aria-hidden="true" />
                <span className="text-[11px] font-medium">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </>
  );
}
