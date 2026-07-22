import { BoltIcon, DocumentIcon, GraphIcon, ShieldIcon } from "@/components/icons";

const features = [
  {
    icon: BoltIcon,
    title: "Indexed in minutes",
    body: "Point Vibino at GitHub and it maps every repository, commit and review before your coffee lands.",
  },
  {
    icon: GraphIcon,
    title: "One graph, every source",
    body: "Code, threads, tickets and transcripts resolve into a single connected model of how your company actually works.",
  },
  {
    icon: DocumentIcon,
    title: "Answers with receipts",
    body: "Every response cites the exact file, pull request or meeting it came from. Nothing to take on faith.",
  },
  {
    icon: ShieldIcon,
    title: "Private by default",
    body: "Your data stays yours. Permissions are inherited from the source, and nothing is ever used for training.",
  },
];

export function Features() {
  return (
    <section id="features" className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <h2 className="text-3xl font-semibold text-fg sm:text-[2.25rem]">
          Institutional memory that never leaves
        </h2>
        <p className="mt-4 text-[17px] leading-relaxed text-fg-subtle">
          The context your team built up over years, available to everyone on
          day one.
        </p>
      </div>

      <div className="mt-14 grid gap-4 sm:grid-cols-2">
        {features.map(({ icon: FeatureIcon, title, body }) => (
          <article
            key={title}
            className="group rounded-card border border-hairline bg-surface p-7 transition-colors hover:border-hairline-strong"
          >
            <span className="inline-flex size-9 items-center justify-center rounded-card border border-hairline bg-elevated text-fg-muted transition-colors group-hover:text-fg">
              <FeatureIcon className="size-[18px]" />
            </span>
            <h3 className="mt-5 text-[15px] font-semibold text-fg">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-subtle">{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
