import { z } from "zod";

// Schema para crear un record (marcar un día)
export const createRecordSchema = z.object({
  habitId: z.string().min(1, "Habit ID is required"),
  date: z.coerce.date(),
  completed: z.boolean().default(true),
  notes: z.string().max(500).optional(),
});

// Schema para actualizar un record
export const updateRecordSchema = z.object({
  completed: z.boolean().optional(),
  notes: z.string().max(500).optional(),
});

// Schema completo del record
export const recordSchema = z.object({
  id: z.string(),
  habitId: z.string(),
  date: z.coerce.date(),
  completed: z.boolean(),
  notes: z.string().nullable(),
  createdAt: z.coerce.date(),
  //   updatedAt: z.coerce.date(),
});

// Tipos inferidos
export type CreateRecordInput = z.infer<typeof createRecordSchema>;
export type UpdateRecordInput = z.infer<typeof updateRecordSchema>;
export type Record = z.infer<typeof recordSchema>;
