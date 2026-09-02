"use client";

import { useI18n } from "@/lib/i18n/store";

export function Brand() {
  const { t } = useI18n();
  return (
    <div className="flex flex-col items-center gap-1 text-center">
      <p className="text-[22px] font-semibold tracking-tight text-primary">
        SmritiYog <span className="text-secondary">CG</span>
      </p>
      <p className="text-[14px] font-medium text-muted">{t("brand.tagline")}</p>
    </div>
  );
}