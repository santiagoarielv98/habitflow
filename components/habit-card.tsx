"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { type Habit } from "@/lib/validations/habit";
import { HabitTracker } from "./habit-tracker";
import { HabitSummaryCard } from "./habit-summary-card";
import { HabitEditDialog } from "./habit-edit-dialog";

type HabitCardProps = {
  habit: Habit;
  onDelete: (id: string) => Promise<void>;
};

export function HabitCard({ habit, onDelete }: HabitCardProps) {
  const [trackerOpen, setTrackerOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this habit?")) {
      await onDelete(habit.id);
    }
  };

  // Obtener records del hábito (los últimos 30 que ya tiene cargados)
  const records = habit.records || [];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {habit.icon && <span className="text-2xl">{habit.icon}</span>}
            <div>
              <CardTitle>{habit.name}</CardTitle>
              <CardDescription>{habit.frequency}</CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Dialog open={trackerOpen} onOpenChange={setTrackerOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  Track
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Track Progress</DialogTitle>
                </DialogHeader>
                <HabitTracker habit={habit} />
              </DialogContent>
            </Dialog>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditOpen(true)}
            >
              Edit
            </Button>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {habit.description && (
          <p className="text-sm text-muted-foreground mb-4">
            {habit.description}
          </p>
        )}

        {/* Resumen de estadísticas */}
        <HabitSummaryCard habit={habit} records={records} />

        {/* Info adicional */}
        <div className="flex gap-4 mt-4 text-sm text-muted-foreground">
          <div>
            <span className="font-medium">Goal:</span> {habit.goal} days
          </div>
          {habit.color && (
            <div>
              <span className="font-medium">Color:</span> {habit.color}
            </div>
          )}
        </div>
      </CardContent>

      {/* Dialog de edición */}
      <HabitEditDialog
        habit={habit}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
    </Card>
  );
}
