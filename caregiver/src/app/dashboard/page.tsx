"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { useRouter } from "next/navigation";
import { dashboardService } from "@/lib/dashboard/dashboardService";
import { patientService } from "@/lib/patients/patientService";
import DashboardShell from "@/components/layout/DashboardShell";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import PatientSummaryCard from "@/components/dashboard/PatientSummaryCard";
import StatCard from "@/components/dashboard/StatCard";
import CognitiveProgressChart from "@/components/dashboard/CognitiveProgressChart";
import TodaySchedule from "@/components/dashboard/TodaySchedule";
import RecentActivity from "@/components/dashboard/RecentActivity";
import GamePerformance from "@/components/dashboard/GamePerformance";
import AttentionList from "@/components/dashboard/AttentionList";
import QuickActions from "@/components/dashboard/QuickActions";
import { DashboardSkeleton } from "@/components/common/LoadingSkeleton";
import EmptyState from "@/components/common/EmptyState";
import ErrorState from "@/components/common/ErrorState";
import type {
  Patient,
  DashboardStats,
  CognitiveProgressPoint,
  ScheduleItem,
  GameActivity,
  GamePerformanceItem,
  AttentionItem,
  QuickAction,
} from "@/types/dashboard";

export default function DashboardPage() {
  const { user, loading: authLoading, isAuthenticated } = useAuth();
  const router = useRouter();

  // Data state
  const [patients, setPatients] = useState<Patient[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<number | null>(
    null
  );
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [cognitiveProgress, setCognitiveProgress] = useState<
    CognitiveProgressPoint[]
  >([]);
  const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
  const [recentActivity, setRecentActivity] = useState<GameActivity[]>([]);
  const [gamePerformance, setGamePerformance] = useState<
    GamePerformanceItem[]
  >([]);
  const [attentionItems, setAttentionItems] = useState<AttentionItem[]>([]);
  const [quickActions, setQuickActions] = useState<QuickAction[]>([]);

  // Loading & error state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Redirect if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.replace("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  // Load patients
  useEffect(() => {
    if (!isAuthenticated) return;

    patientService
      .getPatients()
      .then((p) => {
        setPatients(p);
        if (p.length > 0) {
          setSelectedPatientId(p[0].id);
        }
      })
      .catch(() => {
        setError("Failed to load patients.");
      });
  }, [isAuthenticated]);

  // Load dashboard data for selected patient
  const loadDashboardData = useCallback(async (patientId: number) => {
    setLoading(true);
    setError(null);

    try {
      const [
        patientStats,
        progress,
        scheduleData,
        activity,
        performance,
        attention,
        actions,
      ] = await Promise.all([
        dashboardService.getDashboardStats(patientId),
        dashboardService.getCognitiveProgress(patientId),
        dashboardService.getTodaySchedule(patientId),
        dashboardService.getRecentActivity(patientId),
        dashboardService.getGamePerformance(patientId),
        dashboardService.getAttentionItems(patientId),
        dashboardService.getQuickActions(),
      ]);

      setStats(patientStats);
      setCognitiveProgress(progress);
      setSchedule(scheduleData);
      setRecentActivity(activity);
      setGamePerformance(performance);
      setAttentionItems(attention);
      setQuickActions(actions);
    } catch {
      setError("Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (selectedPatientId) {
      loadDashboardData(selectedPatientId);
    } else if (patients.length === 0 && !loading) {
      setLoading(false);
    }
  }, [selectedPatientId, loadDashboardData, patients.length, loading]);

  // Auth loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <i
            className="fa-solid fa-spinner fa-spin text-2xl text-primary"
            aria-hidden="true"
          />
          <p className="text-[15px] text-text-secondary">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const selectedPatient = patients.find((p) => p.id === selectedPatientId);
  const hasPatients = patients.length > 0;

  // Count unread notifications from attention items
  const notificationCount = attentionItems.length;

  return (
    <DashboardShell notificationCount={notificationCount}>
      {/* Loading state */}
      {loading && hasPatients ? (
        <DashboardSkeleton />
      ) : error ? (
        <ErrorState
          onRetry={() => {
            if (selectedPatientId) {
              loadDashboardData(selectedPatientId);
            }
          }}
        />
      ) : !hasPatients ? (
        /* Empty state: no patients */
        <div className="mt-8">
          <EmptyState
            icon="fa-user-plus"
            title="Add your first patient"
            description="Connect a patient to start seeing their activity and progress here."
            actionLabel="Add Patient"
            actionHref="/dashboard/patients/new"
          />
        </div>
      ) : (
        /* Dashboard content */
        <div className="space-y-6">
          {/* Header with greeting + patient selector */}
          <DashboardHeader
            caregiverName={user.name}
            patient={selectedPatient ?? null}
            patients={patients}
            onPatientChange={setSelectedPatientId}
          />

          {/* Patient summary */}
          {selectedPatient && (
            <PatientSummaryCard patient={selectedPatient} />
          )}

          {/* KPI Cards */}
          {stats && (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label="Today's Activity"
                value={stats.activityToday}
                subtitle={stats.activityTodayLabel}
                icon="fa-check"
                iconColor="text-secondary"
                iconBg="bg-secondary/10"
              />
              <StatCard
                label="Cognitive Score"
                value={`${stats.cognitiveScore}%`}
                subtitle={stats.cognitiveScoreLabel}
                icon="fa-brain"
                iconColor="text-primary"
                iconBg="bg-primary/10"
              />
              <StatCard
                label="Games Played"
                value={stats.gamesPlayed}
                subtitle={stats.gamesPlayedLabel}
                icon="fa-gamepad"
                iconColor="text-accent-sun"
                iconBg="bg-accent-sun/10"
              />
              <StatCard
                label="Needs Attention"
                value={stats.attentionCount}
                subtitle={stats.attentionCountLabel}
                icon="fa-triangle-exclamation"
                iconColor="text-danger"
                iconBg="bg-danger/10"
              />
            </div>
          )}

          {/* Cognitive Progress + Today's Schedule */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {cognitiveProgress.length > 0 && (
              <CognitiveProgressChart data={cognitiveProgress} />
            )}
            <TodaySchedule items={schedule} />
          </div>

          {/* Recent Activity */}
          <RecentActivity activities={recentActivity} />

          {/* Game Performance + Needs Attention */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <GamePerformance items={gamePerformance} />
            <AttentionList items={attentionItems} />
          </div>

          {/* Quick Actions */}
          <QuickActions actions={quickActions} />
        </div>
      )}
    </DashboardShell>
  );
}
