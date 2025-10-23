"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  createHabitSchema,
  type CreateHabitInput,
} from "@/lib/validations/habit";
import { useHabits } from "@/hooks/use-habits";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";

export function HabitFormDialog({ trigger }: { trigger?: React.ReactNode }) {
  const { createHabit } = useHabits();
  const [open, setOpen] = useState(false);

  const form = useForm<CreateHabitInput>({
    resolver: zodResolver(createHabitSchema),
    defaultValues: {
      name: "",
      description: "",
      frequency: "daily",
      color: "",
      icon: "",
      goal: 30,
    },
  });

  const handleSubmit = async (data: CreateHabitInput) => {
    try {
      await createHabit(data);
      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Error creating habit:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || <Button>+ Add Habit</Button>}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Habit</DialogTitle>
          <DialogDescription>
            Create a new habit to track your daily progress.
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

            <Button type="submit" disabled={form.formState.isSubmitting}>
              {form.formState.isSubmitting ? "Creating..." : "Create Habit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
