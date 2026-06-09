import { getTranslations } from "next-intl/server";
import { Check } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface PricingSectionProps {
  isLoggedIn: boolean;
}

const planKeys = ["free", "pro", "scale"] as const;

export async function PricingSection({ isLoggedIn }: PricingSectionProps) {
  const t = await getTranslations("landing.pricing");

  return (
    <section id="pricing" className="border-t bg-muted/20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {planKeys.map((planKey) => {
            const highlighted = planKey === "pro";
            const features = [0, 1, 2, 3, 4].map((i) =>
              t(`plans.${planKey}.features.${i}`)
            );

            return (
              <Card
                key={planKey}
                className={`relative flex flex-col ${
                  highlighted
                    ? "border-primary shadow-lg shadow-primary/10"
                    : "border-border/60"
                }`}
              >
                {highlighted && (
                  <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                    {t("mostPopular")}
                  </Badge>
                )}
                <CardHeader>
                  <CardTitle>{t(`plans.${planKey}.name`)}</CardTitle>
                  <CardDescription>
                    {t(`plans.${planKey}.description`)}
                  </CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold">
                      {t(`plans.${planKey}.price`)}
                    </span>
                    <span className="text-muted-foreground">
                      {t(`plans.${planKey}.period`)}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="flex-1">
                  <ul className="space-y-3">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full"
                    variant={highlighted ? "default" : "outline"}
                    render={
                      <Link href={isLoggedIn ? "/dashboard" : "/login"} />
                    }
                  >
                    {t(`plans.${planKey}.cta`)}
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </section>
  );
}
