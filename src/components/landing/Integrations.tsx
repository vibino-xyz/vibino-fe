import {
  GitHubIcon,
  SlackIcon,
  JiraIcon,
  TeamsIcon,
  MeetIcon,
} from "@/components/icons";

const integrations = [
  { icon: GitHubIcon, name: "GitHub", live: true },
  { icon: SlackIcon, name: "Slack", live: false },
  { icon: JiraIcon, name: "Jira", live: false },
  { icon: TeamsIcon, name: "Teams", live: false },
  { icon: MeetIcon, name: "Google Meet", live: false },
];

export function Integrations() {
  return (
    <section id="integrations" className="mx-auto max-w-6xl px-6 py-24">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-fg sm:text-[2.25rem]">
          Plugs into where the work already happens
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-[17px] leading-relaxed text-fg-subtle">
          GitHub is live today. The rest of your stack lands this quarter.
        </p>
      </div>

      <div className="mt-14 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {integrations.map(({ icon: IntegrationIcon, name, live }) => (
          <div
            key={name}
            className="flex flex-col items-center gap-3 rounded-card border border-hairline bg-surface px-4 py-7 text-center"
          >
            <IntegrationIcon
              className={live ? "size-6 text-fg" : "size-6 text-fg-subtle/60"}
            />
            <span
              className={
                live
                  ? "text-[13px] font-medium text-fg"
                  : "text-[13px] text-fg-subtle"
              }
            >
              {name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
