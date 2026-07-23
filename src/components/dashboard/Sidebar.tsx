"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { OrgSwitcher } from "@/components/dashboard/OrgSwitcher";
import { UserMenu } from "@/components/dashboard/UserMenu";
import { HomeIcon, SettingsIcon, ArrowUpRightIcon, MessageIcon } from "@/components/icons";
import { CHAT_APP_URL } from "@/lib/config";
import { cn } from "@/lib/cn";

const NAV = [
  { label: "Overview", href: "/dashboard", icon: HomeIcon, exact: true },
  { label: "Settings", href: "/dashboard/settings", icon: SettingsIcon, exact: false },
];

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();

  return (
    <div className="flex h-full flex-col bg-canvas">
      {/* Org switcher */}
      <div className="border-b border-hairline p-3">
        <OrgSwitcher />
      </div>

      {/* Primary nav */}
      <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
        {NAV.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              className={cn(
                "flex items-center gap-2.5 rounded-card px-2.5 py-2 text-[13.5px] transition-colors",
                active
                  ? "bg-elevated font-medium text-fg"
                  : "text-fg-muted hover:bg-elevated hover:text-fg",
              )}
            >
              <Icon
                className={cn("size-[18px]", active ? "text-fg" : "text-fg-subtle")}
              />
              {item.label}
            </Link>
          );
        })}

        <div className="px-1 pb-2 pt-5">
          <span className="text-[11px] font-medium uppercase tracking-[0.09em] text-fg-subtle">
            Ask
          </span>
        </div>

        {/* The chat app is a separate frontend. */}
        <a
          href={CHAT_APP_URL}
          target="_blank"
          rel="noreferrer"
          onClick={onNavigate}
          className="group flex items-center gap-2.5 rounded-card border border-accent/25 bg-accent/10 px-2.5 py-2.5 text-[13.5px] font-medium text-[#c4b5fd] transition-colors hover:bg-accent/15"
        >
          <MessageIcon className="size-[18px]" />
          <span className="flex-1">Open Chat</span>
          <ArrowUpRightIcon className="size-4 text-[#c4b5fd]/70 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
        </a>
      </nav>

      {/* User */}
      <div className="border-t border-hairline p-3">
        <UserMenu />
      </div>
    </div>
  );
}
