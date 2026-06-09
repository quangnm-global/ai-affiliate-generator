import Link from "next/link";

import { GenerationListItem } from "@/components/history/generation-list-item";
import { Button } from "@/components/ui/button";
import type { Generation } from "@/types/database";

interface GenerationListProps {
  generations: Generation[];
  query?: string;
}

export function GenerationList({ generations, query }: GenerationListProps) {
  if (generations.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed py-16 text-center">
        {query ? (
          <>
            <p className="text-sm text-muted-foreground">
              No generations found for &ldquo;{query}&rdquo;
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2"
              render={<Link href="/history" />}
            >
              Clear search
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              No generations in your history yet.
            </p>
            <Button
              variant="link"
              size="sm"
              className="mt-2"
              render={<Link href="/generate" />}
            >
              Create your first generation →
            </Button>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="divide-y overflow-hidden rounded-2xl border">
      {generations.map((gen) => (
        <GenerationListItem key={gen.id} generation={gen} />
      ))}
    </div>
  );
}
