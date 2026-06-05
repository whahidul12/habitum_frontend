import { useState, useCallback } from "react";
import * as habitLogsService from "@features/habitLogs/services/habitLogs.service";
import { HabitLog } from "@features/habitLogs/types/habitLogs.types";
import { DateString } from "@shared/global.types";

interface UseHabitLogsReturn {
  logs: HabitLog[];
  loading: boolean;
  error: string | null;
  markComplete: (habitId: string, date?: DateString) => Promise<HabitLog>;
  unmarkComplete: (habitId: string, date?: DateString) => Promise<void>;
  getTodayLogs: () => Promise<HabitLog[]>;
  getRangeLogs: (start: DateString, end: DateString) => Promise<HabitLog[]>;
}

/**
 * Custom hook for managing habit logs
 */
export const useHabitLogs = (): UseHabitLogsReturn => {
  const [logs, setLogs] = useState<HabitLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const markComplete = useCallback(
    async (habitId: string, date?: DateString): Promise<HabitLog> => {
      setLoading(true);
      setError(null);
      try {
        const log = await habitLogsService.markComplete({ habitId, date });
        setLogs((prev) => [...prev, log]);
        return log;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to mark habit complete";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const unmarkComplete = useCallback(
    async (habitId: string, date?: DateString): Promise<void> => {
      setLoading(true);
      setError(null);
      try {
        await habitLogsService.unmarkComplete({ habitId, date });
        setLogs((prev) =>
          prev.filter(
            (log) =>
              !(
                log.habitId === habitId &&
                (!date || log.completedDate === date)
              ),
          ),
        );
      } catch (err: any) {
        const errorMsg = err.message || "Failed to unmark habit";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const getTodayLogs = useCallback(async (): Promise<HabitLog[]> => {
    setLoading(true);
    setError(null);
    try {
      const data = await habitLogsService.getTodayLogs();
      setLogs(data);
      return data;
    } catch (err: any) {
      const errorMsg = err.message || "Failed to load today's logs";
      setError(errorMsg);
      throw new Error(errorMsg);
    } finally {
      setLoading(false);
    }
  }, []);

  const getRangeLogs = useCallback(
    async (start: DateString, end: DateString): Promise<HabitLog[]> => {
      setLoading(true);
      setError(null);
      try {
        const data = await habitLogsService.getRangeLogs({ start, end });
        setLogs(data);
        return data;
      } catch (err: any) {
        const errorMsg = err.message || "Failed to load logs";
        setError(errorMsg);
        throw new Error(errorMsg);
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return {
    logs,
    loading,
    error,
    markComplete,
    unmarkComplete,
    getTodayLogs,
    getRangeLogs,
  };
};
