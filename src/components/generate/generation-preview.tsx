"use client";

import { useTranslations } from "next-intl";
import { useState } from "react";
import { Check, Copy, Sparkles } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";

interface GenerationPreviewProps {
  title: string;
  output: string | null;
  status: "pending" | "completed" | "failed";
  errorMessage?: string | null;
}

export function GenerationPreview({
  title,
  output,
  status,
  errorMessage,
}: GenerationPreviewProps) {
  const t = useTranslations("generate");
  const tHistory = useTranslations("history");
  const tErrors = useTranslations("errors");
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    toast.success(t("copiedToClipboard"));
    setTimeout(() => setCopied(false), 2000);
  }

  if (status === "pending" && !output) {
    return (
      <div className="rounded-2xl border bg-muted/20 p-6">
        <div className="flex items-center gap-3 text-sm text-muted-foreground">
          <Sparkles className="size-4 animate-pulse" />
          {t("generatingContent")}
        </div>
        <div className="mt-4 space-y-2">
          <div className="h-3 w-3/4 animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-full animate-pulse rounded-full bg-muted" />
          <div className="h-3 w-5/6 animate-pulse rounded-full bg-muted" />
        </div>
      </div>
    );
  }

  if (status === "failed") {
    return (
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-6">
        <p className="text-sm font-medium text-destructive">
          {tErrors("generationFailed")}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {errorMessage ?? tErrors("genericDescription")}
        </p>
      </div>
    );
  }

  if (!output) return null;

  return (
    <div className="rounded-2xl border bg-card">
      <div className="flex items-center justify-between border-b px-5 py-3">
        <p className="text-sm font-medium">{title}</p>
        <Button variant="ghost" size="sm" onClick={handleCopy} className="gap-1.5">
          {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
          {tHistory("copy")}
        </Button>
      </div>
      <div className="max-h-[60vh] overflow-auto p-5">
        <pre className="whitespace-pre-wrap text-sm leading-relaxed">{output}</pre>
      </div>
    </div>
  );
}
