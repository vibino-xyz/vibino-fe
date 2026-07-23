"use client";

import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { PageContainer } from "@/components/dashboard/Page";
import { SourcesSummary } from "@/components/dashboard/SourcesSummary";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { buttonClasses } from "@/components/ui/Button";
import { MessageIcon, ArrowUpRightIcon, GitHubIcon } from "@/components/icons";
import { CHAT_APP_URL } from "@/lib/config";
import type { GithubConnection, IndexedRepo } from "@/lib/indexing";

export function MemberOverview({
  connection,
  repos,
}: {
  connection: GithubConnection;
  repos: IndexedRepo[];
}) {
  const { user, organization } = useWorkspace();
  const firstName = user.first_name?.trim() || "there";
  const indexedCount = repos.filter((r) => r.state === "indexed").length;
  const hasSources = connection.connected && repos.length > 0;

  return (
    <PageContainer>
      {/* Ask hero */}
      <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface">
        <div
          aria-hidden
          className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-accent/[0.09] blur-[90px]"
        />
        <div className="relative px-6 py-10 sm:px-10">
          <h1 className="text-[24px] font-semibold tracking-[-0.02em] text-fg sm:text-[28px]">
            Welcome, {firstName}.
          </h1>
          <p className="mt-2 max-w-lg text-[15px] leading-relaxed text-fg-subtle">
            Ask {organization.name}&rsquo;s brain anything — about the codebase,
            decisions, and conversations your team has captured. Answers come with
            their sources.
          </p>
          <a
            href={CHAT_APP_URL}
            target="_blank"
            rel="noreferrer"
            className={buttonClasses("primary", "lg", "mt-7")}
          >
            <MessageIcon className="size-[18px]" />
            Open Chat
            <ArrowUpRightIcon className="size-4" />
          </a>
        </div>
      </div>

      {/* Read-only status so members trust the answers */}
      <section className="mt-10">
        <div className="mb-3.5 flex items-center gap-2">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
            What Vibino knows
          </h2>
        </div>

        {hasSources ? (
          <>
            <SourcesSummary connection={connection} repos={repos} />
            <p className="mb-3.5 mt-8 text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
              Indexed repositories
            </p>
            <div className="space-y-2.5">
              {repos.map((repo) => (
                <RepositoryCard
                  key={repo.id}
                  repo={repo}
                  manageable={false}
                  onReindex={() => {}}
                  onChangeBranch={() => {}}
                  onRemove={() => {}}
                />
              ))}
            </div>
            <p className="mt-4 text-[12.5px] text-fg-subtle">
              {indexedCount} of {repos.length} repositories are indexed. Your
              organization&rsquo;s admins manage which sources are connected.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center rounded-card border border-dashed border-hairline-strong bg-surface/40 px-6 py-12 text-center">
            <span className="flex size-10 items-center justify-center rounded-card border border-hairline bg-elevated text-fg-subtle">
              <GitHubIcon className="size-5" />
            </span>
            <h3 className="mt-4 text-[14px] font-medium text-fg">
              No sources connected yet
            </h3>
            <p className="mt-1.5 max-w-sm text-[13px] leading-relaxed text-fg-subtle">
              An admin in {organization.name} needs to connect a source before
              Vibino can answer questions. You&rsquo;ll see indexed repositories
              here once they do.
            </p>
          </div>
        )}
      </section>
    </PageContainer>
  );
}
