const steps = [
  {
    title: "Connect your sources",
    body: "Start with GitHub in two clicks. Slack, Jira, Teams and Google Meet follow whenever you are ready.",
  },
  {
    title: "Vibino builds the graph",
    body: "Every repository, thread and transcript is parsed, linked to the people behind it, and kept in sync.",
  },
  {
    title: "Just ask",
    body: "Ask in plain English from anywhere in the product. Answers arrive with the sources they came from.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="border-y border-hairline bg-surface/40"
    >
      <div className="mx-auto max-w-6xl px-6 py-24">
        <h2 className="max-w-2xl text-3xl font-semibold text-fg sm:text-[2.25rem]">
          How it works
        </h2>

        <ol className="mt-14 grid gap-10 md:grid-cols-3 md:gap-8">
          {steps.map((step, index) => (
            <li key={step.title} className="relative">
              <div className="flex items-center gap-3">
                <span className="nums inline-flex size-7 items-center justify-center rounded-full border border-hairline-strong bg-canvas text-[12px] font-medium text-fg-muted">
                  {index + 1}
                </span>
                <span
                  aria-hidden
                  className="hidden h-px flex-1 bg-hairline md:block"
                />
              </div>
              <h3 className="mt-5 text-[15px] font-semibold text-fg">
                {step.title}
              </h3>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-fg-subtle">
                {step.body}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
