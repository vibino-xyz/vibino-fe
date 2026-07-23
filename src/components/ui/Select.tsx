import type { SelectHTMLAttributes } from "react";
import { ChevronDownIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

export function Select({
  className,
  children,
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative inline-flex">
      <select
        className={cn(
          "h-9 w-full appearance-none rounded-card border border-hairline-strong bg-surface pl-3 pr-8 text-[13px] text-fg",
          "transition-colors hover:border-[#33333a] focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-2.5 top-1/2 size-3.5 -translate-y-1/2 text-fg-subtle" />
    </div>
  );
}
