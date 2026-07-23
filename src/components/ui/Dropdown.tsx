"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

interface DropdownProps {
  trigger: (state: { open: boolean; toggle: () => void }) => ReactNode;
  children: (close: () => void) => ReactNode;
  align?: "start" | "end";
  side?: "top" | "bottom";
  panelClassName?: string;
}

/**
 * Minimal popover: a trigger and a panel that closes on outside-click, Escape,
 * or an explicit close() the panel content can call after an action.
 */
export function Dropdown({
  trigger,
  children,
  align = "start",
  side = "bottom",
  panelClassName,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {trigger({ open, toggle: () => setOpen((value) => !value) })}
      {open && (
        <div
          className={cn(
            "absolute z-50 min-w-[220px] animate-fade rounded-card border border-hairline-strong bg-elevated p-1 shadow-xl shadow-black/40",
            side === "bottom" ? "top-[calc(100%+6px)]" : "bottom-[calc(100%+6px)]",
            align === "start" ? "left-0" : "right-0",
            panelClassName,
          )}
          role="menu"
        >
          {children(() => setOpen(false))}
        </div>
      )}
    </div>
  );
}

export function DropdownItem({
  onClick,
  children,
  icon,
  tone = "default",
}: {
  onClick?: () => void;
  children: ReactNode;
  icon?: ReactNode;
  tone?: "default" | "danger";
}) {
  return (
    <button
      type="button"
      role="menuitem"
      onClick={onClick}
      className={cn(
        "flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13px] transition-colors",
        tone === "danger"
          ? "text-danger hover:bg-danger/10"
          : "text-fg-muted hover:bg-surface hover:text-fg",
      )}
    >
      {icon && <span className="shrink-0 text-fg-subtle">{icon}</span>}
      <span className="min-w-0 flex-1 truncate">{children}</span>
    </button>
  );
}

export function DropdownDivider() {
  return <div className="my-1 h-px bg-hairline" />;
}

export function DropdownLabel({ children }: { children: ReactNode }) {
  return (
    <div className="px-2.5 py-1.5 text-[11px] font-medium uppercase tracking-[0.08em] text-fg-subtle">
      {children}
    </div>
  );
}
