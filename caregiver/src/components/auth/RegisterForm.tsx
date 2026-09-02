"use client";

import { useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import FormField from "./FormField";
import PasswordField from "./PasswordField";

interface FieldErrors {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function RegisterForm() {
  const { register } = useAuth();
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const confirmPasswordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const newErrors: FieldErrors = {};
    const name = nameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";
    const confirmPassword = confirmPasswordRef.current?.value ?? "";

    if (!name) {
      newErrors.name = "Please enter your name.";
    }

    if (!email) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Please enter a password.";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don\u2019t match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    const name = nameRef.current?.value.trim() ?? "";
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    setLoading(true);
    try {
      await register(name, email, password);
    } catch (error) {
      setServerError(
        error instanceof Error ? error.message : "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      {serverError && (
        <div
          className="flex items-center gap-2 rounded-[var(--radius-md)] bg-danger/10 border border-danger/20 px-4 py-3 text-[14px] text-danger"
          role="alert"
        >
          <i className="fa-solid fa-circle-exclamation" aria-hidden="true" />
          {serverError}
        </div>
      )}

      <FormField
        ref={nameRef}
        id="register-name"
        label="Full Name"
        type="text"
        placeholder="Enter your full name"
        autoComplete="name"
        error={errors.name}
        disabled={loading}
      />

      <FormField
        ref={emailRef}
        id="register-email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        error={errors.email}
        disabled={loading}
      />

      <PasswordField
        ref={passwordRef}
        id="register-password"
        label="Password"
        placeholder="Create a password"
        autoComplete="new-password"
        error={errors.password}
        disabled={loading}
      />

      <PasswordField
        ref={confirmPasswordRef}
        id="register-confirm-password"
        label="Confirm Password"
        placeholder="Confirm your password"
        autoComplete="new-password"
        error={errors.confirmPassword}
        disabled={loading}
      />

      <button
        type="submit"
        disabled={loading}
        className="h-13 rounded-[var(--radius-md)] bg-primary text-on-primary text-[16px] font-semibold transition-smooth hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 mt-1"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            Creating account...
          </span>
        ) : (
          "Create Account"
        )}
      </button>

      <p className="text-center text-[15px] text-text-secondary mt-1">
        Already have an account?{" "}
        <a
          href="/login"
          className="text-primary font-semibold hover:text-primary-dark transition-smooth"
        >
          Log in
        </a>
      </p>
    </form>
  );
}
