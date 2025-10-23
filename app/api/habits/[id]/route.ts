import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { updateHabitSchema } from "@/lib/validations/habit";
import { ZodError } from "zod";

type Params = {
  params: Promise<{
    id: string;
  }>;
};

/**
 * @swagger
 * /api/habits/{id}:
 *   get:
 *     summary: Get a specific habit
 *     description: Retrieves a single habit by ID with all its records
 *     tags:
 *       - Habits
 *     security:
 *       - BetterAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Habit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const habit = await prisma.habit.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
      include: {
        records: {
          orderBy: {
            date: "desc",
          },
        },
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    return NextResponse.json(habit);
  } catch (error) {
    console.error("Error fetching habit:", error);
    return NextResponse.json(
      { error: "Failed to fetch habit" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/habits/{id}:
 *   patch:
 *     summary: Update a habit
 *     description: Updates a habit's properties (all fields optional)
 *     tags:
 *       - Habits
 *     security:
 *       - BetterAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Habit ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateHabitInput'
 *     responses:
 *       200:
 *         description: Habit updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Habit'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Habit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    // Validar con Zod
    const validatedData = updateHabitSchema.parse(body);

    const habit = await prisma.habit.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const updatedHabit = await prisma.habit.update({
      where: { id },
      data: validatedData,
    });

    return NextResponse.json(updatedHabit);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }
    console.error("Error updating habit:", error);
    return NextResponse.json(
      { error: "Failed to update habit" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/habits/{id}:
 *   delete:
 *     summary: Delete a habit
 *     description: Permanently deletes a habit and all its records
 *     tags:
 *       - Habits
 *     security:
 *       - BetterAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Habit ID
 *     responses:
 *       200:
 *         description: Habit deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Habit deleted successfully
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Habit not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const habit = await prisma.habit.findFirst({
      where: {
        id,
        userId: session.user.id,
      },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    await prisma.habit.delete({
      where: { id },
    });

    return NextResponse.json({ message: "Habit deleted successfully" });
  } catch (error) {
    console.error("Error deleting habit:", error);
    return NextResponse.json(
      { error: "Failed to delete habit" },
      { status: 500 },
    );
  }
}
