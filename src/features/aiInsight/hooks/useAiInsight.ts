import { useState, useCallback } from "react";
import * as aiInsightService from "@features/aiInsight/services/aiInsight.service";

interface UseAiInsightReturn {
  loading: boolean;
  error: string | null;
  getWeeklyReport: () => Promise<string>;
  getChatResponse: (question: string) => Promise<string>;
  getMorningMotivation: () => Promise<string>;
  getRecoveryPlan: (habitId: string) => Promise<string>;
}

/**
 * Custom hook for AI insights functionality
 */
export const useAiInsight = (): UseAiInsightReturn => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getWeeklyReport = useCallback(async (): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiInsightService.getWeeklyReport();
      return response.content;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to generate weekly report";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getChatResponse = useCallback(
    async (question: string): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const response = await aiInsightService.chatAnalysis({ question });
        return response.content;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to get chat response";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getMorningMotivation = useCallback(async (): Promise<string> => {
    setLoading(true);
    setError(null);
    try {
      const response = await aiInsightService.getMorningMotivation();
      return response.content;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to get morning motivation";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRecoveryPlan = useCallback(
    async (habitId: string): Promise<string> => {
      setLoading(true);
      setError(null);
      try {
        const response = await aiInsightService.getRecoveryPlan({ habitId });
        return response.content;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to get recovery plan";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    loading,
    error,
    getWeeklyReport,
    getChatResponse,
    getMorningMotivation,
    getRecoveryPlan,
  };
};
