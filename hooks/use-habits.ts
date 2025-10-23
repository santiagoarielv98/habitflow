import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  type Habit,
  type CreateHabitInput,
  type UpdateHabitInput,
  habitSchema,
} from "@/lib/validations/habit";
import { z } from "zod";

// Función para fetch de hábitos
async function fetchHabits(): Promise<Habit[]> {
  const response = await fetch("/api/habits");
  if (!response.ok) {
    throw new Error("Failed to fetch habits");
  }
  const data = await response.json();
  return z.array(habitSchema).parse(data);
}

// Función para crear hábito
async function createHabit(input: CreateHabitInput): Promise<Habit> {
  const response = await fetch("/api/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to create habit");
  }
  const data = await response.json();
  return habitSchema.parse(data);
}

// Función para actualizar hábito
async function updateHabit({
  id,
  input,
}: {
  id: string;
  input: UpdateHabitInput;
}): Promise<Habit> {
  const response = await fetch(`/api/habits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || "Failed to update habit");
  }
  const data = await response.json();
  return habitSchema.parse(data);
}

// Función para eliminar hábito
async function deleteHabit(id: string): Promise<void> {
  const response = await fetch(`/api/habits/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete habit");
  }
}

// Hook principal
export function useHabits() {
  const queryClient = useQueryClient();

  // Query para obtener hábitos
  const {
    data: habits = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["habits"],
    queryFn: fetchHabits,
  });

  // Mutation para crear hábito
  const createMutation = useMutation({
    mutationFn: createHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Mutation para actualizar hábito
  const updateMutation = useMutation({
    mutationFn: updateHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Mutation para eliminar hábito
  const deleteMutation = useMutation({
    mutationFn: deleteHabit,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  return {
    habits,
    loading: isLoading,
    error: error?.message || null,
    createHabit: createMutation.mutateAsync,
    updateHabit: (id: string, input: UpdateHabitInput) =>
      updateMutation.mutateAsync({ id, input }),
    deleteHabit: deleteMutation.mutateAsync,
    refreshHabits: () =>
      queryClient.invalidateQueries({ queryKey: ["habits"] }),
  };
}
