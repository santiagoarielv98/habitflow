import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createRecordSchema } from "@/lib/validations/record";
import { ZodError } from "zod";

/**
 * @swagger
 * /api/records:
 *   get:
 *     summary: Get records for a habit
 *     description: Retrieves all records for a specific habit
 *     tags:
 *       - Records
 *     security:
 *       - BetterAuth: []
 *     parameters:
 *       - in: query
 *         name: habitId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the habit to get records for
 *     responses:
 *       200:
 *         description: List of records
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Record'
 *       400:
 *         description: Missing habitId parameter
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
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const habitId = searchParams.get("habitId");

    if (!habitId) {
      return NextResponse.json(
        { error: "habitId is required" },
        { status: 400 },
      );
    }

    // Verificar que el hábito pertenece al usuario
    const habit = await prisma.habit.findFirst({
      where: { id: habitId, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    const records = await prisma.record.findMany({
      where: { habitId },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(records);
  } catch (error) {
    console.error("Error fetching records:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

/**
 * @swagger
 * /api/records:
 *   post:
 *     summary: Create or update a record
 *     description: Creates a new record or updates an existing one for a specific date (upsert operation)
 *     tags:
 *       - Records
 *     security:
 *       - BetterAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRecordInput'
 *     responses:
 *       201:
 *         description: Record created or updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Record'
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
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: request.headers });

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const validatedData = createRecordSchema.parse(body);

    // Verificar que el hábito pertenece al usuario
    const habit = await prisma.habit.findFirst({
      where: { id: validatedData.habitId, userId: session.user.id },
    });

    if (!habit) {
      return NextResponse.json({ error: "Habit not found" }, { status: 404 });
    }

    // Normalizar la fecha a inicio del día (UTC)
    const date = new Date(validatedData.date);
    date.setUTCHours(0, 0, 0, 0);

    // Buscar si ya existe un record para esta fecha
    const existingRecord = await prisma.record.findFirst({
      where: {
        habitId: validatedData.habitId,
        date,
      },
    });

    let record;

    if (existingRecord) {
      // Actualizar el record existente
      record = await prisma.record.update({
        where: { id: existingRecord.id },
        data: {
          completed: validatedData.completed,
          notes: validatedData.notes || null,
        },
      });
    } else {
      // Crear un nuevo record
      record = await prisma.record.create({
        data: {
          habitId: validatedData.habitId,
          date,
          completed: validatedData.completed,
          notes: validatedData.notes || null,
        },
      });
    }

    return NextResponse.json(record, { status: existingRecord ? 200 : 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Validation error", details: error.issues },
        { status: 400 },
      );
    }

    console.error("Error creating record:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
