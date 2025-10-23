"use client";

import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
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
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const { habits, loading, deleteHabit } = useHabits();

  // Estados para filtros
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [sortBy, setSortBy] = useState<"name" | "createdAt" | "frequency">(
    "createdAt",
  );

  // Filtrar y ordenar hábitos
  const filteredAndSortedHabits = useMemo(() => {
    let filtered = [...habits];

    // Filtrar por búsqueda
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (habit) =>
          habit.name.toLowerCase().includes(query) ||
          habit.description?.toLowerCase().includes(query),
      );
    }

    // Filtrar por estado
    if (statusFilter === "active") {
      filtered = filtered.filter((habit) => habit.active);
    } else if (statusFilter === "inactive") {
      filtered = filtered.filter((habit) => !habit.active);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.name.localeCompare(b.name);
        case "frequency":
          return a.frequency.localeCompare(b.frequency);
        case "createdAt":
        default:
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
      }
    });

    return filtered;
  }, [habits, searchQuery, statusFilter, sortBy]);

  const handleClearFilters = () => {
    setSearchQuery("");
    setStatusFilter("all");
    setSortBy("createdAt");
  };

  const hasActiveFilters =
    searchQuery || statusFilter !== "all" || sortBy !== "createdAt";

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
    const { signOut } = await import("@/lib/auth-client");
    await signOut();
    router.push("/");
  };

  return (
    <div className="flex min-h-screen flex-col p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-2">
          <Button onClick={() => router.push("/profile")} variant="outline">
            👤 Profile
          </Button>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
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

          {/* Filtros */}
          {habits.length > 0 && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Búsqueda */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Search
                      </label>
                      <Input
                        placeholder="Search habits..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>

                    {/* Filtro por estado */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Status
                      </label>
                      <Select
                        value={statusFilter}
                        onValueChange={(value: "all" | "active" | "inactive") =>
                          setStatusFilter(value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All Habits</SelectItem>
                          <SelectItem value="active">Active Only</SelectItem>
                          <SelectItem value="inactive">
                            Inactive Only
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Ordenamiento */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Sort by
                      </label>
                      <Select
                        value={sortBy}
                        onValueChange={(
                          value: "name" | "createdAt" | "frequency",
                        ) => setSortBy(value)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt">Most Recent</SelectItem>
                          <SelectItem value="name">Name (A-Z)</SelectItem>
                          <SelectItem value="frequency">Frequency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Botón limpiar filtros y contador */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {filteredAndSortedHabits.length} of {habits.length}{" "}
                        habits
                      </Badge>
                      {hasActiveFilters && (
                        <Badge variant="outline">Filters active</Badge>
                      )}
                    </div>
                    {hasActiveFilters && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearFilters}
                      >
                        Clear filters
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

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
          ) : filteredAndSortedHabits.length === 0 ? (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-muted-foreground">
                  No habits match your filters. Try adjusting your search.
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {filteredAndSortedHabits.map((habit) => (
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
