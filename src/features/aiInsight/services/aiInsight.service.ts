import api, { handleApiError } from "@services/api";
import { HabitSuggestion } from "@features/habits/types/habits.types";

// Request DTOs
export interface SuggestHabitsRequest {
  goals: string;
  productiveTime: string;
  struggles: string;
}

export interface RecoveryPlanRequest {
  habitId: string;
}

export interface ChatAnalysisRequest {
  question: string;
}

// Response types
export interface ContentResponse {
  content: string;
}

export interface SuggestHabitsResponse {
  suggestions: HabitSuggestion[];
}

/**
 * Get AI-generated weekly report
 */
export const getWeeklyReport = async (): Promise<ContentResponse> => {
  try {
    const response = await api.post<ContentResponse>("/ai/weekly-report");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get AI habit suggestions based on user input
 */
export const suggestHabits = async (
  data: SuggestHabitsRequest,
): Promise<SuggestHabitsResponse> => {
  try {
    const response = await api.post<SuggestHabitsResponse>(
      "/ai/suggest-habits",
      data,
    );
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get AI recovery plan for a habit with broken streak
 */
export const getRecoveryPlan = async (
  data: RecoveryPlanRequest,
): Promise<ContentResponse> => {
  try {
    const response = await api.post<ContentResponse>("/ai/recovery-plan", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Chat with AI about habit data
 */
export const chatAnalysis = async (
  data: ChatAnalysisRequest,
): Promise<ContentResponse> => {
  try {
    const response = await api.post<ContentResponse>("/ai/chat", data);
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};

/**
 * Get morning motivation message
 */
export const getMorningMotivation = async (): Promise<ContentResponse> => {
  try {
    const response = await api.get<ContentResponse>("/ai/morning");
    return response.data;
  } catch (error) {
    throw handleApiError(error);
  }
};
