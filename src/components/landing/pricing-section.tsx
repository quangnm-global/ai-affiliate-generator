import Link from "next/link";
import { Check } from "lucide-react";

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

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Affiliate AI",
    features: [
      "5 credits on signup",
      "All content types",
      "TikTok Shop scripts",
      "Generation history",
      "1 credit per generation",
    ],
    cta: "Get started free",
    highlighted: false,
  },
  {
    name: "Pro",
    price: "$19",
    period: "/month",
    description: "For active affiliate marketers",
    features: [
      "100 credits per month",
      "Priority generation",
      "Export to clipboard",
      "Search history",
      "Email support",
    ],
    cta: "Start Pro trial",
    highlighted: true,
  },
  {
    name: "Scale",
    price: "$49",
    period: "/month",
    description: "For teams and agencies",
    features: [
      "500 credits per month",
      "Bulk generation",
      "API access",
      "Team workspace",
      "Priority support",
    ],
    cta: "Contact sales",
    highlighted: false,
  },
];

export function PricingSection({ isLoggedIn }: PricingSectionProps) {
  return (
    <section id="pricing" className="border-t bg-muted/20 px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-muted-foreground">
            Start free. Upgrade when you&apos;re ready to scale.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative flex flex-col ${
                plan.highlighted
                  ? "border-primary shadow-lg shadow-primary/10"
                  : "border-border/60"
              }`}
            >
              {plan.highlighted && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                  Most popular
                </Badge>
              )}
              <CardHeader>
                <CardTitle>{plan.name}</CardTitle>
                <CardDescription>{plan.description}</CardDescription>
                <div className="mt-4">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground">{plan.period}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <ul className="space-y-3">
                  {plan.features.map((feature) => (
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
                  variant={plan.highlighted ? "default" : "outline"}
                  render={
                    <Link href={isLoggedIn ? "/dashboard" : "/login"} />
                  }
                >
                  {plan.cta}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
