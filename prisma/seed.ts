import { PrismaClient } from "../lib/generated/prisma";
import "dotenv/config";
import { auth } from "@/lib/auth";

const prisma = new PrismaClient();

const email = "demo@example.com";
const password = "password";
const name = "Demo User";

async function main() {
  console.log("🌱 Starting seed...");
  console.log(
    "⚠️  This script will add sample data to an existing user account.",
  );
  console.log("⚠️  Make sure you have created an account via sign-up first!\n");

  const { user: createdUser } = await auth.api.signUpEmail({
    returnHeaders: false,
    body: {
      email,
      password,
      name,
    },
  });
  console.log(`👤 Created user: ${createdUser.email}\n`);

  // Buscar el primer usuario o pedir que creen uno
  const user = await prisma.user.findFirst({
    where: { email },
    orderBy: { createdAt: "asc" },
  });

  if (!user) {
    console.error(
      "❌ No users found! Please create an account via sign-up first.",
    );
    console.log("\n📝 Steps:");
    console.log("  1. Run: npm run dev");
    console.log("  2. Go to: http://localhost:3000/sign-up");
    console.log("  3. Create an account");
    console.log("  4. Run: npm run seed");
    process.exit(1);
  }

  console.log(`👤 Found user: ${user.email}`);
  console.log(`🧹 Cleaning existing habits and records for this user...\n`);

  // Eliminar hábitos existentes del usuario (cascada eliminará records)
  await prisma.habit.deleteMany({
    where: { userId: user.id },
  });

  // Crear hábitos relacionados al desarrollo del proyecto
  console.log("📝 Creating habits...");

  const habits = [
    {
      name: "Daily Coding Session",
      description: "Work on HabitFlow project - minimum 2 hours per day",
      frequency: "daily",
      goal: 30,
      color: "#3B82F6",
      icon: "💻",
      active: true,
      createdAt: new Date("2025-10-01T10:00:00"),
    },
    {
      name: "Code Review",
      description: "Review and refactor code written during the day",
      frequency: "daily",
      goal: 20,
      color: "#8B5CF6",
      icon: "🔍",
      active: true,
      createdAt: new Date("2025-10-02T10:00:00"),
    },
    {
      name: "Documentation",
      description: "Write documentation for new features and API endpoints",
      frequency: "daily",
      goal: 15,
      color: "#10B981",
      icon: "📚",
      active: true,
      createdAt: new Date("2025-10-03T10:00:00"),
    },
    {
      name: "Testing",
      description: "Write unit and integration tests",
      frequency: "daily",
      goal: 10,
      color: "#F59E0B",
      icon: "🧪",
      active: true,
      createdAt: new Date("2025-10-05T10:00:00"),
    },
    {
      name: "Learning Time",
      description:
        "Study new technologies and best practices (Next.js, Prisma, etc)",
      frequency: "daily",
      goal: 25,
      color: "#EC4899",
      icon: "📖",
      active: true,
      createdAt: new Date("2025-10-04T10:00:00"),
    },
    {
      name: "UI/UX Design",
      description: "Design and improve user interface components",
      frequency: "weekly",
      goal: 4,
      color: "#6366F1",
      icon: "🎨",
      active: true,
      createdAt: new Date("2025-10-06T10:00:00"),
    },
    {
      name: "Database Optimization",
      description: "Optimize queries and database structure",
      frequency: "weekly",
      goal: 3,
      color: "#14B8A6",
      icon: "🗄️",
      active: false,
      createdAt: new Date("2025-10-07T10:00:00"),
    },
    {
      name: "Morning Exercise",
      description: "Stay healthy while coding - 30 min workout",
      frequency: "daily",
      goal: 25,
      color: "#EF4444",
      icon: "🏃",
      active: true,
      createdAt: new Date("2025-10-01T07:00:00"),
    },
  ];

  const createdHabits = [];
  for (const habitData of habits) {
    const habit = await prisma.habit.create({
      data: {
        ...habitData,
        userId: user.id,
        updatedAt: habitData.createdAt,
      },
    });
    createdHabits.push(habit);
    console.log(`  ✅ Habit created: ${habit.name}`);
  }

  // Crear registros para todo octubre (1-30)
  console.log("📊 Creating records for October 2025...");

  const recordsData = [
    // Daily Coding Session - muy consistente
    {
      habitIndex: 0,
      pattern: [
        true,
        true,
        true,
        true,
        true,
        true,
        true, // Week 1
        true,
        true,
        true,
        true,
        true,
        false,
        true, // Week 2
        true,
        true,
        true,
        true,
        true,
        true,
        true, // Week 3
        true,
        true,
        true,
        true,
        false,
        true,
        true, // Week 4
        true,
        true, // Days 29-30
      ],
      notes: [
        "Setup project and database",
        "Implemented authentication with Better Auth",
        "Created Habit CRUD operations",
        "Added Zod validation schemas",
        "Integrated React Hook Form",
        "Implemented TanStack Query",
        "Added Record tracking",
        "Built calendar tracker component",
        "Implemented statistics system",
        "Added Recharts for visualizations",
        "Created habit edit functionality",
        "Added active/inactive toggle",
        "Built user profile page",
        "",
        "Implemented password change",
        "Added dashboard filters",
        "Created search functionality",
        "Implemented sorting options",
        "Setup Jest for testing",
        "Wrote validation tests",
        "Configured Swagger",
        "Documented API endpoints",
        "Added OpenAPI schemas",
        "Created API documentation page",
        "",
        "Code refactoring",
        "Performance optimizations",
        "Bug fixes and improvements",
        "Final testing",
        "Project completed! 🎉",
      ],
    },
    // Code Review - bastante consistente
    {
      habitIndex: 1,
      pattern: [
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
      ],
    },
    // Documentation - moderado
    {
      habitIndex: 2,
      pattern: [
        false,
        false,
        false,
        true,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
      ],
    },
    // Testing - empezó tarde
    {
      habitIndex: 3,
      pattern: [
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        false,
        true,
        true,
        false,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
      ],
    },
    // Learning Time - consistente
    {
      habitIndex: 4,
      pattern: [
        false,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
      ],
    },
    // UI/UX Design - semanal
    {
      habitIndex: 5,
      pattern: [
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
      ],
    },
    // Database Optimization - semanal, inactivo
    {
      habitIndex: 6,
      pattern: [
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        true,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
        false,
      ],
    },
    // Morning Exercise - muy bueno
    {
      habitIndex: 7,
      pattern: [
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        true,
        false,
        false,
        true,
        true,
        true,
      ],
    },
  ];

  let totalRecords = 0;
  for (const { habitIndex, pattern, notes } of recordsData) {
    const habit = createdHabits[habitIndex];

    for (let day = 1; day <= 30; day++) {
      const completed = pattern[day - 1];
      const date = new Date(`2025-10-${day.toString().padStart(2, "0")}`);

      await prisma.record.create({
        data: {
          habitId: habit.id,
          date: date,
          completed: completed,
          notes: notes && notes[day - 1] ? notes[day - 1] : null,
          createdAt: new Date(date.getTime() + 20 * 60 * 60 * 1000), // 8 PM del mismo día
        },
      });
      totalRecords++;
    }

    console.log(
      `  ✅ Created ${pattern.filter((p) => p).length}/30 records for: ${habit.name}`,
    );
  }

  console.log(`\n✨ Seed completed successfully!`);
  console.log(`📊 Summary:`);
  console.log(`  - Users: 1`);
  console.log(`  - Habits: ${createdHabits.length}`);
  console.log(`  - Records: ${totalRecords}`);
  console.log(`\n🔐 Login credentials:`);
  console.log(`  Email: ${email}`);
  console.log(`  Password: ${password}`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    console.log(`🔌 Disconnecting from database...`);
    await prisma.$disconnect();
  });
