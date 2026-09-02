import type {
  AttentionItem,
  ActivityRow,
  CognitiveProgressPoint,
  DashboardData,
  DashboardHydration,
  DashboardStats,
  GamePerformanceRow,
  Patient,
  PatientSummary,
  ScheduleItem,
} from "@/lib/dashboard/types";

// ─────────────────────────────────────────────────────────────────────────────
// Mock data provider.
// This module simulates the SmritiYog backend analytics API so the dashboard
// can be built and tested before the real endpoints are wired up. Replace the
// dashboardService implementation with real API calls when they are available.
// Do NOT scatter mock values across the UI — they live only here.
// Localized human-readable strings are stored as i18n keys (e.g. "content.*")
// and resolved through the translator, so the UI can switch languages.
// ─────────────────────────────────────────────────────────────────────────────

const COGNITIVE_PROGRESS: CognitiveProgressPoint[] = [
  { day: "content.day_mon", score: 72 },
  { day: "content.day_tue", score: 75 },
  { day: "content.day_wed", score: 68 },
  { day: "content.day_thu", score: 81 },
  { day: "content.day_fri", score: 79 },
  { day: "content.day_sat", score: 84 },
  { day: "content.day_sun", score: 78 },
];

interface MockPatientRecord {
  patient: Patient;
}

const patientsRecords: MockPatientRecord[] = [
  { patient: { id: "p-ramesh", name: "Ramesh Sharma", initials: "RS", connectedDaysAgo: 24 } },
  { patient: { id: "p-meena", name: "Meena Sharma", initials: "MS", connectedDaysAgo: 12 } },
];

function buildData(
  patient: Patient,
  perPatient: {
    lastActiveLabel: string;
    activityToday: number;
    cognitiveScore: number;
    gamesPlayed: number;
    attentionCount: number;
    attention: AttentionItem[];
    resultScoreToday: string;
  }
): DashboardData {
  return {
    summary: {
      patientId: patient.id,
      name: patient.name,
      initials: patient.initials,
      lastActiveLabel: perPatient.lastActiveLabel,
      lastActiveAt: "content.lastActiveAt",
      connectedLabel: "content.connectedDays",
      connectedDaysAgo: patient.connectedDaysAgo,
    },
    stats: {
      activityToday: perPatient.activityToday,
      activityStatus: perPatient.activityToday > 0 ? "active" : "no_activity",
      cognitiveScore: perPatient.cognitiveScore,
      cognitivePeriod: "stat.thisWeek",
      gamesPlayed: perPatient.gamesPlayed,
      gamesPeriod: "stat.today",
      attentionCount: perPatient.attentionCount,
    } satisfies DashboardStats,
    cognitiveProgress: COGNITIVE_PROGRESS,
    cognitiveSummary: "content.cognitiveSummary",
    schedule: [
      { id: "s1", time: "08:00", title: "content.schedule_medicine", status: "completed", icon: "fa-solid fa-pills" },
      { id: "s2", time: "10:30", title: "content.schedule_memoryGame", status: "completed", icon: "fa-solid fa-brain" },
      { id: "s3", time: "18:00", title: "content.schedule_evening", status: "upcoming", icon: "fa-solid fa-bell" },
      { id: "s4", time: "20:00", title: "content.schedule_music", status: "upcoming", icon: "fa-solid fa-music" },
    ] satisfies ScheduleItem[],
    recentActivity: [
      {
        id: "a1",
        gameType: "remember-object",
        label: "content.game_rememberObject",
        icon: "fa-solid fa-brain",
        resultScore: perPatient.resultScoreToday,
        status: "completed",
        timeLabel: "activity.senseOfToday",
        time: "10:32",
      },
      {
        id: "a2",
        gameType: "odd-object",
        label: "content.game_oddObject",
        icon: "fa-solid fa-puzzle-piece",
        resultScore: "4 / 5",
        status: "completed",
        timeLabel: "activity.senseOfToday",
        time: "10:25",
      },
      {
        id: "a3",
        gameType: "voice-reminder",
        label: "content.game_voiceReminder",
        icon: "fa-solid fa-microphone",
        result: "activity.resultCompleted",
        status: "completed",
        timeLabel: "activity.senseOfToday",
        time: "8:00",
      },
      {
        id: "a4",
        gameType: "remember-object",
        label: "content.game_rememberObject",
        icon: "fa-solid fa-brain",
        resultScore: "2 / 4",
        status: "completed",
        timeLabel: "activity.yesterday",
      },
    ] satisfies ActivityRow[],
    gamePerformance: [
      { id: "g1", name: "content.game_oddObject", score: 82, scoreLabel: "82%" },
      { id: "g2", name: "content.game_rememberObject", score: 71, scoreLabel: "71%" },
      { id: "g3", name: "content.game_patternSequences", score: 0, scoreLabel: "—" },
    ] satisfies GamePerformanceRow[],
    attention: perPatient.attention,
  };
}

const hydration: DashboardHydration = {
  patients: patientsRecords.map((p) => p.patient),
  dataByPatient: {
    "p-ramesh": buildData(patientsRecords[0].patient, {
      lastActiveLabel: "dashboard.lastActive",
      activityToday: 3,
      cognitiveScore: 78,
      gamesPlayed: 3,
      attentionCount: 2,
      resultScoreToday: "3 / 4",
      attention: [
        {
          id: "at1",
          icon: "fa-solid fa-circle-info",
          message: "content.attention_noTodayActivity",
          actionLabel: "common.view",
          tone: "info",
        },
        {
          id: "at2",
          icon: "fa-solid fa-user-pen",
          message: "content.attention_voiceProfile",
          actionLabel: "common.review",
          tone: "warning",
        },
      ] satisfies AttentionItem[],
    }),
    "p-meena": buildData(patientsRecords[1].patient, {
      lastActiveLabel: "dashboard.noActivityToday",
      activityToday: 0,
      cognitiveScore: 64,
      gamesPlayed: 0,
      attentionCount: 1,
      resultScoreToday: "—",
      attention: [
        {
          id: "at1",
          icon: "fa-solid fa-circle-info",
          message: "content.attention_noTodayUse",
          actionLabel: "common.view",
          tone: "info",
        },
      ] satisfies AttentionItem[],
    }),
  },
};

export function getMockHydration(): DashboardHydration {
  return hydration;
}

export function getMockPatientSummary(
  patientId: string,
  name?: string
): PatientSummary {
  return hydration.dataByPatient[patientId]?.summary ?? emptySummary(patientId, name);
}

export function getMockDashboardData(patientId: string, name?: string): DashboardData {
  const data = hydration.dataByPatient[patientId];
  if (!data) {
    return {
      summary: emptySummary(patientId, name),
      stats: emptyStats(),
      cognitiveProgress: [],
      cognitiveSummary: "",
      schedule: [],
      recentActivity: [],
      gamePerformance: [],
      attention: [],
    };
  }
  return data;
}

export function getMockPatients(): Patient[] {
  return hydration.patients;
}

function emptySummary(patientId: string, name?: string): PatientSummary {
  const displayName = name?.trim() || "Unknown patient";
  return {
    patientId,
    name: displayName,
    initials: displayName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((p) => p[0]?.toUpperCase() ?? "")
      .join("") || "?",
    connectedLabel: "",
    lastActiveLabel: "",
  };
}

function emptyStats(): DashboardStats {
  return {
    activityToday: 0,
    activityStatus: "no_activity",
    cognitiveScore: 0,
    cognitivePeriod: "",
    gamesPlayed: 0,
    gamesPeriod: "",
    attentionCount: 0,
  };
}