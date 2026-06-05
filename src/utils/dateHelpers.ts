import {
  format,
  subDays,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
} from "date-fns";
import { DateString } from "@shared/global.types";

// Day Info Interface
export interface DayInfo {
  key: DateString;
  label: string;
  short: string;
  date: Date;
}

// Streak Result Interface
export interface StreakResult {
  current: number;
  longest: number;
}

/**
 * Convert a Date to YYYY-MM-DD format
 */
export const toKey = (d: Date): DateString => format(d, "yyyy-MM-dd");

/**
 * Get today's date key (YYYY-MM-DD)
 */
export const todayKey = (): DateString => toKey(new Date());

/**
 * Get array of last 7 days with formatted info
 */
export const last7Days = (): DayInfo[] => {
  const end = new Date();
  const start = subDays(end, 6);
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};

/**
 * Get array of date keys for last 90 days
 */
export const last90Days = (): DateString[] => {
  const end = new Date();
  const start = subDays(end, 89);
  return eachDayOfInterval({ start, end }).map((d) => toKey(d));
};

/**
 * Get current week's day info (Monday-Sunday)
 */
export const weekKeys = (): DayInfo[] => weekKeysFor(new Date());

/**
 * Get week's day info for a specific date (Monday-Sunday)
 */
export const weekKeysFor = (date: Date): DayInfo[] => {
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return eachDayOfInterval({ start, end }).map((d) => ({
    key: toKey(d),
    label: format(d, "EEE"),
    short: format(d, "d"),
    date: d,
  }));
};

/**
 * Format date to human-readable string (e.g., "Jan 5, 2024")
 */
export const prettyDate = (d: Date | string): string =>
  format(d instanceof Date ? d : new Date(d), "MMM d, yyyy");

/**
 * Calculate current and longest streak from date keys
 */
export const streakFromKeys = (keys: DateString[]): StreakResult => {
  if (!keys?.length) return { current: 0, longest: 0 };

  const set = new Set(keys);
  const today = todayKey();
  const yKey = toKey(subDays(new Date(), 1));

  // Calculate current streak
  let current = 0;
  let cursor = new Date();

  if (!set.has(today) && !set.has(yKey)) {
    current = 0;
  } else {
    if (!set.has(today)) cursor = subDays(cursor, 1);
    while (set.has(toKey(cursor))) {
      current += 1;
      cursor = subDays(cursor, 1);
    }
  }

  // Calculate longest streak
  const sorted = [...keys].sort();
  let longest = 0;
  let run = 0;
  let prev: DateString | null = null;

  for (const k of sorted) {
    if (prev) {
      const diff = Math.round(
        (new Date(k).getTime() - new Date(prev).getTime()) /
          (1000 * 60 * 60 * 24),
      );
      run = diff === 1 ? run + 1 : 1;
    } else {
      run = 1;
    }
    if (run > longest) longest = run;
    prev = k;
  }

  return { current, longest };
};
