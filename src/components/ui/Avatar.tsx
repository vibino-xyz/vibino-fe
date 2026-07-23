import { cn } from "@/lib/cn";

/**
 * Deterministic muted tint per identity so avatars are distinguishable without
 * being colorful — a small set of low-saturation surfaces.
 */
const TINTS = [
  "bg-[#2a2340] text-[#c4b5fd]",
  "bg-[#1e3a34] text-[#86efac]",
  "bg-[#3a2a1e] text-[#fcd9a8]",
  "bg-[#1e2f3a] text-[#a5d8f3]",
  "bg-[#3a1e2e] text-[#f5a8c8]",
  "bg-[#26262a] text-[#d4d4d8]",
];

function tintFor(seed: string): string {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) hash = (hash * 31 + seed.charCodeAt(i)) | 0;
  return TINTS[Math.abs(hash) % TINTS.length];
}

export function Avatar({
  label,
  seed,
  size = 28,
  square = false,
  className,
}: {
  label: string;
  seed?: string;
  size?: number;
  square?: boolean;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={cn(
        "inline-flex shrink-0 items-center justify-center font-medium leading-none",
        square ? "rounded-[7px]" : "rounded-full",
        tintFor(seed ?? label),
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.round(size * 0.4) }}
    >
      {label}
    </span>
  );
}
