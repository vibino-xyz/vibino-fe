"use client";

import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { Avatar } from "@/components/ui/Avatar";
import {
  Dropdown,
  DropdownDivider,
  DropdownLabel,
} from "@/components/ui/Dropdown";
import {
  ChevronUpDownIcon,
  CheckIcon,
  PlusIcon,
} from "@/components/icons";
import { cn } from "@/lib/cn";

const ROLE_LABEL: Record<string, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export function OrgSwitcher() {
  const router = useRouter();
  const { organization, role, memberships, switchOrganization, switching } =
    useWorkspace();

  return (
    <Dropdown
      panelClassName="w-[260px]"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          disabled={switching}
          className={cn(
            "flex w-full items-center gap-2.5 rounded-card border border-transparent px-2 py-2 text-left transition-colors hover:bg-elevated",
            open && "bg-elevated",
          )}
        >
          <Avatar
            label={organization.name.charAt(0).toUpperCase()}
            seed={organization.id}
            size={30}
            square
          />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13.5px] font-semibold text-fg">
              {organization.name}
            </span>
            <span className="block truncate text-[11.5px] text-fg-subtle">
              {ROLE_LABEL[role] ?? role}
            </span>
          </span>
          <ChevronUpDownIcon className="size-4 shrink-0 text-fg-subtle" />
        </button>
      )}
    >
      {(close) => (
        <>
          <DropdownLabel>Organizations</DropdownLabel>
          <div className="max-h-[280px] overflow-y-auto">
            {memberships.map((membership) => {
              const isCurrent = membership.organization.id === organization.id;
              return (
                <button
                  key={membership.organization.id}
                  type="button"
                  role="menuitem"
                  onClick={() => {
                    close();
                    if (!isCurrent) switchOrganization(membership.organization.id);
                  }}
                  className="flex w-full items-center gap-2.5 rounded-[6px] px-2 py-1.5 text-left transition-colors hover:bg-surface"
                >
                  <Avatar
                    label={membership.organization.name.charAt(0).toUpperCase()}
                    seed={membership.organization.id}
                    size={26}
                    square
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] text-fg">
                      {membership.organization.name}
                    </span>
                    <span className="block truncate text-[11px] text-fg-subtle">
                      {membership.member_count}{" "}
                      {membership.member_count === 1 ? "member" : "members"}
                    </span>
                  </span>
                  {isCurrent && (
                    <CheckIcon className="size-4 shrink-0 text-accent" />
                  )}
                </button>
              );
            })}
          </div>
          <DropdownDivider />
          <button
            type="button"
            role="menuitem"
            onClick={() => {
              close();
              router.push("/onboarding");
            }}
            className="flex w-full items-center gap-2.5 rounded-[6px] px-2.5 py-2 text-left text-[13px] text-fg-muted transition-colors hover:bg-surface hover:text-fg"
          >
            <PlusIcon className="size-4 text-fg-subtle" />
            Create organization
          </button>
        </>
      )}
    </Dropdown>
  );
}
