import { SectionLabel } from "@/components/ui/Badge";
import { ArrowUpRightIcon } from "@/components/icons";
import { SUGGESTED_QUESTIONS } from "@/lib/mock-data";

export function SuggestedQuestions() {
  return (
    <section className="mt-8">
      <SectionLabel>Try asking</SectionLabel>

      <div className="grid gap-2.5">
        {SUGGESTED_QUESTIONS.map((item) => (
          <button
            key={item.question}
            type="button"
            className="group flex items-start gap-4 rounded-card border border-hairline bg-surface px-5 py-4 text-left transition-colors hover:border-hairline-strong hover:bg-elevated"
          >
            <span className="min-w-0 flex-1">
              <span className="block text-[13.5px] text-fg">
                {item.question}
              </span>
              <span className="mt-1 block text-[12.5px] text-fg-subtle">
                {item.scope}
              </span>
            </span>
            <ArrowUpRightIcon className="mt-0.5 size-4 shrink-0 text-fg-subtle transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-fg" />
          </button>
        ))}
      </div>
    </section>
  );
}
