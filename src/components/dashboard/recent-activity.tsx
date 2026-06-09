import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { GenerationListItem } from "@/components/history/generation-list-item";
import type { Generation } from "@/types/database";

interface RecentActivityProps {
  generations: Generation[];
}

export function RecentActivity({ generations }: RecentActivityProps) {
  return (
    <section className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Recent activity</h3>
        {generations.length > 0 && (
          <Link
            href="/history"
            className="flex items-center gap-1 text-xs text-muted-foreground transition-colors hover:text-foreground"
          >
            View all
            <ChevronRight className="size-3" />
          </Link>
        )}
      </div>

      {generations.length === 0 ? (
        <div className="rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            No content generated yet.
          </p>
          <Link
            href="/generate"
            className="mt-2 inline-block text-sm font-medium text-primary hover:underline"
          >
            Create your first generation →
          </Link>
        </div>
      ) : (
        <div className="divide-y rounded-xl border">
          {generations.map((gen) => (
            <GenerationListItem key={gen.id} generation={gen} />
          ))}
        </div>
      )}
    </section>
  );
}
