import { useMemo } from "react";
import { differenceInDays, startOfDay, isWithinInterval } from "date-fns";
import type { Record } from "@/lib/validations/record";
import type { Habit } from "@/lib/validations/habit";

export type HabitStats = {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  totalDays: number;
  completionRate: number;
  lastCompletedDate: Date | null;
  daysUntilGoal: number;
  isGoalReached: boolean;
  weeklyCompletion: number;
  monthlyCompletion: number;
  streakHistory: { date: Date; streak: number }[];
};

export function useHabitStats(
  habit: Habit | null,
  records: Record[],
): HabitStats | null {
  return useMemo(() => {
    if (!habit || !records) return null;

    const today = startOfDay(new Date());
    const habitCreatedAt = startOfDay(new Date(habit.createdAt));
    const totalDays = differenceInDays(today, habitCreatedAt) + 1;

    // Filtrar solo records completados y ordenar por fecha
    const completedRecords = records
      .filter((r) => r.completed)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    const totalCompleted = completedRecords.length;

    // Calcular racha actual
    let currentStreak = 0;
    let checkDate = today;
    const recordDates = new Set(
      completedRecords.map((r) => startOfDay(new Date(r.date)).getTime()),
    );

    while (recordDates.has(checkDate.getTime())) {
      currentStreak++;
      checkDate = new Date(checkDate);
      checkDate.setDate(checkDate.getDate() - 1);
    }

    // Calcular racha más larga
    let longestStreak = 0;
    let tempStreak = 0;
    let prevDate: Date | null = null;

    for (const record of completedRecords) {
      const recordDate = startOfDay(new Date(record.date));

      if (prevDate === null) {
        tempStreak = 1;
      } else {
        const diff = differenceInDays(recordDate, prevDate);
        if (diff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      }

      prevDate = recordDate;
    }
    longestStreak = Math.max(longestStreak, tempStreak);

    // Última fecha completada
    const lastCompletedDate =
      completedRecords.length > 0
        ? new Date(completedRecords[completedRecords.length - 1].date)
        : null;

    // Tasa de completitud
    const completionRate =
      totalDays > 0 ? (totalCompleted / totalDays) * 100 : 0;

    // Días hasta alcanzar el goal
    const daysUntilGoal = Math.max(0, habit.goal - totalCompleted);
    const isGoalReached = totalCompleted >= habit.goal;

    // Completitud semanal (últimos 7 días)
    const weekAgo = new Date(today);
    weekAgo.setDate(weekAgo.getDate() - 6);
    const weeklyCompleted = completedRecords.filter((r) => {
      const recordDate = new Date(r.date);
      return isWithinInterval(recordDate, { start: weekAgo, end: today });
    }).length;
    const weeklyCompletion = (weeklyCompleted / 7) * 100;

    // Completitud mensual (últimos 30 días)
    const monthAgo = new Date(today);
    monthAgo.setDate(monthAgo.getDate() - 29);
    const monthlyCompleted = completedRecords.filter((r) => {
      const recordDate = new Date(r.date);
      return isWithinInterval(recordDate, { start: monthAgo, end: today });
    }).length;
    const monthlyCompletion = (monthlyCompleted / 30) * 100;

    // Historial de rachas (para gráfico)
    const streakHistory: { date: Date; streak: number }[] = [];
    let currentStreakCount = 0;
    let lastDate: Date | null = null;

    for (const record of completedRecords) {
      const recordDate = startOfDay(new Date(record.date));

      if (lastDate === null) {
        currentStreakCount = 1;
      } else {
        const diff = differenceInDays(recordDate, lastDate);
        if (diff === 1) {
          currentStreakCount++;
        } else {
          currentStreakCount = 1;
        }
      }

      streakHistory.push({ date: recordDate, streak: currentStreakCount });
      lastDate = recordDate;
    }

    return {
      currentStreak,
      longestStreak,
      totalCompleted,
      totalDays,
      completionRate,
      lastCompletedDate,
      daysUntilGoal,
      isGoalReached,
      weeklyCompletion,
      monthlyCompletion,
      streakHistory,
    };
  }, [habit, records]);
}
