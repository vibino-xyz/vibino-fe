import Link from "next/link";
import { buttonClasses } from "@/components/ui/Button";

export function ClosingCta() {
  return (
    <section className="mx-auto max-w-6xl px-6 pb-24">
      <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface px-6 py-20 text-center">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-full h-64 w-[40rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/[0.14] blur-[110px]"
        />
        <div className="relative">
          <h2 className="text-3xl font-semibold text-fg sm:text-[2.25rem]">
            Start building your company&rsquo;s brain
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-[17px] leading-relaxed text-fg-subtle">
            Connect one repository and watch the answers start arriving.
          </p>
          <div className="mt-9 flex flex-col items-center gap-3">
            <Link href="/auth" className={buttonClasses("primary", "lg")}>
              Get Started Free
            </Link>
            <p className="text-[13px] text-fg-subtle">
              No credit card. 2-minute setup.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
