"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildHistoryUrl } from "@/lib/validations/history";

interface HistorySearchFormProps {
  defaultQuery?: string;
}

export function HistorySearchForm({ defaultQuery = "" }: HistorySearchFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
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
          key={searchParams.get("q") ?? "empty"}
          defaultValue={defaultQuery}
          placeholder="Search by product name..."
          className="bg-background pl-9"
          disabled={pending}
        />
      </div>
      <Button type="submit" variant="secondary" disabled={pending}>
        Search
      </Button>
      {defaultQuery && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={handleClear}
          disabled={pending}
          aria-label="Clear search"
        >
          <X className="size-4" />
        </Button>
      )}
    </form>
  );
}
