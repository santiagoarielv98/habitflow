"use client";

import { useState } from "react";
import { useRecords } from "@/hooks/use-records";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { HabitStats } from "@/components/habit-stats";
import type { Habit } from "@/lib/validations/habit";
import { ScrollArea } from "./ui/scroll-area";

type HabitTrackerProps = {
  habit: Habit;
};

export function HabitTracker({ habit }: HabitTrackerProps) {
  const { records, loading, toggleRecord } = useRecords(habit.id);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [notes, setNotes] = useState("");

  // Generar últimos 30 días
  const getLast30Days = () => {
    const days = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      days.push(date);
    }
    return days;
  };

  const last30Days = getLast30Days();

  // Verificar si un día está marcado como completado
  const isCompleted = (date: Date) => {
    if (date === null) return false;
    return records.some((record) => {
      const recordDate = new Date(record.date);
      recordDate.setHours(0, 0, 0, 0);
      return (
        recordDate.getTime() === date.getTime() && record.completed === true
      );
    });
  };

  // Obtener notas de un día
  const getNotes = (date: Date) => {
    const record = records.find((r) => {
      const recordDate = new Date(r.date);
      recordDate.setHours(0, 0, 0, 0);
      return recordDate.getTime() === date.getTime();
    });
    return record?.notes || "";
  };

  // Toggle día
  const handleToggleDay = async (date: Date) => {
    const completed = !isCompleted(date);
    try {
      await toggleRecord({
        habitId: habit.id,
        date,
        completed,
        notes: completed ? notes : undefined,
      });
      setNotes("");
      setSelectedDate(null);
    } catch (error) {
      console.error("Error toggling record:", error);
    }
  };

  // Abrir dialog para agregar notas
  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setNotes(getNotes(date));
  };

  if (loading) {
    return <div>Loading tracker...</div>;
  }

  return (
    <>
      <Tabs defaultValue="tracker" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="tracker">📅 Tracker</TabsTrigger>
          <TabsTrigger value="stats">📊 Statistics</TabsTrigger>
        </TabsList>

        <TabsContent value="tracker">
          <Card>
            <CardHeader>
              <CardTitle>{habit.name} - Last 30 Days</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(7, 1fr)",
                  gap: "0.5rem",
                }}
              >
                {last30Days.map((date) => {
                  const completed = isCompleted(date);
                  const isToday =
                    date.toDateString() === new Date().toDateString();
                  const dayNotes = getNotes(date);

                  return (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDayClick(date)}
                      style={{
                        padding: "0.75rem",
                        borderRadius: "0.375rem",
                        border: isToday
                          ? "2px solid blue"
                          : "1px solid #e5e7eb",
                        backgroundColor: completed ? "#10b981" : "white",
                        color: completed ? "white" : "black",
                        cursor: "pointer",
                        position: "relative",
                      }}
                      title={`${date.toLocaleDateString()}${dayNotes ? `\n${dayNotes}` : ""}`}
                    >
                      <div style={{ fontSize: "0.75rem", fontWeight: "bold" }}>
                        {date.getDate()}
                      </div>
                      <div style={{ fontSize: "0.625rem" }}>
                        {date.toLocaleDateString("en", { weekday: "short" })}
                      </div>
                      {dayNotes && (
                        <div
                          style={{
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: completed ? "white" : "#3b82f6",
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <ScrollArea className="h-[80vh] min-h-0 pr-2.5">
            <HabitStats habit={habit} records={records} />
          </ScrollArea>
        </TabsContent>
      </Tabs>

      {/* Dialog para agregar/editar notas */}
      <Dialog
        open={!!selectedDate}
        onOpenChange={(open) => !open && setSelectedDate(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedDate?.toLocaleDateString("en", {
                weekday: "long",
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </DialogTitle>
            <DialogDescription>
              Mark this day as completed and add notes (optional)
            </DialogDescription>
          </DialogHeader>

          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="How did it go? Any notes..."
              rows={4}
            />

            <div style={{ display: "flex", gap: "0.5rem" }}>
              <Button
                onClick={() => selectedDate && handleToggleDay(selectedDate)}
                style={{ flex: 1 }}
              >
                {isCompleted(selectedDate!) ? "Unmark" : "Mark as Complete"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setSelectedDate(null)}
                style={{ flex: 1 }}
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
