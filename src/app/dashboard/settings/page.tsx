"use client";

import { useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useWorkspace } from "@/components/dashboard/WorkspaceProvider";
import { SettingsCard, SaveStatus } from "@/components/dashboard/SettingsCard";
import { Button } from "@/components/ui/Button";
import { TextInput, Label, Textarea } from "@/components/ui/Input";
import { api } from "@/lib/api";
import { authorized } from "@/lib/session";
import { timeAgo } from "@/lib/format";

export default function OrganizationSettingsPage() {
  const router = useRouter();
  const { organization, isManager, memberCount, role, updateOrganization } =
    useWorkspace();

  const [name, setName] = useState(organization.name);
  const [description, setDescription] = useState(organization.description ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  // Members land on their own tab; the org tab is management-only.
  useEffect(() => {
    if (!isManager) router.replace("/dashboard/settings/profile");
  }, [isManager, router]);

  if (!isManager) return null;

  const dirty =
    name.trim() !== organization.name ||
    description.trim() !== (organization.description ?? "").trim();

  const save = async (event: FormEvent) => {
    event.preventDefault();
    if (!dirty || name.trim() === "") return;
    setStatus("saving");
    try {
      const updated = await authorized((token) =>
        api.updateOrganization({ name: name.trim(), description: description.trim() }, token),
      );
      updateOrganization(updated);
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
          title="Organization"
          description="This is how your workspace appears to everyone on the team."
          footer={
            <>
              <SaveStatus state={status} />
              <Button
                type="submit"
                size="sm"
                disabled={!dirty || name.trim() === "" || status === "saving"}
              >
                {status === "saving" ? "Saving…" : "Save changes"}
              </Button>
            </>
          }
        >
          <div className="space-y-5">
            <div>
              <Label htmlFor="org-name">Name</Label>
              <TextInput
                id="org-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="max-w-md"
              />
            </div>

            <div>
              <Label htmlFor="org-slug">Workspace URL</Label>
              <div className="flex items-center gap-2">
                <span className="text-[14px] text-fg-subtle">vibino.com/</span>
                <TextInput
                  id="org-slug"
                  value={organization.slug}
                  disabled
                  className="max-w-xs opacity-60"
                />
              </div>
              <p className="mt-2 text-[12.5px] text-fg-subtle">
                The workspace URL can&rsquo;t be changed for now.
              </p>
            </div>

            <div>
              <Label htmlFor="org-description">Description</Label>
              <Textarea
                id="org-description"
                rows={3}
                placeholder="What does your team do?"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                className="max-w-md"
              />
            </div>
          </div>
        </SettingsCard>
      </form>

      <SettingsCard title="Details">
        <dl className="grid gap-px overflow-hidden rounded-card border border-hairline bg-hairline sm:grid-cols-3">
          {[
            { label: "Your role", value: titleCase(role) },
            { label: "Members", value: `${memberCount}` },
            { label: "Created", value: timeAgo(organization.created_at) },
          ].map((item) => (
            <div key={item.label} className="bg-surface px-4 py-3">
              <dt className="text-[11.5px] uppercase tracking-[0.06em] text-fg-subtle">
                {item.label}
              </dt>
              <dd className="mt-1 text-[14px] font-medium text-fg">{item.value}</dd>
            </div>
          ))}
        </dl>
      </SettingsCard>
    </div>
  );
}

function titleCase(value: string): string {
  return value.charAt(0) + value.slice(1).toLowerCase();
}
