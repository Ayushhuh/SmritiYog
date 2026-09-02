// Dashboard data service for SmritiYog CG
// Currently provides mock data. Replace with real API calls when the backend is ready.
//
// Architecture:
//   dashboardService.getPatients()
//   dashboardService.getPatientSummary(patientId)
//   dashboardService.getDashboardStats(patientId)
//   dashboardService.getCognitiveProgress(patientId)
//   dashboardService.getRecentActivity(patientId)
//   dashboardService.getTodaySchedule(patientId)
//   dashboardService.getAttentionItems(patientId)
//
// All mock data is isolated here — never scattered across components.

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

// Simulate network delay
function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ── Mock Data ──────────────────────────────────────────────

const mockPatients: Patient[] = [
  {
    id: 1,
    uid: "483921",
    full_name: "Ramesh Sharma",
    preferred_name: "Ramesh",
    date_of_birth: "1948-05-12",
    gender: "male",
    preferred_language: "en",
    phone_number: "+911234567890",
    created_at: new Date(Date.now() - 24 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    uid: "728154",
    full_name: "Meena Sharma",
    preferred_name: "Meena",
    date_of_birth: "1952-08-20",
    gender: "female",
    preferred_language: "en",
    phone_number: "+919876543210",
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
  },
];

const mockStats: Record<string, DashboardStats> = {
  p1: {
    activityToday: 3,
    activityTodayLabel: "3 activities completed",
    cognitiveScore: 78,
    cognitiveScoreLabel: "This week",
    gamesPlayed: 3,
    gamesPlayedLabel: "Today",
    attentionCount: 2,
    attentionCountLabel: "Review",
  },
  p2: {
    activityToday: 1,
    activityTodayLabel: "1 activity completed",
    cognitiveScore: 65,
    cognitiveScoreLabel: "This week",
    gamesPlayed: 1,
    gamesPlayedLabel: "Today",
    attentionCount: 3,
    attentionCountLabel: "Review",
  },
};

const mockCognitiveProgress: Record<string, CognitiveProgressPoint[]> = {
  p1: [
    { day: "Mon", score: 72 },
    { day: "Tue", score: 75 },
    { day: "Wed", score: 68 },
    { day: "Thu", score: 81 },
    { day: "Fri", score: 79 },
    { day: "Sat", score: 84 },
    { day: "Sun", score: 78 },
  ],
  p2: [
    { day: "Mon", score: 60 },
    { day: "Tue", score: 62 },
    { day: "Wed", score: 58 },
    { day: "Thu", score: 67 },
    { day: "Fri", score: 65 },
    { day: "Sat", score: 70 },
    { day: "Sun", score: 65 },
  ],
};

const mockSchedule: Record<string, ScheduleItem[]> = {
  p1: [
    {
      id: "s1",
      time: "08:00",
      title: "Medicine reminder",
      status: "completed",
    },
    {
      id: "s2",
      time: "10:30",
      title: "Memory game",
      status: "completed",
    },
    {
      id: "s3",
      time: "18:00",
      title: "Evening reminder",
      status: "upcoming",
    },
  ],
  p2: [
    {
      id: "s4",
      time: "09:00",
      title: "Morning medicine",
      status: "completed",
    },
    {
      id: "s5",
      time: "14:00",
      title: "Afternoon activity",
      status: "upcoming",
    },
  ],
};

const mockRecentActivity: Record<string, GameActivity[]> = {
  p1: [
    {
      id: "a1",
      gameType: "Remember the Object",
      gameIcon: "fa-brain",
      score: 3,
      total: 4,
      status: "completed",
      completedAt: new Date(
        Date.now() - 30 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "a2",
      gameType: "Find the Odd Object",
      gameIcon: "fa-puzzle-piece",
      score: 4,
      total: 5,
      status: "completed",
      completedAt: new Date(
        Date.now() - 35 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "a3",
      gameType: "Voice Reminder",
      gameIcon: "fa-microphone",
      status: "completed",
      completedAt: new Date(
        Date.now() - 2.5 * 60 * 60 * 1000
      ).toISOString(),
    },
    {
      id: "a4",
      gameType: "Remember the Object",
      gameIcon: "fa-brain",
      score: 2,
      total: 4,
      status: "completed",
      completedAt: new Date(
        Date.now() - 24 * 60 * 60 * 1000
      ).toISOString(),
    },
  ],
  p2: [
    {
      id: "a5",
      gameType: "Find the Odd Object",
      gameIcon: "fa-puzzle-piece",
      score: 3,
      total: 5,
      status: "completed",
      completedAt: new Date(
        Date.now() - 5 * 60 * 60 * 1000
      ).toISOString(),
    },
  ],
};

const mockGamePerformance: Record<string, GamePerformanceItem[]> = {
  p1: [
    { gameName: "Find the Odd Object", percentage: 82 },
    { gameName: "Remember the Object", percentage: 71 },
    { gameName: "Coming Soon", percentage: -1 },
  ],
  p2: [
    { gameName: "Find the Odd Object", percentage: 65 },
    { gameName: "Remember the Object", percentage: 58 },
    { gameName: "Coming Soon", percentage: -1 },
  ],
};

const mockAttentionItems: Record<string, AttentionItem[]> = {
  p1: [
    {
      id: "at1",
      message: "Patient has not completed today's activity",
      type: "warning",
      actionLabel: "View",
      actionHref: "#",
    },
    {
      id: "at2",
      message: "Familiar voice profile needs attention",
      type: "info",
      actionLabel: "Review",
      actionHref: "#",
    },
  ],
  p2: [
    {
      id: "at3",
      message: "No activity recorded today",
      type: "warning",
      actionLabel: "View",
      actionHref: "#",
    },
    {
      id: "at4",
      message: "Reminder schedule may need updating",
      type: "info",
      actionLabel: "Review",
      actionHref: "#",
    },
    {
      id: "at5",
      message: "Cognitive score has decreased this week",
      type: "warning",
      actionLabel: "View Progress",
      actionHref: "#",
    },
  ],
};

const mockQuickActions: QuickAction[] = [
  { label: "Add Patient", icon: "fa-user-plus", href: "/dashboard/patients/new" },
  { label: "Create Reminder", icon: "fa-calendar-plus", href: "#" },
  { label: "Configure Voice", icon: "fa-microphone", href: "#" },
  { label: "View Progress", icon: "fa-chart-line", href: "#" },
];

// ── Service API ────────────────────────────────────────────

export const dashboardService = {
  async getPatients(): Promise<Patient[]> {
    await delay(300);
    return [...mockPatients];
  },

  async getPatientSummary(patientId: number): Promise<Patient | null> {
    await delay(200);
    return mockPatients.find((p) => p.id === patientId) ?? null;
  },

  async getDashboardStats(patientId: number): Promise<DashboardStats | null> {
    await delay(400);
    return mockStats[String(patientId)] ?? null;
  },

  async getCognitiveProgress(
    patientId: number
  ): Promise<CognitiveProgressPoint[]> {
    await delay(500);
    return mockCognitiveProgress[String(patientId)] ?? [];
  },

  async getTodaySchedule(patientId: number): Promise<ScheduleItem[]> {
    await delay(300);
    return mockSchedule[String(patientId)] ?? [];
  },

  async getRecentActivity(patientId: number): Promise<GameActivity[]> {
    await delay(350);
    return mockRecentActivity[String(patientId)] ?? [];
  },

  async getGamePerformance(
    patientId: number
  ): Promise<GamePerformanceItem[]> {
    await delay(400);
    return mockGamePerformance[String(patientId)] ?? [];
  },

  async getAttentionItems(patientId: number): Promise<AttentionItem[]> {
    await delay(300);
    return mockAttentionItems[String(patientId)] ?? [];
  },

  async getQuickActions(): Promise<QuickAction[]> {
    await delay(100);
    return [...mockQuickActions];
  },
};
