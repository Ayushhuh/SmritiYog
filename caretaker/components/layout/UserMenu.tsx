"use client";

import { useRef, useState } from "react";
import { logout } from "@/lib/auth/actions";
import { useI18n } from "@/lib/i18n/store";
import type { CaregiverUser } from "@/lib/auth/types";

export function UserMenu({ user }: { user: CaregiverUser }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const initials = user.name
    .trim()
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div ref={menuRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex items-center gap-3 rounded-2xl px-2 py-1.5 transition-colors hover:bg-surface-warm focus:outline-none"
      >
        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-secondary text-white">
          <span className="text-[14px] font-semibold">{initials}</span>
        </span>
        <span className="hidden text-left sm:block">
          <span className="block text-[14px] font-semibold leading-tight text-foreground">
            {user.name}
          </span>
          <span className="block text-[12px] text-muted">{t("userMenu.role")}</span>
        </span>
        <i className="fa-solid fa-chevron-down text-[12px] text-muted" aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 top-full mt-2 w-56 rounded-2xl border border-border bg-surface p-1.5 shadow-sm"
        >
          <div className="border-b border-border px-3 py-2.5">
            <p className="truncate text-[14px] font-semibold text-foreground">{user.name}</p>
            <p className="truncate text-[12px] text-muted">{user.email}</p>
          </div>
          <MenuItem icon="fa-solid fa-circle-user" label={t("userMenu.profile")} onClick={() => setOpen(false)} muted />
          <MenuItem icon="fa-solid fa-gear" label={t("userMenu.settings")} onClick={() => setOpen(false)} muted />
          <div className="my-1 border-t border-border" />
          <MenuItem
            icon="fa-solid fa-right-from-bracket"
            label={t("userMenu.logout")}
            danger
            onClick={() => void logout()}
          />
        </div>
      )}
    </div>
  );
}

function MenuItem({
  icon,
  label,
  onClick,
  muted,
  danger,
}: {
  icon: string;
  label: string;
  onClick: () => void;
  muted?: boolean;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={`flex h-10 w-full items-center gap-3 rounded-xl px-3 text-[14px] font-medium transition-colors focus:outline-none ${
        danger
          ? "text-danger hover:bg-danger/5"
          : muted
            ? "text-muted hover:bg-surface-warm"
            : "text-foreground hover:bg-surface-warm"
      }`}
    >
      <i className={`${icon} w-5 text-center`} aria-hidden="true" />
      {label}
    </button>
  );
}