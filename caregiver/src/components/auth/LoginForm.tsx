"use client";

import { useRef, useState, type FormEvent } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import FormField from "./FormField";
import PasswordField from "./PasswordField";

interface FieldErrors {
  email?: string;
  password?: string;
}

export default function LoginForm() {
  const { login } = useAuth();
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");

  function validate(): boolean {
    const newErrors: FieldErrors = {};
    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    if (!email) {
      newErrors.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!password) {
      newErrors.password = "Please enter your password.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setServerError("");

    if (!validate()) return;

    const email = emailRef.current?.value.trim() ?? "";
    const password = passwordRef.current?.value ?? "";

    setLoading(true);
    try {
      await login(email, password);
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
        ref={emailRef}
        id="login-email"
        label="Email"
        type="email"
        placeholder="Enter your email"
        autoComplete="email"
        error={errors.email}
        disabled={loading}
      />

      <PasswordField
        ref={passwordRef}
        id="login-password"
        label="Password"
        placeholder="Enter your password"
        autoComplete="current-password"
        error={errors.password}
        disabled={loading}
      />

      <div className="flex justify-end">
        <button
          type="button"
          className="text-[14px] text-primary hover:text-primary-dark font-medium transition-smooth focus:outline-none focus:ring-2 focus:ring-primary rounded px-1"
        >
          Forgot password?
        </button>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="h-13 rounded-[var(--radius-md)] bg-primary text-on-primary text-[16px] font-semibold transition-smooth hover:bg-primary-dark active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <i className="fa-solid fa-spinner fa-spin" aria-hidden="true" />
            Signing in...
          </span>
        ) : (
          "Log In"
        )}
      </button>

      <p className="text-center text-[15px] text-text-secondary mt-1">
        Don&apos;t have an account?{" "}
        <a
          href="/register"
          className="text-primary font-semibold hover:text-primary-dark transition-smooth"
        >
          Create account
        </a>
      </p>
    </form>
  );
}
