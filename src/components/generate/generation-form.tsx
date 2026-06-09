"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { toast } from "sonner";

import { createGeneration } from "@/actions/generations";
import {
  CreditInfo,
  GenerateButton,
  NoCreditsBanner,
} from "@/components/credits/credit-guard";
import { ContentTypeSelect } from "@/components/generate/content-type-select";
import { GenerationPreview } from "@/components/generate/generation-preview";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCredits } from "@/hooks/use-credits";
import { canGenerate } from "@/lib/credits/check";
import {
  TONE_OPTIONS,
  type ContentType,
  type Tone,
} from "@/types/generation";

interface GenerationFormProps {
  initialCredits?: number;
}

export function GenerationForm({ initialCredits = 0 }: GenerationFormProps) {
  const router = useRouter();
  const { credits: liveCredits } = useCredits();
  const credits = liveCredits ?? initialCredits;

  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState<string | null>(null);
  const [contentType, setContentType] = useState<ContentType>("product_review");
  const [tone, setTone] = useState<Tone>("professional");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canGenerate(credits)) {
      toast.error("You have no credits left.");
      return;
    }

    setLoading(true);
    setOutput(null);

    const formData = new FormData(e.currentTarget);
    const keywordsRaw = (formData.get("keywords") as string) ?? "";
    const keywords = keywordsRaw
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean);

    const result = await createGeneration({
      title: formData.get("title") as string,
      contentType,
      productName: formData.get("productName") as string,
      affiliateUrl: (formData.get("affiliateUrl") as string) || undefined,
      keywords: keywords.length ? keywords : undefined,
      tone,
    });

    setLoading(false);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.output) setOutput(result.output);

    if (result.id) {
      toast.success("Content generated successfully");
      router.refresh();
    }
  }

  return (
    <div className="space-y-8">
      <NoCreditsBanner credits={credits} />

      {!output && !loading && (
        <div className="flex flex-col items-center py-8 text-center sm:py-12">
          <div className="mb-4 flex size-12 items-center justify-center rounded-2xl bg-muted">
            <Sparkles className="size-6 text-muted-foreground" />
          </div>
          <h2 className="text-lg font-medium">What would you like to create?</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Fill in the details below to generate affiliate content with AI.
          </p>
          <div className="mt-3">
            <CreditInfo credits={credits} />
          </div>
        </div>
      )}

      {(output || loading) && (
        <GenerationPreview
          title="Generated content"
          output={output}
          status={loading ? "pending" : output ? "completed" : "pending"}
        />
      )}

      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border bg-card p-5 shadow-sm sm:p-6"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              name="title"
              placeholder="Best Wireless Earbuds 2025"
              className="bg-background"
              required
              disabled={!canGenerate(credits)}
            />
          </div>

          <ContentTypeSelect
            value={contentType}
            onChange={setContentType}
            disabled={!canGenerate(credits)}
          />

          <div className="space-y-2">
            <Label htmlFor="productName">Product name</Label>
            <Input
              id="productName"
              name="productName"
              placeholder="Sony WF-1000XM5"
              className="bg-background"
              required
              disabled={!canGenerate(credits)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="affiliateUrl">Affiliate URL (optional)</Label>
            <Input
              id="affiliateUrl"
              name="affiliateUrl"
              type="url"
              placeholder="https://amazon.com/..."
              className="bg-background"
              disabled={!canGenerate(credits)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="keywords">Keywords (comma-separated)</Label>
            <Textarea
              id="keywords"
              name="keywords"
              placeholder="wireless earbuds, noise cancelling"
              rows={2}
              className="resize-none bg-background"
              disabled={!canGenerate(credits)}
            />
          </div>

          <div className="space-y-2">
            <Label>Tone</Label>
            <Select
              value={tone}
              onValueChange={(v) => setTone(v as Tone)}
              disabled={!canGenerate(credits)}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t.charAt(0).toUpperCase() + t.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between gap-4">
          <CreditInfo credits={credits} />
          <GenerateButton credits={credits} loading={loading} />
        </div>
      </form>
    </div>
  );
}
