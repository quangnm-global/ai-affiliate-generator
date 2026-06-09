"use client";

import { Search, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { useTransition } from "react";

import { useRouter } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildHistoryUrl } from "@/lib/validations/history";

interface HistorySearchFormProps {
  defaultQuery?: string;
}

export function HistorySearchForm({ defaultQuery = "" }: HistorySearchFormProps) {
  const t = useTranslations("history");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = (formData.get("q") as string)?.trim();

    startTransition(() => {
      router.push(buildHistoryUrl({ q: q || undefined, page: 1 }));
    });
  }

  function handleClear() {
    startTransition(() => {
      router.push("/history");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <div className="relative flex-1">
        <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultQuery}
          placeholder={t("searchPlaceholder")}
          className="bg-background pl-9"
          disabled={pending}
        />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        {t("search")}
      </Button>
      {defaultQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          disabled={pending}
          aria-label={t("clear")}
        >
          <X className="size-4" />
        </Button>
      )}
    </form>
  );
}
