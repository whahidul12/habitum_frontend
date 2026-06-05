import api, { handleApiError } from "@services/api";
import { HabitLog } from "@features/habitLogs/types/habitLogs.types";
import { DateString } from "@shared/global.types";

// Request DTOs
export interface MarkCompleteRequest {
  habitId: string;
  date?: DateString;
}

export interface UnmarkCompleteRequest {
  habitId: string;
  date?: DateString;
}

export interface GetRangeQuery {
  start: DateString;
  end: DateString;
}

// Response types
export interface HeatmapDataPoint {
  date: DateString;
  count: number;
}

export interface HabitStatsResponse {
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
  totalCompletions: number;
  lastCompletedDate?: DateString;
}

export interface AllStatsResponse {
  totalCompletions: number;
  activeStreaks: number;
  longestStreak: number;
  completionRate: number;
  byCategory: Array<{
    name: string;
    value: number;
  }>;
}

/**
 * Mark a habit as complete for a specific date
 */
export const markComplete = async (
  data: MarkCompleteRequest,
): Promise<HabitLog> => {
  try {
    const response = await api.post<HabitLog>("/logs/mark", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Unmark (delete) a habit completion for a specific date
 */
export const unmarkComplete = async (
  data: UnmarkCompleteRequest,
): Promise<void> => {
  try {
    await api.post("/logs/unmark", data);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get today's habit logs
 */
export const getTodayLogs = async (): Promise<HabitLog[]> => {
  try {
    const response = await api.get<HabitLog[]>("/logs/today");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get habit logs for a date range
 */
export const getRangeLogs = async (
  query: GetRangeQuery,
): Promise<HabitLog[]> => {
  try {
    const response = await api.get<HabitLog[]>("/logs/range", {
      params: query,
    });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get heatmap data for visualization
 */
export const getHeatmapData = async (): Promise<HeatmapDataPoint[]> => {
  try {
    const response = await api.get<HeatmapDataPoint[]>("/logs/heatmap");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get statistics for a specific habit
 */
export const getHabitStats = async (
  habitId: string,
): Promise<HabitStatsResponse> => {
  try {
    const response = await api.get<HabitStatsResponse>(
      `/logs/habits/${habitId}/stats`,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get all statistics across all habits
 */
export const getAllStats = async (): Promise<AllStatsResponse> => {
  try {
    const response = await api.get<AllStatsResponse>("/logs/stats");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
