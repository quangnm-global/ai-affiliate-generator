"use client";

import { useEffect } from "react";

import { ErrorFallback } from "@/components/errors/error-fallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[app:error]", {
      message: error.message,
      digest: error.digest,
      stack: error.stack,
    });
  }, [error]);

  return (
    <ErrorFallback
      reset={reset}
      description="We could not load this page. Your session and credits are safe."
    />
  );
}
