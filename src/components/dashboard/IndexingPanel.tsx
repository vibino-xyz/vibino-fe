import { Badge, type Tone } from "@/components/ui/Badge";
import { cn } from "@/lib/cn";
import type { RepoState } from "@/lib/use-indexing";
import type { RepoStatus } from "@/lib/mock-data";

const STATUS_LABEL: Record<RepoStatus, string> = {
  indexed: "Indexed",
  syncing: "Syncing",
  queued: "Queued",
  error: "Error",
};

const STATUS_TONE: Record<RepoStatus, Tone> = {
  indexed: "success",
  syncing: "accent",
  queued: "neutral",
  error: "danger",
};

export function IndexingPanel({
  repos,
  progress,
  indexedCount,
  filesIndexed,
  minutesLeft,
  complete,
}: {
  repos: RepoState[];
  progress: number;
  indexedCount: number;
  filesIndexed: number;
  minutesLeft: number;
  complete: boolean;
}) {
  return (
    <section className="rounded-card border border-hairline bg-surface">
      <div className="px-5 py-5 sm:px-6">
        <div className="flex flex-wrap items-start justify-between gap-x-6 gap-y-2">
          <div>
            <h2 className="text-[15px] font-semibold text-fg">
              {complete ? "Index up to date" : "Indexing in progress"}
            </h2>
            <p className="nums mt-1 text-[13px] text-fg-subtle">
              {indexedCount} of {repos.length} repositories indexed ·{" "}
              {filesIndexed.toLocaleString()} files
            </p>
          </div>

          {complete ? (
            <Badge tone="success" dot>
              Synced
            </Badge>
          ) : (
            <span className="nums pt-0.5 text-[13px] text-fg-subtle">
              ~{minutesLeft} {minutesLeft === 1 ? "minute" : "minutes"} remaining
            </span>
          )}
        </div>

        <div
          role="progressbar"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Indexing progress"
          className="relative mt-5 h-1 overflow-hidden rounded-full bg-hairline-strong"
        >
          <div
            className={cn(
              "relative h-full overflow-hidden rounded-full transition-[width,background-color] duration-500 ease-out",
              complete ? "bg-success" : "bg-accent",
            )}
            style={{ width: `${progress}%` }}
          >
            {!complete && (
              <span
                aria-hidden
                className="absolute inset-y-0 left-0 w-1/4 animate-sheen bg-white/25 blur-[3px]"
              />
            )}
          </div>
        </div>
      </div>

      <div className="border-t border-hairline">
        <div className="flex items-center gap-4 px-5 py-2.5 sm:px-6">
          <span className="flex-1 text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
            Repository
          </span>
          <span className="hidden w-24 text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle sm:block">
            Language
          </span>
          <span className="w-[86px] text-right text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
            Status
          </span>
        </div>

        <ul>
          {repos.map((repo) => (
            <li
              key={repo.name}
              className="flex items-center gap-4 border-t border-hairline px-5 py-3.5 transition-colors hover:bg-elevated sm:px-6"
            >
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] text-fg">{repo.name}</p>
                <p className="nums mt-1 truncate text-[12.5px] text-fg-subtle">
                  {repo.detail}
                </p>
              </div>

              <span className="hidden w-24 truncate text-[12.5px] text-fg-subtle sm:block">
                {repo.language}
              </span>

              <span className="flex w-[86px] justify-end">
                <Badge
                  tone={STATUS_TONE[repo.status]}
                  dot
                  pulse={repo.status === "syncing"}
                >
                  {STATUS_LABEL[repo.status]}
                </Badge>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
