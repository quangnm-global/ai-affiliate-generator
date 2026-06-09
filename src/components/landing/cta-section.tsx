import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  isLoggedIn: boolean;
}

export function CtaSection({ isLoggedIn }: CtaSectionProps) {
  const href = isLoggedIn ? "/generate" : "/login";

  return (
    <section className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <div className="relative overflow-hidden rounded-3xl bg-primary px-6 py-16 text-center text-primary-foreground sm:px-12">
          <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.12),transparent_50%)]" />
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to 10x your affiliate content?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-primary-foreground/80">
            Join affiliate marketers who save hours every week. Start with 5
            free credits — no credit card required.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="mt-8 gap-2 px-8"
            render={<Link href={href} />}
          >
            {isLoggedIn ? "Create content now" : "Get started for free"}
            <ArrowRight className="size-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
