import { ID, DateString } from "@shared/global.types";

// Habit Log Model (matches backend IHabitLog)
export interface HabitLog {
  _id: ID;
  userId: ID;
  habitId: ID;
  completedDate: DateString; // YYYY-MM-DD format
  notes: string;
  createdAt: DateString;
  updatedAt: DateString;
}

// Habit Log DTOs
export interface CreateHabitLogData {
  habitId: ID;
  completedDate: DateString;
  notes?: string;
}

export interface UpdateHabitLogData {
  notes?: string;
  completedDate?: DateString;
}

// Habit Log with Habit Info (for display)
export interface HabitLogWithHabit extends HabitLog {
  habit: {
    name: string;
    color: string;
    icon: string;
    category: string;
  };
}

// Weekly Stats
export interface WeeklyStats {
  weekStart: DateString;
  weekEnd: DateString;
  totalCompletions: number;
  completionRate: number;
  habitsCompleted: number;
  totalHabits: number;
}

// Heatmap Data Point
export interface HeatmapDataPoint {
  date: DateString;
  count: number;
  habits: string[];
}

export type HeatmapData = HeatmapDataPoint;
