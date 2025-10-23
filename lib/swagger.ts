import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "HabitFlow API",
    version: "1.0.0",
    description:
      "API documentation for HabitFlow - A habit tracking application",
    contact: {
      name: "HabitFlow Team",
    },
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Development server",
    },
  ],
  components: {
    schemas: {
      Habit: {
        type: "object",
        required: ["name", "frequency", "goal"],
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the habit",
          },
          userId: {
            type: "string",
            description: "ID of the user who owns this habit",
          },
          name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Name of the habit",
            example: "Morning Exercise",
          },
          description: {
            type: "string",
            nullable: true,
            maxLength: 500,
            description: "Detailed description of the habit",
            example: "30 minutes of cardio every morning",
          },
          frequency: {
            type: "string",
            description: "How often the habit should be performed",
            example: "daily",
          },
          goal: {
            type: "integer",
            minimum: 1,
            maximum: 365,
            description: "Number of days to complete this habit",
            example: 7,
          },
          color: {
            type: "string",
            nullable: true,
            description: "Color code for the habit",
            example: "#FF5733",
          },
          icon: {
            type: "string",
            nullable: true,
            description: "Icon emoji for the habit",
            example: "🏃",
          },
          active: {
            type: "boolean",
            description: "Whether the habit is currently active",
            example: true,
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the habit was created",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the habit was last updated",
          },
        },
      },
      CreateHabitInput: {
        type: "object",
        required: ["name", "frequency", "goal"],
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Name of the habit",
            example: "Morning Exercise",
          },
          description: {
            type: "string",
            maxLength: 500,
            description: "Detailed description of the habit",
            example: "30 minutes of cardio every morning",
          },
          frequency: {
            type: "string",
            description: "How often the habit should be performed",
            example: "daily",
          },
          goal: {
            type: "integer",
            minimum: 1,
            maximum: 365,
            description: "Number of days to complete this habit",
            example: 7,
          },
          color: {
            type: "string",
            description: "Color code for the habit",
            example: "#FF5733",
          },
          icon: {
            type: "string",
            description: "Icon emoji for the habit",
            example: "🏃",
          },
        },
      },
      UpdateHabitInput: {
        type: "object",
        properties: {
          name: {
            type: "string",
            minLength: 1,
            maxLength: 100,
            description: "Name of the habit",
          },
          description: {
            type: "string",
            maxLength: 500,
            description: "Detailed description of the habit",
          },
          frequency: {
            type: "string",
            description: "How often the habit should be performed",
          },
          goal: {
            type: "integer",
            minimum: 1,
            maximum: 365,
            description: "Number of days to complete this habit",
          },
          color: {
            type: "string",
            description: "Color code for the habit",
          },
          icon: {
            type: "string",
            description: "Icon emoji for the habit",
          },
          active: {
            type: "boolean",
            description: "Whether the habit is currently active",
          },
        },
      },
      Record: {
        type: "object",
        required: ["habitId", "date", "completed"],
        properties: {
          id: {
            type: "string",
            description: "Unique identifier for the record",
          },
          habitId: {
            type: "string",
            description: "ID of the associated habit",
          },
          date: {
            type: "string",
            format: "date-time",
            description: "Date of the record",
          },
          completed: {
            type: "boolean",
            description: "Whether the habit was completed on this date",
            example: true,
          },
          notes: {
            type: "string",
            nullable: true,
            maxLength: 500,
            description: "Optional notes for this record",
            example: "Felt great today!",
          },
          createdAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the record was created",
          },
          updatedAt: {
            type: "string",
            format: "date-time",
            description: "Timestamp when the record was last updated",
          },
        },
      },
      CreateRecordInput: {
        type: "object",
        required: ["habitId", "date", "completed"],
        properties: {
          habitId: {
            type: "string",
            description: "ID of the associated habit",
          },
          date: {
            type: "string",
            format: "date-time",
            description: "Date of the record",
          },
          completed: {
            type: "boolean",
            description: "Whether the habit was completed on this date",
            example: true,
          },
          notes: {
            type: "string",
            maxLength: 500,
            description: "Optional notes for this record",
            example: "Felt great today!",
          },
        },
      },
      UpdateRecordInput: {
        type: "object",
        properties: {
          completed: {
            type: "boolean",
            description: "Whether the habit was completed on this date",
          },
          notes: {
            type: "string",
            maxLength: 500,
            description: "Optional notes for this record",
          },
        },
      },
      Error: {
        type: "object",
        properties: {
          error: {
            type: "string",
            description: "Error message",
            example: "Invalid request",
          },
        },
      },
    },
    securitySchemes: {
      BetterAuth: {
        type: "http",
        scheme: "bearer",
        description: "Better Auth session token",
      },
    },
  },
  security: [
    {
      BetterAuth: [],
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./app/api/**/*.ts"],
};

export const swaggerSpec = swaggerJSDoc(options);
