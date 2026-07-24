"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { PageContainer, PageHeader } from "@/components/dashboard/Page";
import { ConnectGithubCard } from "@/components/dashboard/ConnectGithubCard";
import { SourcesSummary } from "@/components/dashboard/SourcesSummary";
import { RepositoryCard } from "@/components/dashboard/RepositoryCard";
import { RepoPickerDialog } from "@/components/dashboard/RepoPickerDialog";
import { BranchDialog } from "@/components/dashboard/BranchDialog";
import { ComingSoonSources } from "@/components/dashboard/ComingSoonSources";
import { MemberOverview } from "@/components/dashboard/MemberOverview";
import { Button } from "@/components/ui/Button";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { PlusIcon, GitHubIcon } from "@/components/icons";
import { githubApi } from "@/lib/github";
import { indexingApi, type IndexedRepo } from "@/lib/indexing";
import type { GithubConnection } from "@/lib/api";

export default function OverviewPage() {
  const { isManager } = useWorkspace();
  const [connection, setConnection] = useState<GithubConnection | null>(null);
  const [repos, setRepos] = useState<IndexedRepo[] | null>(null);

  const [pickerOpen, setPickerOpen] = useState(false);
  const [branchRepo, setBranchRepo] = useState<IndexedRepo | null>(null);
  const [removeRepo, setRemoveRepo] = useState<IndexedRepo | null>(null);

  const refresh = useCallback(async () => {
    const [conn, list] = await Promise.all([
      githubApi.getConnection(),
      indexingApi.listIndexedRepos(),
    ]);
    setConnection(conn);
    setRepos(list);
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll while any repo is still working, so progress advances live.
  const active = repos?.some((r) => r.state === "syncing" || r.state === "queued");
  const pollRef = useRef(active);
  pollRef.current = active;
  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => {
      indexingApi.listIndexedRepos().then(setRepos);
    }, 1500);
    return () => clearInterval(timer);
  }, [active]);

  if (connection === null || repos === null) {
    return <OverviewSkeleton />;
  }

  // --- Member (read-only) ---
  if (!isManager) {
    return <MemberOverview connection={connection} repos={repos} />;
  }

  // --- Admin: not connected ---
  if (!connection.connected) {
    return (
      <PageContainer>
        <PageHeader
          title="Overview"
          description="Connect a source and Vibino builds your company's brain from it."
        />
        <ConnectGithubCard configured={connection.configured} />
        <ComingSoonSources />
      </PageContainer>
    );
  }

  // --- Admin: connected ---
  return (
    <PageContainer>
      <PageHeader
        title="Overview"
        description="Manage the repositories Vibino indexes and watch their status."
        actions={
          <Button size="sm" onClick={() => setPickerOpen(true)}>
            <PlusIcon className="size-4" />
            Add repositories
          </Button>
        }
      />

      <SourcesSummary connection={connection} repos={repos} />

      <section className="mt-8">
        <div className="mb-3.5 flex items-center justify-between">
          <h2 className="text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
            Repositories
          </h2>
          {repos.length > 0 && (
            <span className="nums text-[12px] text-fg-subtle">
              {repos.length} {repos.length === 1 ? "repository" : "repositories"}
            </span>
          )}
        </div>

        {repos.length === 0 ? (
          <EmptyRepos onAdd={() => setPickerOpen(true)} />
        ) : (
          <div className="space-y-2.5">
            {repos.map((repo) => (
              <RepositoryCard
                key={repo.id}
                repo={repo}
                manageable
                onReindex={() => indexingApi.reindex(repo.id).then(refresh)}
                onChangeBranch={() => setBranchRepo(repo)}
                onRemove={() => setRemoveRepo(repo)}
              />
            ))}
          </div>
        )}
      </section>

      <ComingSoonSources />

      <RepoPickerDialog
        open={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onAdded={refresh}
        alreadyIndexed={repos.map((r) => r.external_id)}
      />
      <BranchDialog
        repo={branchRepo}
        onClose={() => setBranchRepo(null)}
        onChanged={refresh}
      />
      <ConfirmDialog
        open={removeRepo !== null}
        title="Remove repository"
        destructive
        confirmLabel="Remove"
        description={
          <>
            Vibino will delete the index for{" "}
            <span className="text-fg">{removeRepo?.full_name}</span> and stop
            answering questions from it. This can&rsquo;t be undone.
          </>
        }
        onConfirm={async () => {
          if (removeRepo) await indexingApi.removeRepository(removeRepo.id);
          await refresh();
        }}
        onClose={() => setRemoveRepo(null)}
      />
    </PageContainer>
  );
}

function EmptyRepos({ onAdd }: { onAdd: () => void }) {
  return (
    <div className="flex flex-col items-center rounded-card border border-dashed border-hairline-strong bg-surface/40 px-6 py-12 text-center">
      <span className="flex size-10 items-center justify-center rounded-card border border-hairline bg-elevated text-fg-subtle">
        <GitHubIcon className="size-5" />
      </span>
      <h3 className="mt-4 text-[14px] font-medium text-fg">No repositories yet</h3>
      <p className="mt-1.5 max-w-xs text-[13px] leading-relaxed text-fg-subtle">
        Pick the repositories Vibino should index. You can add or remove them any
        time.
      </p>
      <Button size="sm" onClick={onAdd} className="mt-5">
        <PlusIcon className="size-4" />
        Add repositories
      </Button>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <PageContainer>
      <div className="mb-8 h-8 w-40 animate-fade rounded-card bg-surface" />
      <div className="h-[104px] animate-fade rounded-card border border-hairline bg-surface" />
      <div className="mt-8 space-y-2.5">
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="h-[132px] animate-fade rounded-card border border-hairline bg-surface"
            style={{ animationDelay: `${index * 70}ms` }}
          />
        ))}
      </div>
    </PageContainer>
  );
}
