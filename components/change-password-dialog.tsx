"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldLabel,
  FieldError,
  FieldDescription,
} from "@/components/ui/field";
const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(8, "Current password is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .max(100),
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type ChangePasswordInput = z.infer<typeof changePasswordSchema>;

type ChangePasswordDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function ChangePasswordDialog({
  open,
  onOpenChange,
}: ChangePasswordDialogProps) {
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const form = useForm<ChangePasswordInput>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = async (data: ChangePasswordInput) => {
    try {
      setError(null);
      setSuccess(false);

      const response = await fetch("/api/auth/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: data.currentPassword,
          newPassword: data.newPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        setError(result.error || "Failed to change password");
        return;
      }

      setSuccess(true);
      form.reset();

      // Cerrar el dialog después de 2 segundos
      setTimeout(() => {
        onOpenChange(false);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error("Error changing password:", err);
      setError("An unexpected error occurred");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your
            account.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={form.handleSubmit(handleSubmit)}>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
          >
            {error && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#fee2e2",
                  color: "#991b1b",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              >
                {error}
              </div>
            )}

            {success && (
              <div
                style={{
                  padding: "0.75rem",
                  backgroundColor: "#d1fae5",
                  color: "#065f46",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                }}
              >
                ✅ Password changed successfully!
              </div>
            )}

            <Field>
              <FieldLabel>Current Password</FieldLabel>
              <Input
                type="password"
                {...form.register("currentPassword")}
                placeholder="Enter your current password"
              />
              <FieldError>
                {form.formState.errors.currentPassword?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>New Password</FieldLabel>
              <Input
                type="password"
                {...form.register("newPassword")}
                placeholder="Enter your new password"
              />
              <FieldDescription>
                Must be at least 8 characters long
              </FieldDescription>
              <FieldError>
                {form.formState.errors.newPassword?.message}
              </FieldError>
            </Field>

            <Field>
              <FieldLabel>Confirm New Password</FieldLabel>
              <Input
                type="password"
                {...form.register("confirmPassword")}
                placeholder="Confirm your new password"
              />
              <FieldError>
                {form.formState.errors.confirmPassword?.message}
              </FieldError>
            </Field>

            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}
            >
              <Button
                type="submit"
                disabled={form.formState.isSubmitting || success}
              >
                {form.formState.isSubmitting
                  ? "Changing..."
                  : success
                    ? "Changed!"
                    : "Change Password"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  onOpenChange(false);
                  setError(null);
                  setSuccess(false);
                  form.reset();
                }}
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
