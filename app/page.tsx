import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="flex flex-col items-center gap-8 text-center max-w-2xl">
        <div className="flex flex-col gap-4">
          <h1 className="text-5xl font-bold tracking-tight">
            Welcome to HabitFlow
          </h1>
          <p className="text-xl text-muted-foreground">
            Track your habits and build better routines
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button asChild size="lg">
            <Link href="/sign-up">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>

        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <p>✨ Simple habit tracking</p>
          <p>📊 Visual progress charts</p>
          <p>🎯 Achieve your goals</p>
        </div>
      </div>
    </div>
  );
}
