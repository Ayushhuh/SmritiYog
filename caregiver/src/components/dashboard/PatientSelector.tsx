"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import type { Patient } from "@/types/dashboard";

interface PatientSelectorProps {
  patients: Patient[];
  selectedId: number | null;
  onChange: (patientId: number) => void;
}

export default function PatientSelector({
  patients,
  selectedId,
  onChange,
}: PatientSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const close = useCallback(() => setOpen(false), []);

  const selected = patients.find((p) => p.id === selectedId);

  useEffect(() => {
    if (!open) return;

    function handleClick(e: MouseEvent) {
      if (
        ref.current &&
        !ref.current.contains(e.target as Node) &&
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

  function handleSelect(id: number) {
    onChange(id);
    close();
  }

  if (patients.length === 0) return null;

  return (
    <div className="relative" ref={ref}>
      <label className="block text-[12px] font-medium text-text-muted mb-1 uppercase tracking-wide">
        Patient
      </label>
      <button
        ref={buttonRef}
        onClick={() => setOpen(!open)}
        className="flex items-center gap-2 h-11 min-w-[200px] px-4 rounded-[10px] bg-surface border border-text-muted/15 text-[15px] font-medium text-text-primary hover:border-text-muted/30 transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <i
          className="fa-solid fa-user text-[13px] text-text-muted"
          aria-hidden="true"
        />
        <span className="flex-1 text-left truncate">
          {selected?.full_name ?? "Select patient"}
        </span>
        <i
          className={`fa-solid fa-chevron-down text-[11px] text-text-muted transition-transform ${
            open ? "rotate-180" : ""
          }`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          className="absolute right-0 top-full mt-1.5 w-full min-w-[220px] bg-surface rounded-[10px] border border-text-muted/10 shadow-[0_4px_12px_rgba(0,0,0,0.08)] py-1.5 z-50"
          role="listbox"
          aria-label="Select patient"
        >
          {patients.map((patient) => (
            <li key={patient.id} role="option" aria-selected={patient.id === selectedId}>
              <button
                onClick={() => handleSelect(patient.id)}
                className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[14px] transition-smooth focus:outline-none ${
                  patient.id === selectedId
                    ? "bg-primary/5 text-primary font-medium"
                    : "text-text-secondary hover:bg-surface-warm hover:text-text-primary"
                }`}
              >
                <i
                  className={`fa-solid ${
                    patient.id === selectedId
                      ? "fa-circle-check"
                      : "fa-circle"
                  } text-[11px] ${
                    patient.id === selectedId ? "text-primary" : "text-text-muted/40"
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate">{patient.full_name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
