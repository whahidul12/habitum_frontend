import api, { handleApiError } from "@services/api";
import {
  Habit,
  CreateHabitData,
  UpdateHabitData,
  HabitSuggestion,
} from "@features/habits/types/habits.types";

// Query parameters for getting habits
interface GetHabitsQuery {
  includeArchived?: boolean;
}

/**
 * Get all habits for the authenticated user
 */
export const getHabits = async (query?: GetHabitsQuery): Promise<Habit[]> => {
  try {
    const params = query?.includeArchived ? { includeArchived: "true" } : {};
    const response = await api.get<Habit[]>("/habits", { params });
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Create a new habit
 */
export const createHabit = async (data: CreateHabitData): Promise<Habit> => {
  try {
    const response = await api.post<Habit>("/habits", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Update an existing habit
 */
export const updateHabit = async (
  id: string,
  data: UpdateHabitData,
): Promise<Habit> => {
  try {
    const response = await api.put<Habit>(`/habits/${id}`, data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Delete a habit
 */
export const deleteHabit = async (id: string): Promise<void> => {
  try {
    await api.delete(`/habits/${id}`);
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Archive or unarchive a habit
 */
export const archiveHabit = async (id: string): Promise<Habit> => {
  try {
    const response = await api.put<Habit>(`/habits/${id}/archive`);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Reorder habits
 */
export const reorderHabits = async (order: string[]): Promise<void> => {
  try {
    await api.post("/habits/reorder", { order });
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Request AI habit suggestions based on user input
 */
export const suggestHabits = async (data: {
  goals: string;
  productiveTime: string;
  struggles: string;
}): Promise<{ suggestions: HabitSuggestion[] }> => {
  try {
    const response = await api.post<{ suggestions: HabitSuggestion[] }>(
      "/ai/suggest-habits",
      data,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
