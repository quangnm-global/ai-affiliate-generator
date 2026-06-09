"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";

interface ErrorFallbackProps {
  title?: string;
  description?: string;
  reset?: () => void;
  showDashboardLink?: boolean;
}

export function ErrorFallback({
  title = "Something went wrong",
  description = "An unexpected error occurred. Please try again or return to the dashboard.",
  reset,
  showDashboardLink = true,
}: ErrorFallbackProps) {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-md text-sm text-muted-foreground">{description}</p>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-2">
        {reset ? (
          <Button onClick={reset}>Try again</Button>
        ) : null}
        {showDashboardLink ? (
          <Button variant="outline" render={<Link href="/dashboard" />}>
            Go to dashboard
          </Button>
        ) : (
          <Button variant="outline" render={<Link href="/" />}>
            Go home
          </Button>
        )}
      </div>
    </div>
  );
}
