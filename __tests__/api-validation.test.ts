import { createHabitSchema, updateHabitSchema } from "@/lib/validations/habit";
import {
  createRecordSchema,
  updateRecordSchema,
} from "@/lib/validations/record";

describe("API Validation Schemas", () => {
  describe("Habit Schemas", () => {
    it("should validate creating a habit with all required fields", () => {
      const validHabit = {
        name: "Read Books",
        frequency: "daily",
        goal: 30,
      };

      const result = createHabitSchema.safeParse(validHabit);
      expect(result.success).toBe(true);
    });

    it("should validate updating a habit partially", () => {
      const partialUpdate = {
        active: false,
      };

      const result = updateHabitSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });
  });

  describe("Record Schemas", () => {
    it("should validate creating a record", () => {
      const validRecord = {
        habitId: "habit-123",
        date: new Date(),
        completed: true,
      };

      const result = createRecordSchema.safeParse(validRecord);
      expect(result.success).toBe(true);
    });

    it("should validate updating a record", () => {
      const validUpdate = {
        completed: false,
        notes: "Skipped today",
      };

      const result = updateRecordSchema.safeParse(validUpdate);
      expect(result.success).toBe(true);
    });

    it("should accept date as string", () => {
      const recordWithStringDate = {
        habitId: "habit-123",
        date: "2025-10-23",
        completed: true,
      };

      const result = createRecordSchema.safeParse(recordWithStringDate);
      expect(result.success).toBe(true);
    });
  });
});
