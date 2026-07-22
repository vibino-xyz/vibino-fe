import { SectionLabel } from "@/components/ui/Badge";
import {
  CommitIcon,
  PullRequestIcon,
  MessageIcon,
  DocumentIcon,
  UsersIcon,
  RefreshIcon,
  ArrowRightIcon,
} from "@/components/icons";
import { ACTIVITY, type ActivityKind } from "@/lib/mock-data";

const KIND_ICONS: Record<
  ActivityKind,
  (props: React.SVGProps<SVGSVGElement>) => React.ReactElement
> = {
  commit: CommitIcon,
  "pull-request": PullRequestIcon,
  message: MessageIcon,
  document: DocumentIcon,
  member: UsersIcon,
  sync: RefreshIcon,
};

export function ActivityFeed() {
  return (
    <div>
      <SectionLabel
        trailing={
          <span className="flex items-center gap-1.5 text-[11px] text-fg-subtle">
            <span className="size-1.5 animate-pulse-dot rounded-full bg-success" />
            Live
          </span>
        }
      >
        Activity
      </SectionLabel>

      <ul className="rounded-card border border-hairline bg-surface">
        {ACTIVITY.map((item) => {
          const Glyph = KIND_ICONS[item.kind];
          return (
            <li
              key={item.id}
              className="flex gap-3 border-b border-hairline px-4 py-3.5 last:border-b-0"
            >
              <span className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-badge border border-hairline bg-elevated text-fg-subtle">
                <Glyph className="size-3.5" />
              </span>

              <div className="min-w-0 flex-1">
                <p className="text-[13px] leading-snug text-fg">{item.title}</p>
                <p className="mt-1 truncate text-[12px] text-fg-subtle">
                  {item.meta}
                </p>
              </div>

              <span className="nums shrink-0 pt-px text-[11.5px] text-fg-subtle">
                {item.time}
              </span>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="group mt-3.5 inline-flex items-center gap-1.5 rounded-badge text-[12.5px] text-fg-subtle transition-colors hover:text-fg"
      >
        View full log
        <ArrowRightIcon className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
