import { useState, useEffect, useCallback } from "react";
import * as habitsService from "@features/habits/services/habits.service";
import {
  Habit,
  CreateHabitData,
  UpdateHabitData,
} from "@features/habits/types/habits.types";

interface UseHabitsOptions {
  includeArchived?: boolean;
  autoLoad?: boolean;
}

interface UseHabitsReturn {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  loadHabits: () => Promise<void>;
  createHabit: (data: CreateHabitData) => Promise<Habit>;
  updateHabit: (id: string, data: UpdateHabitData) => Promise<Habit>;
  deleteHabit: (id: string) => Promise<void>;
  archiveHabit: (id: string) => Promise<Habit>;
  reorderHabits: (order: string[]) => Promise<void>;
}

/**
 * Custom hook for managing habits
 */
export const useHabits = (options: UseHabitsOptions = {}): UseHabitsReturn => {
  const { includeArchived = false, autoLoad = true } = options;

  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState<string | null>(null);

  const loadHabits = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await habitsService.getHabits({ includeArchived });
      setHabits(data);
    } catch (err: any) {
      setError(err.message || "Failed to load habits");
    } finally {
      setLoading(false);
    }
  }, [includeArchived]);

  useEffect(() => {
    if (autoLoad) {
      loadHabits();
    }
  }, [autoLoad, loadHabits]);

  const createHabit = useCallback(
    async (data: CreateHabitData): Promise<Habit> => {
      const newHabit = await habitsService.createHabit(data);
      setHabits((prev) => [...prev, newHabit]);
      return newHabit;
    },
    [],
  );

  const updateHabit = useCallback(
    async (id: string, data: UpdateHabitData): Promise<Habit> => {
      const updatedHabit = await habitsService.updateHabit(id, data);
      setHabits((prev) =>
        prev.map((habit) => (habit._id === id ? updatedHabit : habit)),
      );
      return updatedHabit;
    },
    [],
  );

  const deleteHabit = useCallback(async (id: string): Promise<void> => {
    await habitsService.deleteHabit(id);
    setHabits((prev) => prev.filter((habit) => habit._id !== id));
  }, []);

  const archiveHabit = useCallback(async (id: string): Promise<Habit> => {
    const archivedHabit = await habitsService.archiveHabit(id);
    setHabits((prev) =>
      prev.map((habit) => (habit._id === id ? archivedHabit : habit)),
    );
    return archivedHabit;
  }, []);

  const reorderHabits = useCallback(
    async (order: string[]): Promise<void> => {
      await habitsService.reorderHabits(order);
      // Optionally reload habits to get updated order from server
      await loadHabits();
    },
    [loadHabits],
  );

  return {
    habits,
    loading,
    error,
    loadHabits,
    createHabit,
    updateHabit,
    deleteHabit,
    archiveHabit,
    reorderHabits,
  };
};
