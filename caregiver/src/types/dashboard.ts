// Dashboard data types for SmritiYog CG
// These interfaces define the data model for the caregiver dashboard.
// They are designed to match the expected backend API shape.

export interface Patient {
  id: number;
  uid: string;
  full_name: string;
  preferred_name: string;
  date_of_birth: string;
  gender: string;
  preferred_language: string;
  phone_number: string;
  created_at: string;
  updated_at: string;
}

export interface DashboardStats {
  activityToday: number;
  activityTodayLabel: string;
  cognitiveScore: number;
  cognitiveScoreLabel: string;
  gamesPlayed: number;
  gamesPlayedLabel: string;
  attentionCount: number;
  attentionCountLabel: string;
}

export interface CognitiveProgressPoint {
  day: string;
  score: number;
}

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  status: "completed" | "upcoming" | "missed";
}

export interface GameActivity {
  id: string;
  gameType: string;
  gameIcon: string;
  score?: number;
  total?: number;
  status: "completed" | "in_progress" | "missed";
  completedAt: string;
}

export interface GamePerformanceItem {
  gameName: string;
  percentage: number;
}

export interface AttentionItem {
  id: string;
  message: string;
  type: "warning" | "info";
  actionLabel: string;
  actionHref: string;
}

export interface QuickAction {
  label: string;
  icon: string;
  href: string;
}

export interface DashboardData {
  patient: Patient | null;
  stats: DashboardStats | null;
  cognitiveProgress: CognitiveProgressPoint[];
  schedule: ScheduleItem[];
  recentActivity: GameActivity[];
  gamePerformance: GamePerformanceItem[];
  attentionItems: AttentionItem[];
  quickActions: QuickAction[];
}
