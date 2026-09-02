"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { register } from "@/lib/auth/actions";
import { useI18n } from "@/lib/i18n/store";
import { FormField } from "@/components/auth/FormField";
import { PasswordField } from "@/components/auth/PasswordField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import {
  validateConfirm,
  validateEmail,
  validateName,
  validateNewPassword,
} from "@/lib/auth/validation";

type FormErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirm?: string;
  form?: string;
};

export function RegisterForm() {
  const router = useRouter();
  const { t } = useI18n();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState<FormErrors>({});
  const [busy, setBusy] = useState(false);

  const passwordHint = t("auth.passwordHint");

  function clearField(key: keyof FormErrors) {
    setErrors((prev) => ({ ...prev, [key]: undefined }));
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FormErrors = {
      name: label(validateName(name)),
      email: label(validateEmail(email)),
      password: label(validateNewPassword(password)),
      confirm: label(validateConfirm(password, confirm)),
    };

    if (
      nextErrors.name ||
      nextErrors.email ||
      nextErrors.password ||
      nextErrors.confirm
    ) {
      setErrors(nextErrors);
      return;
    }

    setErrors({});
    setBusy(true);
    void (async () => {
      const result = await register({
        name: name.trim(),
        email: email.trim(),
        password,
      });
      if (result.ok) {
        router.push("/dashboard");
        router.refresh();
        return;
      }
      setBusy(false);
      setErrors({ form: result.error.message });
    })();
  }

  function label(key: string | null): string | undefined {
    return key ? t(key) : undefined;
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-[28px] font-bold text-foreground">{t("auth.createYourAccount")}</h1>
        <p className="text-[16px] text-muted">{t("auth.setUpSub")}</p>
      </div>

      {errors.form != null && <AlertBanner message={errors.form} />}

      <FormField
        id="name"
        label={t("auth.fullName")}
        type="text"
        autoComplete="name"
        placeholder={t("auth.namePlaceholder")}
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          if (errors.name) clearField("name");
        }}
        error={errors.name}
      />

      <FormField
        id="email"
        label={t("auth.email")}
        type="email"
        autoComplete="email"
        placeholder={t("auth.emailPlaceholder")}
        value={email}
        onChange={(e) => {
          setEmail(e.target.value);
          if (errors.email) clearField("email");
        }}
        error={errors.email}
      />

      <PasswordField
        id="password"
        label={t("auth.password")}
        placeholder={t("auth.createPasswordPlaceholder")}
        autoComplete="new-password"
        hint={passwordHint}
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          if (errors.password) clearField("password");
          if (confirm) setErrors((prev) => ({ ...prev, confirm: undefined }));
        }}
        error={errors.password}
      />

      <PasswordField
        id="confirm"
        label={t("auth.confirmPassword")}
        placeholder={t("auth.confirmPasswordPlaceholder")}
        autoComplete="new-password"
        value={confirm}
        onChange={(e) => {
          setConfirm(e.target.value);
          if (errors.confirm) clearField("confirm");
        }}
        error={errors.confirm}
      />

      <p className="text-[13px] text-muted">
        {t("auth.agreeNote")}
      </p>

      <SubmitButton type="submit" busy={busy} busyLabel={t("auth.creatingAccount")}>
        <i className="fa-solid fa-user-plus text-[16px]" aria-hidden="true" />
        {t("auth.createAccount")}
      </SubmitButton>

      <p className="mt-2 text-center text-[15px] text-secondary">
        {t("auth.hasAccount")}{" "}
        <Link
          href="/login"
          className="font-semibold text-primary transition-colors hover:text-primary-dark focus:outline-none"
        >
          {t("auth.logInCta")}
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