import { getTranslations } from "next-intl/server";
import {
  Coins,
  Globe,
  History,
  Sparkles,
  Target,
  Zap,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const featureKeys = [
  { key: "aiContent", icon: Sparkles },
  { key: "tiktok", icon: Target },
  { key: "instant", icon: Zap },
  { key: "multiFormat", icon: Globe },
  { key: "history", icon: History },
  { key: "credits", icon: Coins },
] as const;

export async function FeaturesSection() {
  const t = await getTranslations("landing.features");

  return (
    <section id="features" className="border-t bg-muted/20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featureKeys.map(({ key, icon: Icon }) => (
            <Card
              key={key}
              className="border-border/60 bg-background/60 backdrop-blur-sm transition-shadow hover:shadow-md"
            >
              <CardHeader>
                <div className="mb-2 flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <CardTitle className="text-base">
                  {t(`items.${key}.title`)}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {t(`items.${key}.description`)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
