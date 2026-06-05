import { HabitCategory } from "@features/habits/types/habits.types";

// Habit Categories (matches backend schema)
export const CATEGORIES: readonly HabitCategory[] = [
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

// Available emoji icons for habits
export const ICONS: readonly string[] = [
  "💪",
  "🏃",
  "📚",
  "🧘",
  "💧",
  "😴",
  "🥗",
  "✍️",
  "🎯",
  "🧠",
  "💊",
  "🚶",
] as const;

// Available colors for habit cards
export const COLORS: readonly string[] = [
  "#6366f1",
  "#0ea5e9",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
  "#8b5cf6",
  "#14b8a6",
] as const;

// Type exports for strict typing
export type HabitIcon = (typeof ICONS)[number];
export type HabitColor = (typeof COLORS)[number];
