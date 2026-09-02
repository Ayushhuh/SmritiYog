"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { login } from "@/lib/auth/actions";
import { useI18n } from "@/lib/i18n/store";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import {
  validateEmail,
  validatePasswordRequired,
} from "@/lib/auth/validation";

type FormErrors = {
  email?: string;
  password?: string;
  form?: string;
};

export function LoginForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [busy, setBusy] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      email: toLabel(validateEmail(email)),
      password: toLabel(validatePasswordRequired(password)),
    };

    if (nextErrors.email || nextErrors.password) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setBusy(true);
    void (async () => {
      const result = await login({ email: email.trim(), password });
      if (result.ok) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setBusy(false);
      setErrors({ form: result.error.message });
    })();
  }

  function toLabel(key: string | null): string | undefined {
    return key ? t(key) : undefined;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-foreground">{t("auth.welcomeBack")}</h1>
        <p className="text-[16px] text-muted">{t("auth.signInSub")}</p>
      </div>

      {errors.form != null && (
        <AlertBanner message={errors.form} />
      )}

      <FormField
        id="email"
        label={t("auth.email")}
        type="email"
        autoComplete="email"
        placeholder={t("auth.emailPlaceholder")}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
        }}
        error={errors.email}
      />

      <PasswordField
        id="password"
        label={t("auth.password")}
        placeholder={t("auth.passwordPlaceholder")}
        autoComplete="current-password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password)
            setErrors((prev) => ({ ...prev, password: undefined }));
        }}
        error={errors.password}
      />

      <div className="flex justify-end">
        <span className="text-[15px] font-medium text-muted cursor-not-allowed">
          {t("auth.forgot")}
        </span>
      </div>

      <SubmitButton type="submit" busy={busy} busyLabel={t("auth.signingIn")}>
        <i className="fa-solid fa-right-to-bracket text-[16px]" aria-hidden="true" />
        {t("auth.logIn")}
      </SubmitButton>

      <p className="mt-2 text-center text-[15px] text-secondary">
        {t("auth.noAccount")}{" "}
        <Link
          href="/register"
          className="font-semibold text-primary transition-colors hover:text-primary-dark focus:outline-none"
        >
          {t("auth.createAccount")}
        </Link>
      </p>
    </form>
  );
}

function AlertBanner({ message }: { message: string }) {
  return (
    <div
      role="alert"
      className="flex items-center gap-3 rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-[15px] font-medium text-danger"
    >
      <i className="fa-solid fa-circle-exclamation text-[16px]" aria-hidden="true" />
      <span>{message}</span>
    </div>
  );
}