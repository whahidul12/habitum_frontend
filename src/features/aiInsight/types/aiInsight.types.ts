import { ID, DateString } from "@shared/global.types";

// Insight Types (matches backend enum)
export enum InsightType {
  WEEKLY = "weekly",
  SUGGESTION = "suggestion",
  RECOVERY = "recovery",
  CHAT = "chat",
  MORNING = "morning",
}

// AI Insight Model (matches backend IAIInsight)
export interface AIInsight {
  _id: ID;
  userId: ID;
  type: InsightType;
  content: string;
  meta: Record<string, any>;
  generatedAt: DateString;
  createdAt: DateString;
  updatedAt: DateString;
}

// AI Chat Message
export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: DateString;
}

// AI Request DTOs
export interface GenerateInsightRequest {
  type: InsightType;
  meta?: Record<string, any>;
}

export interface ChatRequest {
  message: string;
  context?: {
    habits?: ID[];
    dateRange?: {
      start: DateString;
      end: DateString;
    };
  };
}

// AI Response Types
export interface ChatResponse {
  message: string;
  suggestions?: string[];
}

export interface WeeklyReportData {
  summary: string;
  achievements: string[];
  improvements: string[];
  recommendations: string[];
  stats: {
    totalCompletions: number;
    completionRate: number;
    streaksChanged: number;
  };
}

// Re-export HabitSuggestion from habits for convenience
export type { HabitSuggestion } from "@features/habits/types/habits.types";
