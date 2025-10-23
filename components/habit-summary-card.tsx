"use client";

import { Badge } from "@/components/ui/badge";
import { useHabitStats } from "@/hooks/use-habit-stats";
import type { Habit } from "@/lib/validations/habit";
import type { Record } from "@/lib/validations/record";

type HabitSummaryCardProps = {
  habit: Habit;
  records: Record[];
};

export function HabitSummaryCard({ habit, records }: HabitSummaryCardProps) {
  const stats = useHabitStats(habit, records);

  if (!stats) {
    return null;
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
      <div style={{ display: "flex", gap: "1rem", fontSize: "0.875rem" }}>
        {/* Racha actual */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span>🔥</span>
          <span style={{ fontWeight: "600" }}>{stats.currentStreak}</span>
          <span style={{ color: "#6b7280" }}>day streak</span>
        </div>

        {/* Completitud */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span>✅</span>
          <span style={{ fontWeight: "600" }}>
            {stats.totalCompleted}/{stats.totalDays}
          </span>
          <span style={{ color: "#6b7280" }}>days</span>
        </div>

        {/* Tasa */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
          <span>📊</span>
          <span style={{ fontWeight: "600" }}>
            {stats.completionRate.toFixed(0)}%
          </span>
        </div>

        {/* Badge si alcanzó el goal */}
        {stats.isGoalReached && (
          <Badge variant="default" style={{ fontSize: "0.75rem" }}>
            🎉 Goal!
          </Badge>
        )}
      </div>

      {/* Barra de progreso simple */}
      <div
        style={{
          width: "100%",
          height: "4px",
          backgroundColor: "#e5e7eb",
          borderRadius: "2px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${Math.min((stats.totalCompleted / habit.goal) * 100, 100)}%`,
            height: "100%",
            backgroundColor: stats.isGoalReached ? "#10b981" : "#3b82f6",
            transition: "width 0.3s ease",
          }}
        />
      </div>
    </div>
  );
}
