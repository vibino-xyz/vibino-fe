import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";
import { SearchIcon, GitHubIcon, PullRequestIcon, MessageIcon } from "@/components/icons";

const citations = [
  { icon: GitHubIcon, label: "billing-service · retry.go" },
  { icon: PullRequestIcon, label: "Pull request #2841" },
  { icon: MessageIcon, label: "#payments · Mar 14" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* One soft wash of accent for depth — deliberately low contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-[-18rem] h-[36rem] w-[64rem] -translate-x-1/2 rounded-full bg-accent/[0.09] blur-[130px]"
      />

      <div className="relative mx-auto max-w-6xl px-6 pb-10 pt-20 sm:pt-28">
        <div className="mx-auto max-w-4xl text-center">
          <span className="inline-flex animate-fade items-center gap-2 rounded-pill border border-hairline-strong bg-surface px-3.5 py-1.5 text-[13px] text-fg-muted">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-success" />
            Now indexing your company
          </span>

          <h1 className="mt-8 animate-rise text-[2.75rem] font-semibold leading-[1.06] tracking-[-0.03em] text-fg sm:text-6xl">
            Ask your company{" "}
            <span className="text-accent">anything</span>.
          </h1>

          <p
            className="mx-auto mt-6 max-w-2xl animate-rise text-[17px] leading-relaxed text-fg-subtle"
            style={{ animationDelay: "60ms" }}
          >
            Vibino indexes every codebase, meeting, and conversation your team
            produces — then answers questions like the smartest person in the
            room. No onboarding. No searching. Just answers.
          </p>

          <div
            className="mt-10 flex animate-rise flex-col items-center gap-3"
            style={{ animationDelay: "120ms" }}
          >
            <Link href="/auth" className={buttonClasses("primary", "lg")}>
              Get Started Free
            </Link>
            <p className="text-[13px] text-fg-subtle">
              No credit card. 2-minute setup.
            </p>
          </div>
        </div>

        <HeroPreview />
      </div>
    </section>
  );
}

function HeroPreview() {
  return (
    <div
      className="relative mx-auto mt-20 max-w-3xl animate-rise"
      style={{ animationDelay: "200ms" }}
    >
      <div className="rounded-xl border border-hairline bg-surface p-2">
        <div className="rounded-[10px] border border-hairline bg-canvas p-5 sm:p-7">
          {/* Ask bar */}
          <div className="flex items-center gap-3 rounded-pill border border-hairline-strong bg-surface px-4 py-3">
            <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
            <span className="truncate text-sm text-fg">
              How does our billing retry logic handle failed charges?
            </span>
          </div>

          {/* Answer */}
          <div className="mt-6 border-t border-hairline pt-6">
            <p className="text-[15px] leading-relaxed text-fg-muted">
              Charges retry three times with exponential backoff, keyed on the
              idempotency token issued at checkout. After the third failure the
              subscription moves to{" "}
              <span className="text-fg">past_due</span> and the dunning email
              sequence starts.
            </p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <span className="mr-1 text-[11px] uppercase tracking-[0.09em] text-fg-subtle">
                Sources
              </span>
              {citations.map(({ icon: CitationIcon, label }) => (
                <span
                  key={label}
                  className="inline-flex items-center gap-1.5 rounded-badge border border-hairline bg-surface px-2.5 py-1 text-[12px] text-fg-muted"
                >
                  <CitationIcon className="size-3.5 shrink-0 text-fg-subtle" />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Fades the preview into the page instead of ending on a hard edge */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-canvas to-transparent"
      />
    </div>
  );
}
