"use client";

import { useTranslations } from "next-intl";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { createGeneration } from "@/actions/generations";
import {
  CreditInfo,
  GenerateButton,
  NoCreditsBanner,
} from "@/components/credits/credit-guard";
import { ContentTypeSelect } from "@/components/generate/content-type-select";
import { GenerationPreview } from "@/components/generate/generation-preview";
import { useRouter } from "@/i18n/navigation";
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
import { TONE_KEYS } from "@/lib/i18n/labels";
import {
  TONE_OPTIONS,
  type ContentType,
  type Tone,
} from "@/types/generation";

interface GenerationFormProps {
  initialCredits?: number;
}

export function GenerationForm({ initialCredits = 0 }: GenerationFormProps) {
  const t = useTranslations("generate");
  const tTones = useTranslations("tones");
  const tErrors = useTranslations("errors");
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
      toast.error(tErrors("noCredits"));
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
      toast.success(tErrors("contentGenerated"));
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
          <h2 className="text-lg font-medium">{t("whatToCreate")}</h2>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            {t("fillDetails")}
          </p>
          <div className="mt-3">
            <CreditInfo credits={credits} />
          </div>
        </div>
      )}

      {(output || loading) && (
        <GenerationPreview
          title={t("generatedContent")}
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
            <Label htmlFor="title">{t("titleLabel")}</Label>
            <Input
              id="title"
              name="title"
              placeholder={t("titlePlaceholder")}
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
            <Label htmlFor="productName">{t("productName")}</Label>
            <Input
              id="productName"
              name="productName"
              placeholder={t("productNamePlaceholder")}
              className="bg-background"
              required
              disabled={!canGenerate(credits)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="affiliateUrl">{t("affiliateUrl")}</Label>
            <Input
              id="affiliateUrl"
              name="affiliateUrl"
              type="url"
              placeholder={t("affiliateUrlPlaceholder")}
              className="bg-background"
              disabled={!canGenerate(credits)}
            />
          </div>

          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="keywords">{t("keywords")}</Label>
            <Textarea
              id="keywords"
              name="keywords"
              placeholder={t("keywordsPlaceholder")}
              rows={2}
              className="resize-none bg-background"
              disabled={!canGenerate(credits)}
            />
          </div>

          <div className="space-y-2">
            <Label>{t("tone")}</Label>
            <Select
              value={tone}
              onValueChange={(v) => setTone(v as Tone)}
              disabled={!canGenerate(credits)}
            >
              <SelectTrigger className="w-full bg-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {TONE_OPTIONS.map((toneOption) => (
                  <SelectItem key={toneOption} value={toneOption}>
                    {tTones(TONE_KEYS[toneOption])}
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
