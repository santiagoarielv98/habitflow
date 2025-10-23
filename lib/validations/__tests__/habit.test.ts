import {
  createHabitSchema,
  updateHabitSchema,
  habitSchema,
} from "@/lib/validations/habit";

describe("Habit Validation Schemas", () => {
  describe("createHabitSchema", () => {
    it("should validate a valid habit creation", () => {
      const validHabit = {
        name: "Exercise",
        frequency: "daily",
        goal: 7,
        description: "Daily workout",
      };

      const result = createHabitSchema.safeParse(validHabit);
      expect(result.success).toBe(true);
    });

    it("should reject habit with empty name", () => {
      const invalidHabit = {
        name: "",
        frequency: "daily",
        goal: 7,
      };

      const result = createHabitSchema.safeParse(invalidHabit);
      expect(result.success).toBe(false);
    });

    it("should reject habit with empty frequency", () => {
      const invalidHabit = {
        name: "Exercise",
        frequency: "",
        goal: 7,
      };

      const result = createHabitSchema.safeParse(invalidHabit);
      expect(result.success).toBe(false);
    });

    it("should reject habit with negative goal", () => {
      const invalidHabit = {
        name: "Exercise",
        frequency: "daily",
        goal: -1,
      };

      const result = createHabitSchema.safeParse(invalidHabit);
      expect(result.success).toBe(false);
    });

    it("should accept optional fields", () => {
      const minimalHabit = {
        name: "Exercise",
        frequency: "daily",
        goal: 7,
      };

      const result = createHabitSchema.safeParse(minimalHabit);
      expect(result.success).toBe(true);
    });
  });

  describe("updateHabitSchema", () => {
    it("should validate partial updates", () => {
      const partialUpdate = {
        name: "Updated Exercise",
      };

      const result = updateHabitSchema.safeParse(partialUpdate);
      expect(result.success).toBe(true);
    });

    it("should validate active toggle", () => {
      const activeUpdate = {
        active: false,
      };

      const result = updateHabitSchema.safeParse(activeUpdate);
      expect(result.success).toBe(true);
    });

    it("should reject invalid partial data", () => {
      const invalidUpdate = {
        name: "", // empty name
      };

      const result = updateHabitSchema.safeParse(invalidUpdate);
      expect(result.success).toBe(false);
    });
  });

  describe("habitSchema", () => {
    it("should validate a complete habit object", () => {
      const completeHabit = {
        id: "1",
        userId: "user1",
        name: "Exercise",
        description: "Daily workout",
        frequency: "daily",
        goal: 7,
        color: "#FF0000",
        icon: "🏃",
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = habitSchema.safeParse(completeHabit);
      expect(result.success).toBe(true);
    });

    it("should accept null optional fields", () => {
      const habitWithNulls = {
        id: "1",
        userId: "user1",
        name: "Exercise",
        description: null,
        frequency: "daily",
        goal: 7,
        color: null,
        icon: null,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = habitSchema.safeParse(habitWithNulls);
      expect(result.success).toBe(true);
    });
  });
});
