/** Compact relative time: "just now", "4m ago", "3h ago", "2d ago", else a date. */
export function timeAgo(input: string | number | Date | null | undefined): string {
  if (!input) return "—";
  const then = new Date(input).getTime();
  if (Number.isNaN(then)) return "—";

  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 7) return `${days}d ago`;

  return new Date(then).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

/** 12480 -> "12,480". */
export function formatNumber(value: number): string {
  return value.toLocaleString();
}

/** First letters of a name for avatar fallbacks. */
export function initials(first?: string | null, last?: string | null): string {
  const a = (first ?? "").trim();
  const b = (last ?? "").trim();
  const combined = `${a.charAt(0)}${b.charAt(0)}`.toUpperCase();
  return combined || (a.charAt(0) || "?").toUpperCase();
}

/** A short commit sha for display. */
export function shortSha(sha: string): string {
  return sha.slice(0, 7);
}
