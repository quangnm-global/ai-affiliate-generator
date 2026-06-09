import {
  Coins,
  Globe,
  History,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Sparkles,
    title: "AI content generation",
    description:
      "Generate product reviews, TikTok scripts, sales captions, and hashtags with one click.",
  },
  {
    icon: Target,
    title: "TikTok Shop optimized",
    description:
      "Prompts tuned for affiliate marketing, high engagement, and Vietnamese audiences.",
  },
  {
    icon: Zap,
    title: "Instant results",
    description:
      "Get 10 viral hooks, a full script, caption, and hashtags in under 30 seconds.",
  },
  {
    icon: Globe,
    title: "Multi-format output",
    description:
      "Product reviews, comparisons, buying guides, and social posts — all from one platform.",
  },
  {
    icon: History,
    title: "Generation history",
    description:
      "Search, paginate, and revisit every piece of content you've created.",
  },
  {
    icon: Coins,
    title: "Simple credit system",
    description:
      "1 credit per generation. Start with 5 free credits — no subscription required.",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="border-t bg-muted/20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Everything you need to scale affiliate content
          </h2>
          <p className="mt-4 text-muted-foreground">
            Stop spending hours writing scripts. Focus on selling while AI
            handles the creative.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, description }) => (
            <Card
              key={title}
              className="border-border/60 bg-background/60 backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-base">{title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
