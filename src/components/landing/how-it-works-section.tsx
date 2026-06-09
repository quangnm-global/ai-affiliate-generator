const steps = [
  {
    step: "01",
    title: "Add your product",
    description:
      "Enter the product name and description. Our AI understands features, benefits, and selling points.",
  },
  {
    step: "02",
    title: "Choose content type",
    description:
      "Pick from TikTok scripts, product reviews, comparisons, buying guides, or social posts.",
  },
  {
    step: "03",
    title: "Generate & publish",
    description:
      "Get ready-to-use content in seconds. Copy, download, and publish to TikTok Shop or any platform.",
  },
];

export function HowItWorksSection() {
  return (
    <section id="how-it-works" className="px-4 py-20 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            How it works
          </h2>
          <p className="mt-4 text-muted-foreground">
            Three steps from product to publish-ready content.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((item, i) => (
            <div key={item.step} className="relative text-center">
              {i < steps.length - 1 && (
                <div className="absolute top-8 left-[calc(50%+2rem)] hidden h-px w-[calc(100%-4rem)] bg-border md:block" />
              )}
              <div className="mx-auto flex size-16 items-center justify-center rounded-full border-2 border-primary/20 bg-primary/5 text-xl font-bold text-primary">
                {item.step}
              </div>
              <h3 className="mt-6 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
