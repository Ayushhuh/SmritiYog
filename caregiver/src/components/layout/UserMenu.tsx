"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";

export default function UserMenu() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on outside click
  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        close();
      }
    }

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        buttonRef.current?.focus();
      }
    }

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open, close]);

  function handleLogout() {
    close();
    logout();
    router.replace("/login");
  }

  // Get initials from user name
  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "?";

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2.5 px-2 py-1.5 rounded-[10px] hover:bg-surface-warm transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label="User menu"
      >
        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-secondary/15 flex items-center justify-center shrink-0">
          <span className="text-[14px] font-semibold text-secondary">
            {initials}
          </span>
        </div>
        <div className="hidden md:flex flex-col items-start">
          <span className="text-[14px] font-medium text-text-primary leading-tight">
            {user?.name ?? "Caregiver"}
          </span>
          <span className="text-[12px] text-text-muted leading-tight">
            Caregiver
          </span>
        </div>
        <i
          className={`fa-solid fa-chevron-down text-[11px] text-text-muted hidden md:block transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          ref={menuRef}
          className="absolute right-0 top-full mt-2 w-48 bg-surface rounded-[var(--radius-md)] border border-text-muted/10 shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-1.5 z-50"
          role="menu"
          aria-label="User menu"
        >
          <button
            onClick={close}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-smooth focus:outline-none focus:bg-surface-warm"
            role="menuitem"
          >
            <i className="fa-solid fa-user w-4 text-center" aria-hidden="true" />
            Profile
          </button>
          <button
            onClick={close}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-smooth focus:outline-none focus:bg-surface-warm"
            role="menuitem"
          >
            <i className="fa-solid fa-gear w-4 text-center" aria-hidden="true" />
            Settings
          </button>
          <div className="my-1.5 border-t border-text-muted/10" />
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] text-danger hover:bg-danger/5 transition-smooth focus:outline-none focus:bg-danger/5"
            role="menuitem"
          >
            <i
              className="fa-solid fa-right-from-bracket w-4 text-center"
              aria-hidden="true"
            />
            Log out
          </button>
        </div>
      )}
    </div>
  );
}
