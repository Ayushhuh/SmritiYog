"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { useI18n } from "@/lib/i18n/store";
import { localeLabels } from "@/lib/i18n/config";
import { PATIENT_LANGUAGES, PATIENT_RELATIONSHIPS } from "@/lib/patients/types";
import { createPatientFromFields } from "@/lib/patients/actions";
import type { PatientErrorKind, Patient } from "@/lib/patients/types";
import { FormField } from "@/components/auth/FormField";
import { SubmitButton } from "@/components/auth/SubmitButton";
import { Card } from "@/components/common/Card";

type FormValues = {
  fullName: string;
  preferredName: string;
  dateOfBirth: string;
  preferredLanguage: string;
  relationship: string;
};

type FieldErrors = {
  fullName?: string;
  form?: string;
};

export function AddPatientForm() {
  const { t } = useI18n();
  const [values, setValues] = useState<FormValues>({
    fullName: "",
    preferredName: "",
    dateOfBirth: "",
    preferredLanguage: "en",
    relationship: "child",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [busy, setBusy] = useState(false);
  const [added, setAdded] = useState<Patient | null>(null);

  function update(field: keyof FormValues, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }));
    if (field === "fullName" && errors.fullName) {
      setErrors((prev) => ({ ...prev, fullName: undefined }));
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!values.fullName.trim()) {
      setErrors({ fullName: t("patients.requiredError") });
      return;
    }
    setErrors({});
    setBusy(true);
    void (async () => {
      const result = await createPatientFromFields(
        values.fullName,
        values.preferredName,
        values.dateOfBirth,
        values.preferredLanguage,
        values.relationship
      );
      setBusy(false);
      if (result.ok) {
        setAdded(result.patient);
        return;
      }
      setErrors({ form: errorLabel(result.error.kind) });
    })();
  }

  function errorLabel(kind: PatientErrorKind): string {
    switch (kind) {
      case "unauthorized":
        return t("patients.errorUnauthorized");
      case "permission":
        return t("patients.errorPermission");
      case "validation":
        return t("patients.errorValidation");
      case "duplicate":
        return t("patients.errorDuplicate");
      case "not-found":
      case "unknown":
      case "network":
        return t("patients.errorGeneric");
    }
  }

  if (added) {
    return <AddPatientSuccess patient={added} />;
  }

  return (
    <Card className="max-w-2xl">
      <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5">
        <div className="flex flex-col gap-1.5">
          <h1 className="text-[28px] font-bold text-foreground">
            {t("patients.addPatientTitle")}
          </h1>
          <p className="text-[16px] text-muted">{t("patients.addPatientSub")}</p>
        </div>

        {errors.form != null && (
          <div
            role="alert"
            className="flex items-center gap-3 rounded-2xl border border-danger/40 bg-danger/5 px-4 py-3 text-[15px] font-medium text-danger"
          >
            <i className="fa-solid fa-circle-exclamation text-[16px]" aria-hidden="true" />
            <span>{errors.form}</span>
          </div>
        )}

        <FormField
          id="fullName"
          label={t("patients.fullName")}
          placeholder={t("patients.fullNamePlaceholder")}
          value={values.fullName}
          onChange={(e) => update("fullName", e.target.value)}
          error={errors.fullName}
          autoComplete="off"
        />

        <FormField
          id="preferredName"
          label={t("patients.preferredName")}
          placeholder={t("patients.preferredNamePlaceholder")}
          hint={t("patients.preferredNameHint")}
          value={values.preferredName}
          onChange={(e) => update("preferredName", e.target.value)}
          autoComplete="off"
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <SelectField
            id="preferredLanguage"
            label={t("patients.preferredLanguage")}
            value={values.preferredLanguage}
            onChange={(value) => update("preferredLanguage", value)}
            options={PATIENT_LANGUAGES.map((lang) => ({
              value: lang.value,
              label: localeLabels[lang.value].native,
            }))}
          />
          <SelectField
            id="relationship"
            label={t("patients.relationship")}
            value={values.relationship}
            onChange={(value) => update("relationship", value)}
            options={PATIENT_RELATIONSHIPS.map((rel) => ({
              value: rel.value,
              label: t(`patients.rel_${rel.value}`),
            }))}
          />
        </div>

        <FormField
          id="dateOfBirth"
          label={t("patients.dateOfBirth")}
          type="date"
          hint={t("patients.dateOfBirthHint")}
          value={values.dateOfBirth}
          onChange={(e) => update("dateOfBirth", e.target.value)}
        />

        <p className="text-[14px] text-secondary">
          {t("patients.pairComingSoon")}
        </p>

        <SubmitButton type="submit" busy={busy} busyLabel={t("patients.adding")}>
          <i className="fa-solid fa-user-plus text-[16px]" aria-hidden="true" />
          {t("patients.add")}
        </SubmitButton>
      </form>
    </Card>
  );
}

function SelectField({
  id,
  label,
  value,
  onChange,
  options,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <label htmlFor={id} className="text-[16px] font-semibold text-foreground">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-2xl border-2 border-border bg-surface px-4 text-[16px] text-foreground transition-colors focus:border-ring focus:outline-none"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export function AddPatientSuccess({ patient }: { patient: Patient }) {
  const { t } = useI18n();
  const router = useRouter();
  return (
    <Card className="max-w-2xl">
      <div className="flex flex-col items-center gap-5 text-center">
        <span
          className="flex h-16 w-16 items-center justify-center rounded-2xl text-white"
          style={{ backgroundColor: "var(--primary)" }}
          aria-hidden="true"
        >
          <i className="fa-solid fa-check text-[30px]" />
        </span>
        <div className="flex flex-col gap-2">
          <h1 className="text-[26px] font-bold text-foreground">
            {t("patients.successTitle")}
          </h1>
          <p className="text-[16px] text-secondary">
            {t("patients.successSub").replace("{{name}}", patient.preferred_name || patient.full_name)}
          </p>
        </div>
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <SubmitButton
            type="button"
            busy={false}
            busyLabel=""
            onClick={() => {
              router.push("/dashboard");
              router.refresh();
            }}
          >
            <i className="fa-solid fa-house text-[16px]" aria-hidden="true" />
            {t("patients.goToDashboard")}
          </SubmitButton>
          <Link
            href={`/patients/${patient.id}`}
            className="flex h-[52px] items-center justify-center gap-2 rounded-2xl border-2 border-secondary px-6 text-[16px] font-semibold text-secondary transition-colors hover:bg-secondary/5 focus:outline-none sm:w-1/2"
          >
            {t("patients.viewPatient")}
          </Link>
        </div>
      </div>
    </Card>
  );
}