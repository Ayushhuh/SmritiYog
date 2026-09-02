"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import FormField from "@/components/auth/FormField";
import PasswordField from "@/components/auth/PasswordField";
import { patientService } from "@/lib/patients/patientService";
import type { Patient } from "@/types/dashboard";

interface FieldErrors {
  full_name?: string;
  password?: string;
  confirmPassword?: string;
}

type FormState = "idle" | "submitting" | "success" | "error";

export default function AddPatientForm() {
  const router = useRouter();
  const fullNameRef = useRef<HTMLInputElement>(null);
  const preferredNameRef = useRef<HTMLInputElement>(null);
  const dobRef = useRef<HTMLInputElement>(null);
  const genderRef = useRef<HTMLSelectElement>(null);
  const languageRef = useRef<HTMLSelectElement>(null);
  const phoneRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [formState, setFormState] = useState<FormState>("idle");
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [createdPatient, setCreatedPatient] = useState<Patient | null>(null);

  function validate(): boolean {
    const newErrors: FieldErrors = {};

    const fullName = fullNameRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";
    const confirmPassword = confirmPasswordRef.current?.value ?? "";

    if (!fullName) {
      newErrors.full_name = "Please enter the patient's full name.";
    }

    if (!password) {
      newErrors.password = "Please enter an initial password.";
    } else if (password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm the password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    setFormState("submitting");

    try {
      const patient = await patientService.createPatient({
        full_name: fullNameRef.current?.value.trim() ?? "",
        preferred_name: preferredNameRef.current?.value.trim() ?? "",
        date_of_birth: dobRef.current?.value ?? "",
        gender: genderRef.current?.value ?? "",
        preferred_language: languageRef.current?.value ?? "en",
        phone_number: phoneRef.current?.value.trim() ?? "",
        password: passwordRef.current?.value ?? "",
      });

      setCreatedPatient(patient);
      setFormState("success");
    } catch (error) {
      setServerError(
        error instanceof Error
          ? error.message
          : "We couldn't create this patient. Please try again."
      );
      setFormState("error");
    }
  }

  // Success state
  if (formState === "success" && createdPatient) {
    return (
      <div className="text-center py-8">
        <div className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center mx-auto mb-5">
          <i className="fa-solid fa-check text-2xl text-secondary" aria-hidden="true" />
        </div>
        <h2 className="text-[22px] font-bold text-text-primary mb-2">
          Patient Created Successfully
        </h2>
        <p className="text-[15px] text-text-secondary mb-1">
          {createdPatient.preferred_name || createdPatient.full_name}
        </p>

        <div className="mt-6 inline-block">
          <p className="text-[13px] text-text-muted uppercase tracking-wide mb-2">
            Patient UID
          </p>
          <div className="bg-surface-warm rounded-[var(--radius-md)] px-8 py-4">
            <span className="text-[32px] font-bold text-text-primary tracking-[0.15em]">
              {createdPatient.uid}
            </span>
          </div>
        </div>

        <p className="text-[14px] text-text-secondary mt-5 mb-6">
          The patient account has been created. Password set successfully.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText(createdPatient.uid);
            }}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-[10px] border border-text-muted/20 text-[14px] font-medium text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <i className="fa-solid fa-copy text-sm" aria-hidden="true" />
            Copy UID
          </button>
          <button
            onClick={() => router.push(`/dashboard/patients/${createdPatient.id}`)}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-[10px] bg-primary text-on-primary text-[14px] font-semibold transition-smooth hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            <i className="fa-solid fa-user text-sm" aria-hidden="true" />
            View Patient
          </button>
          <button
            onClick={() => {
              setCreatedPatient(null);
              setFormState("idle");
              // Reset form fields
              if (fullNameRef.current) fullNameRef.current.value = "";
              if (preferredNameRef.current) preferredNameRef.current.value = "";
              if (dobRef.current) dobRef.current.value = "";
              if (genderRef.current) genderRef.current.value = "";
              if (languageRef.current) languageRef.current.value = "en";
              if (phoneRef.current) phoneRef.current.value = "";
              if (passwordRef.current) passwordRef.current.value = "";
              if (confirmPasswordRef.current) confirmPasswordRef.current.value = "";
            }}
            className="inline-flex items-center gap-2 h-11 px-5 rounded-[10px] border border-text-muted/20 text-[14px] font-medium text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <i className="fa-solid fa-plus text-sm" aria-hidden="true" />
            Add Another Patient
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-6">
      {serverError && (
        <div
          className="flex items-center gap-2 rounded-[var(--radius-md)] bg-danger/10 border border-danger/20 px-4 py-3 text-[14px] text-danger"
          role="alert"
        >
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
          {serverError}
        </div>
      )}

      {/* Patient Information Section */}
      <div>
        <h3 className="text-[16px] font-semibold text-text-primary mb-4 flex items-center gap-2">
          <i className="fa-solid fa-user text-[14px] text-primary" aria-hidden="true" />
          Patient Information
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            ref={fullNameRef}
            id="patient-full-name"
            label="Full Name"
            placeholder="e.g. Ramesh Sharma"
            autoComplete="name"
            error={errors.full_name}
            disabled={formState === "submitting"}
          />

          <FormField
            ref={preferredNameRef}
            id="patient-preferred-name"
            label="Preferred Name"
            placeholder="e.g. Ramesh"
            autoComplete="nickname"
            disabled={formState === "submitting"}
          />

          <FormField
            ref={dobRef}
            id="patient-dob"
            label="Date of Birth"
            type="date"
            disabled={formState === "submitting"}
          />

          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="patient-gender"
              className="text-[15px] font-medium text-text-primary"
            >
              Gender
            </label>
            <select
              ref={genderRef}
              id="patient-gender"
              className="h-12 rounded-[var(--radius-md)] border border-text-muted/30 bg-surface px-4 text-[16px] text-text-primary transition-smooth hover:border-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={formState === "submitting"}
            >
              <option value="">Select gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer_not_to_say">Prefer not to say</option>
            </select>
          </div>

          <div className="flex flex-col gap-[6px]">
            <label
              htmlFor="patient-language"
              className="text-[15px] font-medium text-text-primary"
            >
              Preferred Language
            </label>
            <select
              ref={languageRef}
              id="patient-language"
              className="h-12 rounded-[var(--radius-md)] border border-text-muted/30 bg-surface px-4 text-[16px] text-text-primary transition-smooth hover:border-text-muted/50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              disabled={formState === "submitting"}
              defaultValue="en"
            >
              <option value="en">English</option>
              <option value="hi">Hindi</option>
              <option value="as">Assamese</option>
              <option value="bn">Bengali</option>
              <option value="mni">Meitei</option>
            </select>
          </div>

          <FormField
            ref={phoneRef}
            id="patient-phone"
            label="Phone Number"
            type="tel"
            placeholder="+91XXXXXXXXXX"
            autoComplete="tel"
            disabled={formState === "submitting"}
          />
        </div>
      </div>

      {/* Authentication Section */}
      <div>
        <h3 className="text-[16px] font-semibold text-text-primary mb-4 flex items-center gap-2">
          <i className="fa-solid fa-shield-halved text-[14px] text-primary" aria-hidden="true" />
          Authentication
        </h3>

        {/* UID - auto-generated, not editable */}
        <div className="flex flex-col gap-[6px] mb-4">
          <label className="text-[15px] font-medium text-text-primary">
            Patient UID
          </label>
          <div className="h-12 rounded-[var(--radius-md)] border border-text-muted/15 bg-surface-warm px-4 flex items-center">
            <i className="fa-solid fa-lock text-[13px] text-text-muted mr-2" aria-hidden="true" />
            <span className="text-[14px] text-text-muted">
              Auto-generated after creation
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <PasswordField
            ref={passwordRef}
            id="patient-password"
            label="Initial Password"
            placeholder="Minimum 8 characters"
            autoComplete="new-password"
            error={errors.password}
            disabled={formState === "submitting"}
          />

          <PasswordField
            ref={confirmPasswordRef}
            id="patient-confirm-password"
            label="Confirm Password"
            placeholder="Re-enter password"
            autoComplete="new-password"
            error={errors.confirmPassword}
            disabled={formState === "submitting"}
          />
        </div>
      </div>

      {/* Submit */}
      <div className="flex items-center gap-3 pt-2">
        <button
          type="submit"
          disabled={formState === "submitting"}
          className="h-13 px-8 rounded-[var(--radius-md)] bg-primary text-on-primary text-[16px] font-semibold transition-smooth hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
        >
          {formState === "submitting" ? (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
              Creating patient...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <i className="fa-solid fa-user-plus text-sm" aria-hidden="true" />
              Create Patient
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => router.back()}
          disabled={formState === "submitting"}
          className="h-13 px-6 rounded-[var(--radius-md)] border border-text-muted/20 text-[15px] font-medium text-text-secondary hover:bg-surface-warm hover:text-text-primary transition-smooth focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-60"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
