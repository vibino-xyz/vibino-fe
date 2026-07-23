"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { PageContainer, PageHeader } from "@/components/dashboard/Page";
import { cn } from "@/lib/cn";

const TABS = [
  { label: "General", href: "/dashboard/settings", managerOnly: true },
  { label: "Members", href: "/dashboard/settings/members", managerOnly: true },
  { label: "Profile", href: "/dashboard/settings/profile", managerOnly: false },
];

export default function SettingsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { isManager } = useWorkspace();

  const tabs = TABS.filter((tab) => isManager || !tab.managerOnly);

  return (
    <PageContainer>
      <PageHeader
        title="Settings"
        description="Manage your workspace and personal account."
      />

      <div className="mb-8 flex gap-1 border-b border-hairline">
        {tabs.map((tab) => {
          const active =
            tab.href === "/dashboard/settings"
              ? pathname === tab.href
              : pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "-mb-px border-b-2 px-3 py-2.5 text-[13.5px] transition-colors",
                active
                  ? "border-accent font-medium text-fg"
                  : "border-transparent text-fg-subtle hover:text-fg",
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>

      {children}
    </PageContainer>
  );
}
