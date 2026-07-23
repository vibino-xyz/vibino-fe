"use client";

import { useState, type FormEvent } from "react";
import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { SettingsCard, SaveStatus } from "@/components/dashboard/SettingsCard";
import { Avatar } from "@/components/ui/Avatar";
import { Button } from "@/components/ui/Button";
import { TextInput, Label } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { authorized } from "@/lib/session";
import { initials } from "@/lib/format";

export default function ProfileSettingsPage() {
  const { user, updateUser, signOut } = useWorkspace();

  const [firstName, setFirstName] = useState(user.first_name);
  const [lastName, setLastName] = useState(user.last_name);
  const [username, setUsername] = useState(user.username ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  const dirty =
    firstName.trim() !== user.first_name ||
    lastName.trim() !== user.last_name ||
    username.trim() !== (user.username ?? "");

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!dirty || firstName.trim() === "") return;
    setStatus("saving");
    try {
      const updated = await authorized((token) =>
        api.completeProfile(
          {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            username: username.trim(),
          },
          token,
        ),
      );
      updateUser(updated);
      setStatus("saved");
      setTimeout(() => setStatus("idle"), 2500);
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={save}>
        <SettingsCard
          title="Profile"
          description="This is how you appear to teammates across Vibino."
          footer={
            <>
              <SaveStatus state={status} />
              <Button
                type="submit"
                size="sm"
                disabled={!dirty || firstName.trim() === "" || status === "saving"}
              >
                {status === "saving" ? "Saving…" : "Save changes"}
              </Button>
            </>
          }
        >
          <div className="flex items-center gap-4">
            <Avatar
              label={initials(firstName, lastName)}
              seed={user.id}
              size={56}
            />
            <div className="text-[13px] text-fg-subtle">
              <p className="text-fg">
                {[firstName, lastName].filter(Boolean).join(" ") || "Your name"}
              </p>
              <p className="mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="first-name">First name</Label>
              <TextInput
                id="first-name"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="last-name">Last name</Label>
              <TextInput
                id="last-name"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
              />
            </div>
          </div>

          <div className="mt-4 max-w-xs">
            <Label htmlFor="username">Username</Label>
            <TextInput
              id="username"
              value={username}
              placeholder="ada"
              onChange={(event) => setUsername(event.target.value)}
            />
          </div>
        </SettingsCard>
      </form>

      <SettingsCard
        title="Account"
        description="Your email is used to sign in and can't be changed here."
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Label htmlFor="email-display">Email</Label>
            <TextInput
              id="email-display"
              value={user.email}
              disabled
              className="max-w-xs opacity-60"
            />
          </div>
          <Button variant="secondary" size="sm" onClick={signOut} className="sm:self-end">
            Sign out
          </Button>
        </div>
      </SettingsCard>
    </div>
  );
}
