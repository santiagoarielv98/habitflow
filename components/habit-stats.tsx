"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { format } from "date-fns";
import { useHabitStats } from "@/hooks/use-habit-stats";
import type { Habit } from "@/lib/validations/habit";
import type { Record } from "@/lib/validations/record";

type HabitStatsProps = {
  habit: Habit;
  records: Record[];
};

export function HabitStats({ habit, records }: HabitStatsProps) {
  const stats = useHabitStats(habit, records);

  if (!stats) {
    return <div>Loading stats...</div>;
  }

  // Datos para el gráfico de racha
  const streakChartData = stats.streakHistory.slice(-30).map((item) => ({
    date: format(item.date, "MMM dd"),
    streak: item.streak,
  }));

  // Datos para el gráfico de completitud (últimos 30 días)
  const getLast30DaysData = () => {
    const data = [];
    const today = new Date();
    const recordMap = new Map(
      records.map((r) => [format(new Date(r.date), "yyyy-MM-dd"), r.completed]),
    );

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateKey = format(date, "yyyy-MM-dd");
      data.push({
        date: format(date, "MMM dd"),
        completed: recordMap.get(dateKey) ? 1 : 0,
      });
    }

    return data;
  };

  const completionChartData = getLast30DaysData();

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
      {/* Resumen de estadísticas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: "1rem",
        }}
      >
        {/* Racha actual */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem" }}>
              🔥 Current Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.currentStreak}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>days</div>
          </CardContent>
        </Card>

        {/* Racha más larga */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem" }}>
              ⭐ Longest Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.longestStreak}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>days</div>
          </CardContent>
        </Card>

        {/* Total completado */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem" }}>
              ✅ Total Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.totalCompleted}
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              / {stats.totalDays} days
            </div>
          </CardContent>
        </Card>

        {/* Tasa de completitud */}
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem" }}>
              📊 Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div style={{ fontSize: "2rem", fontWeight: "bold" }}>
              {stats.completionRate.toFixed(1)}%
            </div>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              overall
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progreso hacia el goal */}
      <Card>
        <CardHeader>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <CardTitle>Goal Progress</CardTitle>
            {stats.isGoalReached && (
              <Badge variant="default">🎉 Goal Reached!</Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}
          >
            <Progress
              value={(stats.totalCompleted / habit.goal) * 100}
              className="h-3"
            />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                fontSize: "0.875rem",
                color: "#6b7280",
              }}
            >
              <span>
                {stats.totalCompleted} / {habit.goal} days
              </span>
              <span>
                {stats.isGoalReached
                  ? `+${stats.totalCompleted - habit.goal} extra days!`
                  : `${stats.daysUntilGoal} days to go`}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Completitud semanal y mensual */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
          gap: "1rem",
        }}
      >
        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem" }}>
              📅 Last 7 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.weeklyCompletion} className="h-2" />
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              {stats.weeklyCompletion.toFixed(0)}% completed
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle style={{ fontSize: "0.875rem" }}>
              📆 Last 30 Days
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={stats.monthlyCompletion} className="h-2" />
            <div
              style={{
                fontSize: "0.875rem",
                color: "#6b7280",
                marginTop: "0.5rem",
              }}
            >
              {stats.monthlyCompletion.toFixed(0)}% completed
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráfico de racha */}
      {streakChartData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Streak History (Last 30 Days)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={streakChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" style={{ fontSize: "0.75rem" }} />
                <YAxis style={{ fontSize: "0.75rem" }} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="streak"
                  stroke="#f59e0b"
                  fill="#fef3c7"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {/* Gráfico de completitud diaria */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Completion (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={completionChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" style={{ fontSize: "0.75rem" }} />
              <YAxis
                domain={[0, 1]}
                ticks={[0, 1]}
                style={{ fontSize: "0.75rem" }}
              />
              <Tooltip
                formatter={(value: number) => (value === 1 ? "✓" : "✗")}
              />
              <Line
                type="stepAfter"
                dataKey="completed"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ fill: "#10b981", r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Información adicional */}
      {stats.lastCompletedDate && (
        <Card>
          <CardContent style={{ paddingTop: "1rem" }}>
            <div style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              Last completed:{" "}
              <strong>
                {format(stats.lastCompletedDate, "EEEE, MMMM dd, yyyy")}
              </strong>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
