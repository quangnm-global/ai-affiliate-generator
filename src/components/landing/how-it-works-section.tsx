import { getTranslations } from "next-intl/server";

const stepKeys = ["product", "type", "publish"] as const;

export async function HowItWorksSection() {
  const t = await getTranslations("landing.howItWorks");

  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {stepKeys.map((key, i) => (
            <div key={key} className="relative text-center">
              {i < stepKeys.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border md:block" />
              )}
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-xl font-bold text-primary">
                {String(i + 1).padStart(2, "0")}
              </div>
              <h3 className="mt-6 text-lg font-semibold">
                {t(`steps.${key}.title`)}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(`steps.${key}.description`)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
