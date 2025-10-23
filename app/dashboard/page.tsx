"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useHabits } from "@/hooks/use-habits";
import { HabitFormDialog } from "@/components/habit-form-dialog";
import { HabitCard } from "@/components/habit-card";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { habits, loading, deleteHabit } = useHabits();

  if (isPending) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  if (!session) {
    router.push("/sign-in");
    return null;
  }

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button onClick={handleSignOut} variant="outline">
          Sign Out
        </Button>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Welcome back!</CardTitle>
            <CardDescription>
              You are signed in as {session.user.email}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-2">
              <div>
                <span className="font-medium">Name:</span> {session.user.name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {session.user.email}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Your Habits</h2>
            <HabitFormDialog />
          </div>

          {loading ? (
            <div className="text-center py-8">Loading habits...</div>
          ) : habits.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  No habits yet. Create your first habit to get started!
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {habits.map((habit) => (
                <HabitCard
                  key={habit.id}
                  habit={habit}
                  onDelete={deleteHabit}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
