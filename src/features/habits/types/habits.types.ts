import { ID, DateString } from "@shared/global.types";

// Habit Categories (matches backend)
export const HABIT_CATEGORIES = [
  "Health",
  "Fitness",
  "Learning",
  "Mindfulness",
  "Productivity",
  "Social",
  "Finance",
  "Creative",
  "Other",
] as const;

export type HabitCategory = (typeof HABIT_CATEGORIES)[number];

// Habit Frequency
export type HabitFrequency = "daily" | "weekly";

// Habit Model (matches backend IHabit)
export interface Habit {
  _id: ID;
  userId: ID;
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDays: number;
  color: string;
  icon: string;
  isArchived: boolean;
  order: number;
  createdAt: DateString;
  updatedAt: DateString;
}

// Habit DTOs
export interface CreateHabitData {
  name: string;
  description?: string;
  category: HabitCategory;
  frequency: HabitFrequency;
  targetDays: number;
  color: string;
  icon: string;
}

export type HabitCreatePayload = CreateHabitData;

export interface UpdateHabitData extends Partial<CreateHabitData> {
  isArchived?: boolean;
  order?: number;
}

// Habit with Computed Stats
export interface HabitWithStats extends Habit {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  lastCompletedDate?: DateString;
}

// Habit Suggestion from AI
export interface HabitSuggestion {
  name: string;
  category: HabitCategory;
  description: string;
  icon: string;
  color: string;
  frequency: HabitFrequency;
  targetDays: number;
  reasoning?: string;
}
