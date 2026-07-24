"use client";

import { IndexStateBadge } from "@/components/dashboard/IndexStateBadge";
import { Avatar } from "@/components/ui/Avatar";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/Dropdown";
import {
  ShieldIcon,
  BranchIcon,
  CommitIcon,
  MoreIcon,
  RefreshIcon,
  TrashIcon,
  AlertIcon,
} from "@/components/icons";
import { formatNumber, timeAgo, shortSha } from "@/lib/format";
import type { IndexedRepo } from "@/lib/indexing";
import { cn } from "@/lib/cn";

function authorInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const first = parts[0]?.charAt(0) ?? "";
  const last = parts.length > 1 ? parts[parts.length - 1].charAt(0) : "";
  return (first + last).toUpperCase() || "?";
}

export function RepositoryCard({
  repo,
  manageable,
  onReindex,
  onChangeBranch,
  onRemove,
}: {
  repo: IndexedRepo;
  manageable: boolean;
  onReindex: () => void;
  onChangeBranch: () => void;
  onRemove: () => void;
}) {
  const isError = repo.state === "error";
  const isSyncing = repo.state === "syncing";
  const isQueued = repo.state === "queued";

  return (
    <div
      className={cn(
        "rounded-card border bg-surface transition-colors",
        isError ? "border-danger/25" : "border-hairline hover:border-hairline-strong",
      )}
    >
      <div className="flex items-start justify-between gap-3 px-4 py-3.5 sm:px-5">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-[14px] font-medium text-fg">
              {repo.full_name}
            </span>
            {repo.is_private && (
              <ShieldIcon className="size-3.5 shrink-0 text-fg-subtle" />
            )}
          </div>
          <div className="mt-1 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[12.5px] text-fg-subtle">
            <span>{repo.language}</span>
            <span className="text-hairline-strong">·</span>
            <span className="inline-flex items-center gap-1">
              <BranchIcon className="size-3.5" />
              {repo.branch}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <IndexStateBadge state={repo.state} />
          {manageable && (
            <Dropdown
              align="end"
              panelClassName="w-[190px]"
              trigger={({ toggle, open }) => (
                <button
                  type="button"
                  aria-label="Repository actions"
                  onClick={toggle}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-card text-fg-subtle transition-colors hover:bg-elevated hover:text-fg",
                    open && "bg-elevated text-fg",
                  )}
                >
                  <MoreIcon className="size-4" />
                </button>
              )}
            >
              {(close) => (
                <>
                  <DropdownItem
                    icon={<RefreshIcon className="size-4" />}
                    onClick={() => {
                      close();
                      onReindex();
                    }}
                  >
                    {isError ? "Retry indexing" : "Reindex now"}
                  </DropdownItem>
                  <DropdownItem
                    icon={<BranchIcon className="size-4" />}
                    onClick={() => {
                      close();
                      onChangeBranch();
                    }}
                  >
                    Change branch
                  </DropdownItem>
                  <DropdownDivider />
                  <DropdownItem
                    icon={<TrashIcon className="size-4" />}
                    tone="danger"
                    onClick={() => {
                      close();
                      onRemove();
                    }}
                  >
                    Remove
                  </DropdownItem>
                </>
              )}
            </Dropdown>
          )}
        </div>
      </div>

      {/* Syncing / queued progress */}
      {(isSyncing || isQueued) && (
        <div className="px-4 pb-3.5 sm:px-5">
          <div className="h-1 overflow-hidden rounded-full bg-hairline-strong">
            <div
              className={cn(
                "relative h-full rounded-full transition-[width] duration-700 ease-out",
                isQueued ? "bg-fg-subtle/40" : "bg-accent",
              )}
              style={{ width: `${isQueued ? 6 : Math.max(6, repo.progress)}%` }}
            >
              {isSyncing && (
                <span className="absolute inset-y-0 left-0 w-1/3 animate-sheen bg-white/25 blur-[3px]" />
              )}
            </div>
          </div>
          <p className="nums mt-2 text-[12.5px] text-fg-subtle">
            {isQueued
              ? "Queued — waiting for capacity"
              : `Indexing ${formatNumber(repo.indexed_file_count)} of ${formatNumber(repo.file_count)} files`}
          </p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="mx-4 mb-3.5 flex items-start gap-2.5 rounded-card border border-danger/20 bg-danger/[0.07] px-3 py-2.5 sm:mx-5">
          <AlertIcon className="mt-px size-4 shrink-0 text-danger" />
          <p className="text-[12.5px] leading-relaxed text-[#f0a3a3]">
            {repo.error_message}
          </p>
        </div>
      )}

      {/* Footer: last commit (when known) + stats */}
      {!isQueued && (repo.last_commit || repo.state === "indexed") && (
        <div className="border-t border-hairline px-4 py-3 sm:px-5">
          {repo.last_commit && (
            <div className="flex items-center gap-2.5">
              <CommitIcon className="size-4 shrink-0 text-fg-subtle" />
              <span className="nums shrink-0 text-[12.5px] font-medium text-fg-muted">
                {shortSha(repo.last_commit.sha)}
              </span>
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-fg-muted">
                {repo.last_commit.message}
              </span>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[12px] text-fg-subtle data-[with-commit=true]:mt-2" data-with-commit={Boolean(repo.last_commit)}>
            {repo.last_commit && (
              <>
                <span className="inline-flex items-center gap-1.5">
                  <Avatar
                    label={authorInitials(repo.last_commit.author_name)}
                    seed={repo.last_commit.author_name}
                    size={16}
                  />
                  {repo.last_commit.author_name}
                </span>
                <span className="text-hairline-strong">·</span>
                <span>committed {timeAgo(repo.last_commit.committed_at)}</span>
              </>
            )}
            {repo.state === "indexed" && (
              <>
                {repo.last_commit && <span className="text-hairline-strong">·</span>}
                <span className="nums">{formatNumber(repo.file_count)} files</span>
                <span className="text-hairline-strong">·</span>
                <span className="nums">{formatNumber(repo.chunk_count)} chunks</span>
                <span className="text-hairline-strong">·</span>
                <span>synced {timeAgo(repo.last_synced_at)}</span>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
