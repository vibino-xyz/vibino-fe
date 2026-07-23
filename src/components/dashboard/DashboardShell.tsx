"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { Logo } from "@/components/ui/Logo";
import { MoreIcon, CloseIcon } from "@/components/icons";

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Close the mobile drawer whenever the route changes.
  useEffect(() => setDrawerOpen(false), [pathname]);

  return (
    <div className="min-h-dvh lg:grid lg:grid-cols-[256px_minmax(0,1fr)]">
      {/* Desktop rail */}
      <aside className="sticky top-0 hidden h-dvh border-r border-hairline lg:block">
        <Sidebar />
      </aside>

      {/* Mobile top bar */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-hairline bg-canvas/85 px-4 backdrop-blur-xl lg:hidden">
        <Logo href="/dashboard" />
        <button
          type="button"
          aria-label="Open menu"
          onClick={() => setDrawerOpen(true)}
          className="flex size-9 items-center justify-center rounded-card text-fg-muted transition-colors hover:bg-elevated hover:text-fg"
        >
          <MoreIcon className="size-5" />
        </button>
      </header>

      {/* Mobile drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 animate-fade bg-black/60"
            onClick={() => setDrawerOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-[280px] max-w-[85vw] animate-fade border-r border-hairline bg-canvas">
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setDrawerOpen(false)}
              className="absolute right-3 top-3 z-10 flex size-8 items-center justify-center rounded-card text-fg-subtle transition-colors hover:bg-elevated hover:text-fg"
            >
              <CloseIcon className="size-4" />
            </button>
            <Sidebar onNavigate={() => setDrawerOpen(false)} />
          </div>
        </div>
      )}

      <main className="min-w-0">{children}</main>
    </div>
  );
}
