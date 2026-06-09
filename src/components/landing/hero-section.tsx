import Link from "next/link";
import { ArrowRight, Play, Sparkles, Zap } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  isLoggedIn: boolean;
}

export function HeroSection({ isLoggedIn }: HeroSectionProps) {
  const ctaHref = isLoggedIn ? "/generate" : "/login";

  return (
    <section className="relative overflow-hidden px-4 pb-20 pt-16 sm:px-6 sm:pt-24">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute right-0 top-1/3 h-[300px] w-[400px] rounded-full bg-violet-500/5 blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-3xl text-center">
          <Badge variant="secondary" className="mb-6 gap-1.5 px-3 py-1">
            <Zap className="size-3" />
            AI-powered affiliate content
          </Badge>

          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl lg:leading-[1.1]">
            Generate viral affiliate content{" "}
            <span className="bg-gradient-to-r from-primary to-violet-600 bg-clip-text text-transparent">
              in seconds
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Create TikTok scripts, product reviews, and sales captions optimized
            for TikTok Shop — built for affiliate marketers and Vietnamese
            audiences.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="gap-2 px-8" render={<Link href={ctaHref} />}>
              Start free — 5 credits
              <ArrowRight className="size-4" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="gap-2"
              render={<a href="#how-it-works" />}
            >
              <Play className="size-4" />
              See how it works
            </Button>
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            No credit card required · 1 credit per generation
          </p>
        </div>

        {/* Product preview mockup */}
        <div className="relative mx-auto mt-16 max-w-4xl">
          <div className="rounded-2xl border bg-card/50 p-1 shadow-2xl shadow-primary/5 backdrop-blur-sm">
            <div className="rounded-xl border bg-background p-6 sm:p-8">
              <div className="mb-4 flex items-center gap-2">
                <div className="size-3 rounded-full bg-red-400/80" />
                <div className="size-3 rounded-full bg-amber-400/80" />
                <div className="size-3 rounded-full bg-emerald-400/80" />
                <span className="ml-2 text-xs text-muted-foreground">
                  New Generation
                </span>
              </div>
              <div className="space-y-4">
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Product
                  </p>
                  <p className="mt-1 font-medium">
                    Kem chống nắng nâng tone SPF50+
                  </p>
                </div>
                <div className="rounded-lg border bg-muted/30 p-4">
                  <p className="text-xs font-medium text-muted-foreground">
                    Generated output
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    &ldquo;POV: Bạn vừa phát hiện kem chống nắng 200k mà da
                    nâng tone tự nhiên...&rdquo;
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Sparkles className="size-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    10 hooks · 1 script · 1 caption · 10 hashtags
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
