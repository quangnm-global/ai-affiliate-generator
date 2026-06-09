"use client";

import { useTranslations } from "next-intl";
import { useEffect } from "react";

import { ErrorFallback } from "@/components/errors/error-fallback";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations("errors");

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
      description={t("pageSafe")}
    />
  );
}
