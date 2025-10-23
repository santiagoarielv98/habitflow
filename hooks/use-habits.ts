import { useState, useEffect } from "react";

export type Habit = {
  id: string;
  name: string;
  description: string | null;
  frequency: string;
  color: string | null;
  icon: string | null;
  goal: number;
  active: boolean;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  records?: Array<{
    id: string;
    date: Date;
    completed: boolean;
    notes: string | null;
    habitId: string;
    createdAt: Date;
  }>;
};

export type CreateHabitInput = {
  name: string;
  description?: string;
  frequency?: string;
  color?: string;
  icon?: string;
  goal?: number;
};

export type UpdateHabitInput = Partial<CreateHabitInput> & {
  active?: boolean;
};

export function useHabits() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchHabits = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/habits");
      if (!response.ok) throw new Error("Failed to fetch habits");
      const data = await response.json();
      setHabits(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const createHabit = async (input: CreateHabitInput) => {
    try {
      const response = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to create habit");
      const newHabit = await response.json();
      setHabits((prev) => [newHabit, ...prev]);
      return newHabit;
    } catch (err) {
      throw err;
    }
  };

  const updateHabit = async (id: string, input: UpdateHabitInput) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!response.ok) throw new Error("Failed to update habit");
      const updatedHabit = await response.json();
      setHabits((prev) =>
        prev.map((habit) => (habit.id === id ? updatedHabit : habit)),
      );
      return updatedHabit;
    } catch (err) {
      throw err;
    }
  };

  const deleteHabit = async (id: string) => {
    try {
      const response = await fetch(`/api/habits/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete habit");
      setHabits((prev) => prev.filter((habit) => habit.id !== id));
    } catch (err) {
      throw err;
    }
  };

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    refreshHabits: fetchHabits,
  };
}
