import {
  SlackIcon,
  JiraIcon,
  TeamsIcon,
  MeetIcon,
  MailIcon,
  NotionIcon,
} from "@/components/icons";

const SOURCES = [
  { name: "Slack", icon: SlackIcon },
  { name: "Jira", icon: JiraIcon },
  { name: "Teams", icon: TeamsIcon },
  { name: "Google Meet", icon: MeetIcon },
  { name: "Notion", icon: NotionIcon },
  { name: "Email", icon: MailIcon },
];

export function ComingSoonSources() {
  return (
    <section className="mt-10">
      <div className="mb-3.5 flex items-center gap-2">
        <h2 className="text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
          More sources
        </h2>
        <span className="rounded-badge border border-hairline bg-surface px-1.5 py-[2px] text-[10.5px] text-fg-subtle">
          Coming soon
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
        {SOURCES.map(({ name, icon: Icon }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-2.5 rounded-card border border-hairline bg-surface/50 px-3 py-5 text-center"
          >
            <Icon className="size-5 text-fg-subtle/45" />
            <span className="text-[12.5px] text-fg-subtle/70">{name}</span>
          </div>
        ))}
      </div>
    </section>
  );
}
