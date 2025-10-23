"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { type Habit } from "@/hooks/use-habits";

type HabitCardProps = {
  habit: Habit;
  onDelete: (id: string) => Promise<void>;
};

export function HabitCard({ habit, onDelete }: HabitCardProps) {
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
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            Delete
          </Button>
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
