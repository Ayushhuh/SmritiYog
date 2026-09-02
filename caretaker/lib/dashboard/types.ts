export interface Patient {
  id: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  connectedDaysAgo: number;
}

export interface PatientSummary {
  patientId: string;
  name: string;
  initials: string;
  avatarUrl?: string;
  lastActiveLabel: string;
  lastActiveAt?: string;
  connectedLabel: string;
  connectedDaysAgo?: number;
}

export interface DashboardStats {
  activityToday: number;
  activityStatus: "active" | "no_activity";
  cognitiveScore: number;
  cognitivePeriod: string;
  gamesPlayed: number;
  gamesPeriod: string;
  attentionCount: number;
}

export interface ActivityRow {
  id: string;
  gameType: "remember-object" | "odd-object" | "voice-reminder" | "other";
  label: string;
  icon: string;
  result?: string;
  resultScore?: string;
  status: "completed" | "in_progress" | "missed";
  timeLabel: string;
  time?: string;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  status: "completed" | "upcoming" | "missed";
  icon: string;
}

export interface GamePerformanceRow {
  id: string;
  name: string;
  score: number;
  scoreLabel: string;
}

export interface AttentionItem {
  id: string;
  icon: string;
  message: string;
  actionLabel: string;
  tone: "info" | "warning";
}

export interface CognitiveProgressPoint {
  day: string;
  score: number;
}

export interface DashboardData {
  summary: PatientSummary;
  stats: DashboardStats;
  cognitiveProgress: CognitiveProgressPoint[];
  cognitiveSummary: string;
  schedule: ScheduleItem[];
  recentActivity: ActivityRow[];
  gamePerformance: GamePerformanceRow[];
  attention: AttentionItem[];
}

export interface DashboardHydration {
  patients: Patient[];
  dataByPatient: Record<string, DashboardData>;
}