import { z } from "zod";

// Schema para crear hábito (solo campos requeridos para el formulario)
export const createHabitSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  frequency: z.string().min(1, "Frequency is required"),
  color: z.string().optional(),
  icon: z.string().optional(),
  goal: z.number().int().min(1).max(365),
});

// Schema para actualizar hábito (todos los campos opcionales)
export const updateHabitSchema = createHabitSchema
  .partial()
  .extend({ active: z.boolean().optional() });

// Schema completo del hábito (incluye campos de DB)
export const habitSchema = z.object({
  id: z.string(),
  userId: z.string(),
  name: z.string(),
  description: z.string().nullable(),
  frequency: z.string(),
  goal: z.number(),
  color: z.string().nullable(),
  icon: z.string().nullable(),
  active: z.boolean(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  records: z
    .array(
      z.object({
        id: z.string(),
        habitId: z.string(),
        date: z.coerce.date(),
        completed: z.boolean(),
        notes: z.string().nullable(),
        createdAt: z.coerce.date(),
        // updatedAt: z.coerce.date(),
      }),
    )
    .optional(),
});

// Tipos inferidos de los schemas
export type CreateHabitInput = z.infer<typeof createHabitSchema>;
export type UpdateHabitInput = z.infer<typeof updateHabitSchema>;
export type Habit = z.infer<typeof habitSchema>;
