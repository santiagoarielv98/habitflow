"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  updateHabitSchema,
  type UpdateHabitInput,
  type Habit,
} from "@/lib/validations/habit";
import { useHabits } from "@/hooks/use-habits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

type HabitEditDialogProps = {
  habit: Habit;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function HabitEditDialog({
  habit,
  open,
  onOpenChange,
}: HabitEditDialogProps) {
  const { updateHabit } = useHabits();

  const form = useForm<UpdateHabitInput>({
    resolver: zodResolver(updateHabitSchema),
    defaultValues: {
      name: habit.name,
      description: habit.description || "",
      frequency: habit.frequency,
      color: habit.color || "",
      icon: habit.icon || "",
      goal: habit.goal,
      active: habit.active,
    },
  });

  // Resetear el formulario cuando cambia el hábito o se abre el dialog
  useEffect(() => {
    if (open) {
      form.reset({
        name: habit.name,
        description: habit.description || "",
        frequency: habit.frequency,
        color: habit.color || "",
        icon: habit.icon || "",
        goal: habit.goal,
        active: habit.active,
      });
    }
  }, [habit, open, form]);

  const handleSubmit = async (data: UpdateHabitInput) => {
    try {
      // Filtrar solo los campos que cambiaron
      const changes: UpdateHabitInput = {};
      if (data.name !== habit.name) changes.name = data.name;
      if (data.description !== (habit.description || ""))
        changes.description = data.description;
      if (data.frequency !== habit.frequency)
        changes.frequency = data.frequency;
      if (data.color !== (habit.color || "")) changes.color = data.color;
      if (data.icon !== (habit.icon || "")) changes.icon = data.icon;
      if (data.goal !== habit.goal) changes.goal = data.goal;
      if (data.active !== habit.active) changes.active = data.active;

      // Solo actualizar si hay cambios
      if (Object.keys(changes).length > 0) {
        await updateHabit(habit.id, changes);
      }

      onOpenChange(false);
    } catch (error) {
      console.error("Error updating habit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Habit</DialogTitle>
          <DialogDescription>
            Update your habit details and preferences.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            <Field>
              <FieldLabel>Name *</FieldLabel>
              <Input
                {...form.register("name")}
                placeholder="Exercise, Read, Meditate..."
              />
              <FieldError>{form.formState.errors.name?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Description</FieldLabel>
              <Textarea
                {...form.register("description")}
                placeholder="What is this habit about?"
                rows={3}
              />
              <FieldDescription>
                Optional: Add more details about your habit
              </FieldDescription>
              <FieldError>
                {form.formState.errors.description?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Frequency *</FieldLabel>
              <Input
                {...form.register("frequency")}
                placeholder="daily, weekly, monthly..."
              />
              <FieldDescription>
                How often do you want to do this habit?
              </FieldDescription>
              <FieldError>
                {form.formState.errors.frequency?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Goal (days) *</FieldLabel>
              <Input
                type="number"
                {...form.register("goal", { valueAsNumber: true })}
                placeholder="30"
              />
              <FieldDescription>
                Number of days you want to maintain this habit
              </FieldDescription>
              <FieldError>{form.formState.errors.goal?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Color</FieldLabel>
              <Input
                {...form.register("color")}
                placeholder="blue, green, red..."
              />
              <FieldDescription>
                Optional: Choose a color theme for this habit
              </FieldDescription>
              <FieldError>{form.formState.errors.color?.message}</FieldError>
            </Field>

            <Field>
              <FieldLabel>Icon</FieldLabel>
              <Input {...form.register("icon")} placeholder="💪, 📚, 🧘..." />
              <FieldDescription>
                Optional: Add an emoji or icon
              </FieldDescription>
              <FieldError>{form.formState.errors.icon?.message}</FieldError>
            </Field>

            <Field>
              <div
                style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}
              >
                <Switch
                  checked={form.watch("active")}
                  onCheckedChange={(checked) =>
                    form.setValue("active", checked)
                  }
                />
                <FieldLabel style={{ margin: 0 }}>Active</FieldLabel>
              </div>
              <FieldDescription>
                Inactive habits won&apos;t show in your dashboard
              </FieldDescription>
            </Field>

            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
