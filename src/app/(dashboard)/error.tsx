"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/errors/error-fallback";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[dashboard:error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <ErrorFallback
      reset={reset}
      description="Dashboard failed to load. Try again or check your connection."
    />
  );
}
