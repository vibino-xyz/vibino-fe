import { GitHubIcon } from "@/components/icons";
import { Badge, SectionLabel } from "@/components/ui/Badge";
import { INTEGRATION_ICONS } from "@/components/dashboard/integration-icons";
import { PENDING_INTEGRATIONS } from "@/lib/mock-data";

export function SourcesPanel({
  repoCount,
  filesIndexed,
}: {
  repoCount: number;
  filesIndexed: number;
}) {
  const stats = [
    { label: "Repositories", value: repoCount.toLocaleString() },
    { label: "Files indexed", value: filesIndexed.toLocaleString() },
    { label: "Last sync", value: "2m ago" },
  ];

  return (
    <div>
      <SectionLabel>Sources</SectionLabel>

      <div className="rounded-card border border-hairline bg-surface">
        <div className="flex items-center gap-2.5 px-4 py-3.5">
          <GitHubIcon className="size-[18px] shrink-0 text-fg" />
          <span className="flex-1 text-[13px] font-medium text-fg">GitHub</span>
          <Badge tone="success" dot>
            Connected
          </Badge>
        </div>

        <dl className="border-t border-hairline">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="flex items-baseline justify-between gap-3 border-b border-hairline px-4 py-2.5 last:border-b-0"
            >
              <dt className="text-[12.5px] text-fg-subtle">{stat.label}</dt>
              <dd className="nums text-[13px] font-medium text-fg">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="mt-8">
        <SectionLabel>Connect more</SectionLabel>
        <div className="flex flex-wrap gap-2">
          {PENDING_INTEGRATIONS.map((integration) => {
            const Glyph = INTEGRATION_ICONS[integration.id];
            return (
              <span
                key={integration.id}
                title={integration.name}
                className="flex size-9 items-center justify-center rounded-card border border-hairline bg-surface text-fg-subtle/45 transition-colors hover:border-hairline-strong hover:text-fg-subtle"
              >
                <Glyph className="size-[17px]" />
                <span className="sr-only">{integration.name}</span>
              </span>
            );
          })}
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-fg-subtle">
          Slack, Jira, Teams, Meet and Email arrive this quarter.
        </p>
      </div>
    </div>
  );
}
