"use client";

import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { Avatar } from "@/components/ui/Avatar";
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
} from "@/components/ui/Dropdown";
import { UserIcon, SettingsIcon, LogoutIcon, ChevronDownIcon } from "@/components/icons";
import { initials } from "@/lib/format";

export function UserMenu() {
  const router = useRouter();
  const { user, signOut } = useWorkspace();

  const name = [user.first_name, user.last_name].filter(Boolean).join(" ") || user.email;

  return (
    <Dropdown
      side="top"
      panelClassName="w-[240px]"
      trigger={({ toggle, open }) => (
        <button
          type="button"
          onClick={toggle}
          className={`flex w-full items-center gap-2.5 rounded-card px-2 py-2 text-left transition-colors hover:bg-elevated ${open ? "bg-elevated" : ""}`}
        >
          <Avatar label={initials(user.first_name, user.last_name)} seed={user.id} size={30} />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[13px] font-medium text-fg">{name}</span>
            <span className="block truncate text-[11.5px] text-fg-subtle">{user.email}</span>
          </span>
          <ChevronDownIcon className="size-4 shrink-0 text-fg-subtle" />
        </button>
      )}
    >
      {(close) => (
        <>
          <div className="flex items-center gap-2.5 px-2.5 py-2">
            <Avatar label={initials(user.first_name, user.last_name)} seed={user.id} size={34} />
            <span className="min-w-0">
              <span className="block truncate text-[13px] font-medium text-fg">{name}</span>
              <span className="block truncate text-[11.5px] text-fg-subtle">{user.email}</span>
            </span>
          </div>
          <DropdownDivider />
          <DropdownItem
            icon={<UserIcon className="size-4" />}
            onClick={() => {
              close();
              router.push("/dashboard/settings/profile");
            }}
          >
            Profile
          </DropdownItem>
          <DropdownItem
            icon={<SettingsIcon className="size-4" />}
            onClick={() => {
              close();
              router.push("/dashboard/settings");
            }}
          >
            Settings
          </DropdownItem>
          <DropdownDivider />
          <DropdownItem
            icon={<LogoutIcon className="size-4" />}
            tone="danger"
            onClick={() => {
              close();
              signOut();
            }}
          >
            Sign out
          </DropdownItem>
        </>
      )}
    </Dropdown>
  );
}
