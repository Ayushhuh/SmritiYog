"use client";

import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex bg-background">
      {/* Left branding column — hidden on mobile */}
      <div className="hidden lg:flex lg:w-[45%] bg-surface-warm flex-col items-center justify-center px-12 py-16">
        <div className="max-w-md flex flex-col items-center text-center gap-6">
          {/* Logo mark */}
          <div className="w-20 h-20 rounded-[var(--radius-lg)] bg-primary flex items-center justify-center">
            <i className="fa-solid fa-heart-pulse text-3xl text-on-primary" aria-hidden="true" />
          </div>

          <h1 className="text-[36px] font-bold text-text-primary leading-tight">
            SmritiYog CG
          </h1>

          <p className="text-[18px] text-text-secondary leading-relaxed">
            Join as a caregiver to support your loved ones.
          </p>

          <div className="mt-8 flex flex-col gap-4 text-left w-full">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-user-plus text-primary text-sm" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-text-primary">Create your account</p>
                <p className="text-[14px] text-text-muted">Quick and easy registration</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-link text-primary text-sm" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-text-primary">Connect with patients</p>
                <p className="text-[14px] text-text-muted">Link your family members</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <i className="fa-solid fa-eye text-primary text-sm" aria-hidden="true" />
              </div>
              <div>
                <p className="text-[15px] font-medium text-text-primary">Monitor &amp; support</p>
                <p className="text-[14px] text-text-muted">Track cognitive health progress</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right form column */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12 lg:px-16">
        <div className="w-full max-w-[420px]">
          {/* Mobile-only branding */}
          <div className="flex flex-col items-center mb-8 lg:hidden">
            <div className="w-14 h-14 rounded-[var(--radius-md)] bg-primary flex items-center justify-center mb-4">
              <i className="fa-solid fa-heart-pulse text-2xl text-on-primary" aria-hidden="true" />
            </div>
            <h1 className="text-[24px] font-bold text-text-primary">
              SmritiYog CG
            </h1>
          </div>

          {/* Form card */}
          <div className="bg-surface rounded-[var(--radius-lg)] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.06)]">
            <div className="mb-6">
              <h2 className="text-[24px] font-bold text-text-primary">
                Create your account
              </h2>
              <p className="text-[15px] text-text-secondary mt-1">
                Get started with SmritiYog CG
              </p>
            </div>

            <RegisterForm />
          </div>

          <p className="text-center text-[13px] text-text-muted mt-6">
            SmritiYog CG &mdash; Caregiver Dashboard
          </p>
        </div>
      </div>
    </div>
  );
}
