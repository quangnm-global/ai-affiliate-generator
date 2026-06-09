"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/errors/error-fallback";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app:global-error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ErrorFallback
          title="Application error"
          description="A critical error occurred. Please refresh the page or try again later."
          reset={reset}
          showDashboardLink={false}
        />
      </body>
    </html>
  );
}
