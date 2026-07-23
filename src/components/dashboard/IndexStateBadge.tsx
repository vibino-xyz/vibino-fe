import { Badge, type Tone } from "@/components/ui/Badge";
import type { IndexState } from "@/lib/indexing";

const CONFIG: Record<IndexState, { label: string; tone: Tone; pulse?: boolean }> = {
  indexed: { label: "Indexed", tone: "success" },
  syncing: { label: "Syncing", tone: "accent", pulse: true },
  queued: { label: "Queued", tone: "neutral" },
  paused: { label: "Paused", tone: "warning" },
  error: { label: "Error", tone: "danger" },
};

export function IndexStateBadge({ state }: { state: IndexState }) {
  const { label, tone, pulse } = CONFIG[state];
  return (
    <Badge tone={tone} dot pulse={pulse}>
      {label}
    </Badge>
  );
}
