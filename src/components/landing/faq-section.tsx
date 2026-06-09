import { getTranslations } from "next-intl/server";

const faqKeys = ["what", "credits", "types", "vietnamese", "card"] as const;

export async function FaqSection() {
  const t = await getTranslations("landing.faq");

  return (
    <section id="faq" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            {t("title")}
          </h2>
          <p className="mt-4 text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="mt-12 space-y-3">
          {faqKeys.map((key) => (
            <details
              key={key}
              className="group rounded-xl border bg-card px-5 py-4 open:shadow-sm"
            >
              <summary className="cursor-pointer list-none font-medium marker:hidden [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {t(`items.${key}.question`)}
                  <span className="text-muted-foreground transition-transform group-open:rotate-45">
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {t(`items.${key}.answer`)}
              </p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
