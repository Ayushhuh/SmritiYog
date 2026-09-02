"use client";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

interface DashboardShellProps {
  children: React.ReactNode;
  notificationCount?: number;
}

export default function DashboardShell({
  children,
  notificationCount = 0,
}: DashboardShellProps) {
  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar (desktop: persistent, mobile: bottom nav) */}
      <Sidebar />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-h-screen">
        <Topbar notificationCount={notificationCount} />

        {/* Content area */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
