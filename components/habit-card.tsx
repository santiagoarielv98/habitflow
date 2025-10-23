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

type HabitCardProps = {
  habit: Habit;
  onDelete: (id: string) => Promise<void>;
};

export function HabitCard({ habit, onDelete }: HabitCardProps) {
  const [trackerOpen, setTrackerOpen] = useState(false);

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this habit?")) {
      await onDelete(habit.id);
    }
  };

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
                <HabitTracker habitId={habit.id} habitName={habit.name} />
              </DialogContent>
            </Dialog>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      {habit.description && (
        <CardContent>
          <p className="text-sm text-muted-foreground">{habit.description}</p>
          <div className="flex gap-4 mt-4 text-sm">
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
      )}
    </Card>
  );
}
