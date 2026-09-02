"use client";

import { useCallback, useState } from "react";

import type { DashboardData, Patient } from "@/lib/dashboard/types";
import { dashboardRepository } from "@/lib/dashboard/dashboardService";
import { useI18n } from "@/lib/i18n/store";

import { Card } from "@/components/common/Card";
import { SectionTitle } from "@/components/common/SectionTitle";
import { ErrorState } from "@/components/common/ErrorState";
import { DashboardSkeleton } from "@/components/common/LoadingSkeleton";
import { PatientSelector } from "@/components/dashboard/PatientSelector";
import { PatientSummaryCard } from "@/components/dashboard/PatientSummaryCard";
import { StatCard } from "@/components/dashboard/StatCard";
import { CognitiveProgressChart } from "@/components/dashboard/CognitiveProgressChart";
import { TodaySchedule } from "@/components/dashboard/TodaySchedule";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { GamePerformance } from "@/components/dashboard/GamePerformance";
import { AttentionList } from "@/components/dashboard/AttentionList";
import { QuickActions } from "@/components/dashboard/QuickActions";

type SelectionStatus = "ready" | "loading" | "error";

export function DashboardView({
  caregiverName,
  initialPatients,
  initialPatientId,
  initialData,
}: {
  caregiverName: string;
  initialPatients: Patient[];
  initialPatientId: string;
  initialData: DashboardData | null;
}) {
  const { t } = useI18n();
  const [status, setStatus] = useState<SelectionStatus>(
    initialData ? "ready" : "error"
  );
  const [patients] = useState<Patient[]>(initialPatients);
  const [selectedPatientId, setSelectedPatientId] = useState(initialPatientId);
  const [data, setData] = useState<DashboardData | null>(initialData);

  const handleSelectPatient = useCallback(async (patientId: string) => {
    setSelectedPatientId(patientId);
    setStatus("loading");
    const patient = patients.find((p) => p.id === patientId);
    try {
      const dashboardData = await dashboardRepository.getDashboardData(
        patientId,
        patient?.name
      );
      setData(dashboardData);
      setStatus("ready");
    } catch {
      setStatus("error");
    }
  }, [patients]);

  const line = data
    ? t("dashboard.hereHow", { name: data.summary.name.split(" ")[0] })
    : t("dashboard.hereHowGeneric");

  return (
    <div className="flex flex-col gap-7">
      <DashboardHeader name={caregiverName} line={line} />

      {status === "loading" && <DashboardSkeleton />}

      {status === "error" && !data && (
        <ErrorState
          title={t("dashboard.somethingWrong")}
          description={t("dashboard.couldNotLoadPatient")}
          onRetry={() => void handleSelectPatient(selectedPatientId)}
        />
      )}

      {status !== "loading" && data && (
        <ReadyDashboard
          patients={patients}
          selectedPatientId={selectedPatientId}
          data={data}
          onSelectPatient={handleSelectPatient}
        />
      )}
    </div>
  );
}

function DashboardHeader({ name, line }: { name: string; line: string }) {
  const { t } = useI18n();
  const part = partOfDay();
  return (
    <div className="flex flex-col gap-1.5">
      <h1 className="text-[28px] font-bold text-foreground">
        {name
          ? t(`dashboard.greeting${cap(part)}`, { name: name.split(" ")[0] })
          : t("dashboard.welcome")}
      </h1>
      <p className="text-[16px] text-secondary">{line}</p>
    </div>
  );
}

function cap(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function partOfDay() {
  const h = new Date().getHours();
  if (h < 12) return "morning";
  if (h < 17) return "afternoon";
  return "evening";
}

function ReadyDashboard({
  patients,
  selectedPatientId,
  data,
  onSelectPatient,
}: {
  patients: Patient[];
  selectedPatientId: string;
  data: DashboardData;
  onSelectPatient: (id: string) => void;
}) {
  const { t } = useI18n();
  const activityNoun = data.stats.activityToday === 1
    ? t("dashboard.activityOne")
    : t("dashboard.activityMany");

  return (
    <>
      <PatientSelector
        patients={patients}
        selectedId={selectedPatientId}
        onSelect={onSelectPatient}
      />

      <PatientSummaryCard summary={data.summary} />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="fa-solid fa-check-circle"
          accent="secondary"
          label={t("dashboard.todaysActivity")}
          value={data.stats.activityToday > 0 ? t("dashboard.active") : t("dashboard.inactive")}
          caption={`${data.stats.activityToday} ${activityNoun} ${t("dashboard.activityCompleted")}`}
        />
        <StatCard
          icon="fa-solid fa-chart-line"
          accent="primary"
          label={t("dashboard.cognitivePerformance")}
          value={`${data.stats.cognitiveScore}%`}
          caption={t(data.stats.cognitivePeriod)}
        />
        <StatCard
          icon="fa-solid fa-brain"
          accent="accent"
          label={t("dashboard.gamesPlayed")}
          value={`${data.stats.gamesPlayed}`}
          caption={t(data.stats.gamesPeriod)}
        />
        <StatCard
          icon="fa-solid fa-triangle-exclamation"
          accent="info"
          label={t("dashboard.needsAttention")}
          value={`${data.stats.attentionCount}`}
          caption={t("dashboard.review")}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="lg:col-span-3">
          <div className="flex flex-col gap-4">
            <SectionTitle title={t("dashboard.cognitiveProgress")} subtitle={t("dashboard.last7Days")} />
            <CognitiveProgressChart data={data.cognitiveProgress} summary={data.cognitiveSummary} />
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <div className="flex flex-col gap-4">
            <SectionTitle title={t("dashboard.todaysSchedule")} />
            <TodaySchedule items={data.schedule} />
          </div>
        </Card>
      </div>

      <Card>
        <div className="flex flex-col gap-4">
          <SectionTitle title={t("dashboard.recentActivity")} />
          <RecentActivity items={data.recentActivity} />
        </div>
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex flex-col gap-4">
            <SectionTitle title={t("dashboard.gamePerformance")} />
            <GamePerformance items={data.gamePerformance} />
          </div>
        </Card>

        <div className="flex flex-col gap-4">
          <SectionTitle
            title={t("dashboard.needsAttention")}
            action={
              <button
                type="button"
                className="text-[14px] font-semibold text-primary transition-colors hover:text-primary-dark focus:outline-none"
              >
                {t("dashboard.viewAll")}
              </button>
            }
          />
          <AttentionList items={data.attention} />
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <SectionTitle title={t("dashboard.quickActions")} />
        <QuickActions />
      </div>
    </>
  );
}