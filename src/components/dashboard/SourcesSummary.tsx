import { GitHubIcon } from "@/components/icons";
import { Badge } from "@/components/ui/Badge";
import { formatNumber, timeAgo } from "@/lib/format";
import type { GithubConnection } from "@/lib/api";
import type { IndexedRepo } from "@/lib/indexing";

export function SourcesSummary({
  connection,
  repos,
}: {
  connection: GithubConnection;
  repos: IndexedRepo[];
}) {
  const indexed = repos.filter((r) => r.state === "indexed");
  const files = indexed.reduce((sum, r) => sum + r.file_count, 0);
  const chunks = indexed.reduce((sum, r) => sum + r.chunk_count, 0);
  const lastSynced = indexed
    .map((r) => r.last_synced_at)
    .filter(Boolean)
    .sort()
    .at(-1);

  const stats = [
    { label: "Repositories", value: formatNumber(repos.length) },
    { label: "Indexed", value: `${indexed.length}/${repos.length}` },
    { label: "Files", value: formatNumber(files) },
    { label: "Chunks", value: formatNumber(chunks) },
    { label: "Last sync", value: lastSynced ? timeAgo(lastSynced) : "—" },
  ];

  return (
    <div className="rounded-card border border-hairline bg-surface">
      <div className="flex items-center gap-3 px-5 py-4">
        <span className="flex size-9 items-center justify-center rounded-card border border-hairline bg-elevated text-fg">
          <GitHubIcon className="size-[18px]" />
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-[14px] font-medium text-fg">GitHub</span>
            <Badge tone="success" dot>
              Connected
            </Badge>
          </div>
          {connection.account_login && (
            <p className="mt-0.5 truncate text-[12.5px] text-fg-subtle">
              {connection.account_login}
            </p>
          )}
        </div>
      </div>

      {/* gap-px over a hairline background draws clean separators that survive
          wrapping at both breakpoints. */}
      <dl className="grid grid-cols-2 gap-px border-t border-hairline bg-hairline sm:grid-cols-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-surface px-5 py-3.5">
            <dt className="text-[11.5px] uppercase tracking-[0.06em] text-fg-subtle">
              {stat.label}
            </dt>
            <dd className="nums mt-1 text-[15px] font-semibold text-fg">
              {stat.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
