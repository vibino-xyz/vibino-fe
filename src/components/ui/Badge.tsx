import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type Tone = "neutral" | "success" | "warning" | "danger" | "accent";

const tones: Record<Tone, string> = {
  neutral: "border-hairline-strong bg-elevated text-fg-muted",
  success: "border-success/20 bg-success/10 text-success",
  warning: "border-warning/20 bg-warning/10 text-warning",
  danger: "border-danger/20 bg-danger/10 text-danger",
  accent: "border-accent/25 bg-accent/12 text-[#b69bf5]",
};

const dots: Record<Tone, string> = {
  neutral: "bg-fg-subtle",
  success: "bg-success",
  warning: "bg-warning",
  danger: "bg-danger",
  accent: "bg-accent",
};

export function Badge({
  tone = "neutral",
  dot = false,
  pulse = false,
  children,
  className,
}: {
  tone?: Tone;
  dot?: boolean;
  pulse?: boolean;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-badge border px-2 py-[3px] text-[11px] font-medium leading-none",
        tones[tone],
        className,
      )}
    >
      {dot && (
        <span
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            dots[tone],
            pulse && "animate-pulse-dot",
          )}
        />
      )}
      {children}
    </span>
  );
}

/** Small-caps section header used across the dashboard columns. */
export function SectionLabel({
  children,
  trailing,
}: {
  children: ReactNode;
  trailing?: ReactNode;
}) {
  return (
    <div className="mb-3.5 flex h-5 items-center justify-between">
      <h2 className="text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
        {children}
      </h2>
      {trailing}
    </div>
  );
}
