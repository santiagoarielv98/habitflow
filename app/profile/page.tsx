"use client";

import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useHabits } from "@/hooks/use-habits";
import { format } from "date-fns";
import { ChangePasswordDialog } from "@/components/change-password-dialog";

export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const { habits } = useHabits();
  const [showChangePassword, setShowChangePassword] = useState(false);

  useEffect(() => {
    if (!isPending && !session) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  if (isPending) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const user = session.user;

  // Calcular estadísticas generales
  const totalHabits = habits.length;
  const activeHabits = habits.filter((h) => h.active).length;
  const inactiveHabits = totalHabits - activeHabits;
  const totalRecords = habits.reduce(
    (sum, habit) => sum + (habit.records?.length || 0),
    0,
  );
  const completedRecords = habits.reduce(
    (sum, habit) =>
      sum + (habit.records?.filter((r) => r.completed).length || 0),
    0,
  );

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2rem 1rem",
      }}
    >
      <div style={{ marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2rem", fontWeight: "bold" }}>Profile</h1>
        <p style={{ color: "#6b7280" }}>
          Manage your account settings and view your statistics
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
          gap: "1.5rem",
        }}
      >
        {/* Información del usuario */}
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Email
                </label>
                <p style={{ fontSize: "1rem", marginTop: "0.25rem" }}>
                  {user.email}
                </p>
              </div>

              <Separator />

              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  User ID
                </label>
                <p
                  style={{
                    fontSize: "0.875rem",
                    marginTop: "0.25rem",
                    fontFamily: "monospace",
                    color: "#6b7280",
                  }}
                >
                  {user.id}
                </p>
              </div>

              <Separator />

              <div>
                <label
                  style={{
                    fontSize: "0.875rem",
                    fontWeight: "600",
                    color: "#6b7280",
                  }}
                >
                  Member Since
                </label>
                <p style={{ fontSize: "1rem", marginTop: "0.25rem" }}>
                  {user.createdAt
                    ? format(new Date(user.createdAt), "MMMM dd, yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas generales */}
        <Card>
          <CardHeader>
            <CardTitle>Your Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Total Habits
                </span>
                <Badge variant="secondary" style={{ fontSize: "1rem" }}>
                  {totalHabits}
                </Badge>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Active Habits
                </span>
                <Badge variant="default" style={{ fontSize: "1rem" }}>
                  {activeHabits}
                </Badge>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Inactive Habits
                </span>
                <Badge variant="outline" style={{ fontSize: "1rem" }}>
                  {inactiveHabits}
                </Badge>
              </div>

              <Separator />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Total Days Tracked
                </span>
                <Badge variant="secondary" style={{ fontSize: "1rem" }}>
                  {totalRecords}
                </Badge>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  Days Completed
                </span>
                <Badge
                  style={{
                    fontSize: "1rem",
                    backgroundColor: "#10b981",
                    color: "white",
                  }}
                >
                  {completedRecords}
                </Badge>
              </div>

              {totalRecords > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                    Overall Completion
                  </span>
                  <Badge variant="default" style={{ fontSize: "1rem" }}>
                    {((completedRecords / totalRecords) * 100).toFixed(1)}%
                  </Badge>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Acciones */}
      <Card style={{ marginTop: "1.5rem" }}>
        <CardHeader>
          <CardTitle>Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}
          >
            <Button
              variant="outline"
              onClick={() => router.push("/dashboard")}
              style={{ justifyContent: "flex-start" }}
            >
              📊 Go to Dashboard
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowChangePassword(true)}
              style={{ justifyContent: "flex-start" }}
            >
              🔐 Change Password
            </Button>
            <Separator />
            <Button
              variant="destructive"
              onClick={async () => {
                if (
                  confirm(
                    "Are you sure you want to sign out? You will need to sign in again to access your habits.",
                  )
                ) {
                  const { signOut } = await import("@/lib/auth-client");
                  await signOut();
                  router.push("/");
                }
              }}
              style={{ justifyContent: "flex-start" }}
            >
              🚪 Sign Out
            </Button>
          </div>
        </CardContent>
      </Card>

      <ChangePasswordDialog
        open={showChangePassword}
        onOpenChange={setShowChangePassword}
      />
    </div>
  );
}
