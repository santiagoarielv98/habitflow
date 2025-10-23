import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  recordSchema,
  type CreateRecordInput,
  type UpdateRecordInput,
  type Record,
} from "@/lib/validations/record";

// Función para obtener records de un hábito
async function fetchRecords(habitId: string): Promise<Record[]> {
  const response = await fetch(`/api/records?habitId=${habitId}`);
  if (!response.ok) throw new Error("Failed to fetch records");
  const data = await response.json();
  return z.array(recordSchema).parse(data);
}

// Función para crear/actualizar un record (toggle)
async function toggleRecord(input: CreateRecordInput): Promise<Record> {
  const response = await fetch("/api/records", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to toggle record");
  const data = await response.json();
  return recordSchema.parse(data);
}

// Función para actualizar un record
async function updateRecord({
  id,
  input,
}: {
  id: string;
  input: UpdateRecordInput;
}): Promise<Record> {
  const response = await fetch(`/api/records/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) throw new Error("Failed to update record");
  const data = await response.json();
  return recordSchema.parse(data);
}

// Función para eliminar un record
async function deleteRecord(id: string): Promise<void> {
  const response = await fetch(`/api/records/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete record");
}

// Hook principal
export function useRecords(habitId: string | null) {
  const queryClient = useQueryClient();

  // Query para obtener records
  const {
    data: records = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["records", habitId],
    queryFn: () => fetchRecords(habitId!),
    enabled: !!habitId, // Solo ejecutar si hay habitId
  });

  // Mutation para toggle (crear/actualizar)
  const toggleMutation = useMutation({
    mutationFn: toggleRecord,
    onSuccess: (data) => {
      // Invalidar queries de records
      queryClient.invalidateQueries({ queryKey: ["records", data.habitId] });
      // También invalidar habits para actualizar el contador
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  // Mutation para actualizar
  const updateMutation = useMutation({
    mutationFn: updateRecord,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["records", data.habitId] });
    },
  });

  // Mutation para eliminar
  const deleteMutation = useMutation({
    mutationFn: deleteRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", habitId] });
      queryClient.invalidateQueries({ queryKey: ["habits"] });
    },
  });

  return {
    records,
    loading: isLoading,
    error: error?.message || null,
    toggleRecord: toggleMutation.mutateAsync,
    updateRecord: (id: string, input: UpdateRecordInput) =>
      updateMutation.mutateAsync({ id, input }),
    deleteRecord: deleteMutation.mutateAsync,
    refreshRecords: () =>
      queryClient.invalidateQueries({ queryKey: ["records", habitId] }),
  };
}
