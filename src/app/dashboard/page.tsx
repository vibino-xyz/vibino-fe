import type { Metadata } from "next";
import Link from "next/link";
import { TopBar } from "@/components/dashboard/TopBar";
import { INTEGRATION_ICONS } from "@/components/dashboard/integration-icons";
import { buttonClasses } from "@/components/ui/Button";
import { GitHubIcon, SearchIcon } from "@/components/icons";
import { ORG, PENDING_INTEGRATIONS } from "@/lib/mock-data";

export const metadata: Metadata = { title: "Dashboard" };

export default function DashboardEmptyPage() {
  return (
    <div className="min-h-dvh">
      <TopBar showAsk={false} />

      {/* Fills the space under the 56px top bar so the state reads as
          intentional rather than stranded at the top of the page */}
      <main className="mx-auto flex min-h-[calc(100dvh-3.5rem)] max-w-[720px] flex-col justify-center px-6 py-16">
        <div className="animate-rise text-center">
          <h1 className="text-[28px] font-semibold leading-tight text-fg sm:text-[32px]">
            Welcome, {ORG.user.firstName}. Let&rsquo;s build your company&rsquo;s
            brain.
          </h1>
          <p className="mt-3 text-[15px] text-fg-subtle">
            Start by connecting your first source.
          </p>

          <Link
            href="/dashboard/active"
            className={buttonClasses("primary", "lg", "mt-9")}
          >
            <GitHubIcon className="size-[18px]" />
            Connect GitHub
          </Link>
        </div>

        {/* Disabled preview of the thing they unlock by connecting */}
        <div
          className="mt-14 animate-rise"
          style={{ animationDelay: "80ms" }}
          aria-hidden
        >
          <div className="flex h-12 w-full cursor-not-allowed items-center gap-3 rounded-pill border border-hairline bg-surface/60 px-5 opacity-60">
            <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
            <span className="min-w-0 flex-1 truncate text-sm text-fg-subtle">
              Connect a source to start asking questions...
            </span>
          </div>
        </div>

        <div className="mt-14 animate-rise" style={{ animationDelay: "140ms" }}>
          <h2 className="text-center text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
            Coming soon
          </h2>

          <div className="mt-5 grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
            {PENDING_INTEGRATIONS.map((integration) => {
              const Glyph = INTEGRATION_ICONS[integration.id];
              return (
                <div
                  key={integration.id}
                  className="flex flex-col items-center gap-2.5 rounded-card border border-hairline bg-surface/50 px-3 py-5 text-center"
                >
                  <Glyph className="size-5 text-fg-subtle/45" />
                  <span className="text-[12.5px] text-fg-subtle/70">
                    {integration.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
