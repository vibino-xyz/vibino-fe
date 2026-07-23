"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { SettingsCard } from "@/components/dashboard/SettingsCard";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TextInput } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import {
  Dropdown,
  DropdownItem,
  DropdownDivider,
} from "@/components/ui/Dropdown";
import { MoreIcon, CheckIcon, TrashIcon, MailIcon } from "@/components/icons";
import {
  api,
  type Member,
  type InvitationView,
  type Role,
} from "@/lib/api";
import { authorized } from "@/lib/session";
import { initials, timeAgo } from "@/lib/format";

const ROLE_LABEL: Record<Role, string> = {
  OWNER: "Owner",
  ADMIN: "Admin",
  MEMBER: "Member",
};

export default function MembersSettingsPage() {
  const router = useRouter();
  const { user, isManager, refresh } = useWorkspace();
  const [members, setMembers] = useState<Member[] | null>(null);
  const [invites, setInvites] = useState<InvitationView[]>([]);
  const [removeTarget, setRemoveTarget] = useState<Member | null>(null);

  const reload = useCallback(async () => {
    const [m, inv] = await Promise.all([
      authorized((token) => api.listMembers(token)),
      authorized((token) => api.listInvitations(token)),
    ]);
    setMembers(m.members);
    setInvites(inv.invitations.filter((i) => i.status === "PENDING"));
  }, []);

  useEffect(() => {
    if (!isManager) {
      router.replace("/dashboard/settings/profile");
      return;
    }
    reload();
  }, [isManager, reload, router]);

  if (!isManager) return null;

  const changeRole = async (member: Member, role: Role) => {
    await authorized((token) => api.changeMemberRole(member.id, role, token));
    await reload();
  };

  const removeMember = async (member: Member) => {
    await authorized((token) => api.removeMember(member.id, token));
    await reload();
    await refresh();
  };

  return (
    <div className="space-y-6">
      <InviteForm onInvited={reload} />

      <SettingsCard
        title="Members"
        description="People with access to this workspace and everything Vibino has indexed."
      >
        {members === null ? (
          <MemberSkeleton />
        ) : (
          <ul className="divide-y divide-hairline">
            {members.map((member) => {
              const isSelf = member.user_id === user.id;
              const name =
                [member.first_name, member.last_name].filter(Boolean).join(" ") ||
                member.email;
              const canManage = !member.is_owner && !isSelf;

              return (
                <li key={member.id} className="flex items-center gap-3 py-3">
                  <Avatar
                    label={initials(member.first_name, member.last_name)}
                    seed={member.user_id}
                    size={34}
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-[13.5px] font-medium text-fg">
                        {name}
                      </span>
                      {isSelf && (
                        <span className="text-[11.5px] text-fg-subtle">You</span>
                      )}
                    </div>
                    <span className="block truncate text-[12.5px] text-fg-subtle">
                      {member.email}
                    </span>
                  </div>

                  <Badge tone={member.is_owner ? "accent" : "neutral"}>
                    {member.is_owner ? "Owner" : ROLE_LABEL[member.role]}
                  </Badge>

                  {canManage ? (
                    <Dropdown
                      align="end"
                      panelClassName="w-[180px]"
                      trigger={({ toggle, open }) => (
                        <button
                          type="button"
                          aria-label={`Manage ${name}`}
                          onClick={toggle}
                          className={`flex size-7 items-center justify-center rounded-card text-fg-subtle transition-colors hover:bg-elevated hover:text-fg ${open ? "bg-elevated text-fg" : ""}`}
                        >
                          <MoreIcon className="size-4" />
                        </button>
                      )}
                    >
                      {(close) => (
                        <>
                          <RoleItem
                            label="Admin"
                            hint="Manage sources & members"
                            active={member.role === "ADMIN"}
                            onClick={() => {
                              close();
                              if (member.role !== "ADMIN") changeRole(member, "ADMIN");
                            }}
                          />
                          <RoleItem
                            label="Member"
                            hint="Read-only, can use chat"
                            active={member.role === "MEMBER"}
                            onClick={() => {
                              close();
                              if (member.role !== "MEMBER") changeRole(member, "MEMBER");
                            }}
                          />
                          <DropdownDivider />
                          <DropdownItem
                            icon={<TrashIcon className="size-4" />}
                            tone="danger"
                            onClick={() => {
                              close();
                              setRemoveTarget(member);
                            }}
                          >
                            Remove
                          </DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  ) : (
                    <span className="size-7" />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </SettingsCard>

      {invites.length > 0 && (
        <SettingsCard
          title="Pending invitations"
          description="Invitations that haven't been accepted yet."
        >
          <ul className="divide-y divide-hairline">
            {invites.map((invite) => (
              <li key={invite.id} className="flex items-center gap-3 py-3">
                <span className="flex size-8 items-center justify-center rounded-full border border-hairline bg-elevated text-fg-subtle">
                  <MailIcon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <span className="block truncate text-[13.5px] text-fg">
                    {invite.email}
                  </span>
                  <span className="block truncate text-[12px] text-fg-subtle">
                    {ROLE_LABEL[invite.role]} · invited {timeAgo(invite.created_at)}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    authorized((token) => api.revokeInvitation(invite.id, token)).then(reload)
                  }
                >
                  Revoke
                </Button>
              </li>
            ))}
          </ul>
        </SettingsCard>
      )}

      <ConfirmDialog
        open={removeTarget !== null}
        title="Remove member"
        destructive
        confirmLabel="Remove"
        description={
          <>
            Remove{" "}
            <span className="text-fg">
              {removeTarget?.first_name || removeTarget?.email}
            </span>{" "}
            from this workspace? They&rsquo;ll lose access to the chat and
            everything Vibino has indexed.
          </>
        }
        onConfirm={async () => {
          if (removeTarget) await removeMember(removeTarget);
        }}
        onClose={() => setRemoveTarget(null)}
      />
    </div>
  );
}

function RoleItem({
  label,
  hint,
  active,
  onClick,
}: {
  label: string;
  hint: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      role="menuitemradio"
      aria-checked={active}
      onClick={onClick}
      className="flex w-full items-start gap-2.5 rounded-[6px] px-2.5 py-2 text-left transition-colors hover:bg-surface"
    >
      <span className="mt-0.5 size-4 shrink-0">
        {active && <CheckIcon className="size-4 text-accent" />}
      </span>
      <span className="min-w-0">
        <span className="block text-[13px] text-fg">{label}</span>
        <span className="block text-[11.5px] text-fg-subtle">{hint}</span>
      </span>
    </button>
  );
}

function InviteForm({ onInvited }: { onInvited: () => void }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<Role>("MEMBER");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!valid) return;
    setBusy(true);
    setError(null);
    try {
      await authorized((token) =>
        api.invite([{ email: email.trim(), role }], token),
      );
      setEmail("");
      setRole("MEMBER");
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't send invite");
    } finally {
      setBusy(false);
    }
  };

  return (
    <SettingsCard
      title="Invite people"
      description="Invited teammates get read-only access and can ask Vibino questions in chat."
    >
      <form onSubmit={submit} className="flex flex-col gap-2.5 sm:flex-row">
        <TextInput
          type="email"
          placeholder="teammate@company.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          className="h-10 flex-1"
        />
        <Select
          value={role}
          onChange={(event) => setRole(event.target.value as Role)}
          className="h-10 sm:w-[130px]"
        >
          <option value="MEMBER">Member</option>
          <option value="ADMIN">Admin</option>
        </Select>
        <Button type="submit" disabled={!valid || busy} className="h-10">
          {busy ? "Sending…" : "Send invite"}
        </Button>
      </form>
      {error && <p className="mt-2.5 text-[12.5px] text-danger">{error}</p>}
    </SettingsCard>
  );
}

function MemberSkeleton() {
  return (
    <ul className="divide-y divide-hairline">
      {Array.from({ length: 3 }, (_, index) => (
        <li key={index} className="flex items-center gap-3 py-3">
          <span className="size-[34px] animate-fade rounded-full bg-elevated" />
          <span className="h-4 w-40 animate-fade rounded bg-elevated" />
        </li>
      ))}
    </ul>
  );
}
