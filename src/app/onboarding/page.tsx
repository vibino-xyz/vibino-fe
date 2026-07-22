"use client";

import { useState, type FormEvent, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { AuthShell, AuthHeading } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { TextInput, Label } from "@/components/ui/Input";
import {
  LayersIcon,
  UsersIcon,
  ChevronRightIcon,
  CloseIcon,
  MailIcon,
} from "@/components/icons";

type Stage = "choose" | "create" | "invite" | "join";

const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export default function OnboardingPage() {
  const router = useRouter();
  const [stage, setStage] = useState<Stage>("choose");
  const [orgName, setOrgName] = useState("");
  const [draft, setDraft] = useState("");
  const [invites, setInvites] = useState<string[]>([]);

  const goBack = () => {
    if (stage === "choose") return router.push("/auth");
    if (stage === "invite") return setStage("create");
    setStage("choose");
  };

  const addInvite = () => {
    const value = draft.trim().replace(/,$/, "");
    if (!isEmail(value) || invites.includes(value)) return;
    setInvites((current) => [...current, value]);
    setDraft("");
  };

  const handleInviteKey = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter" || event.key === "," || event.key === " ") {
      event.preventDefault();
      addInvite();
    }
  };

  const submitOrg = (event: FormEvent) => {
    event.preventDefault();
    if (orgName.trim() === "") return;
    setStage("invite");
  };

  return (
    <AuthShell
      onBack={goBack}
      width={stage === "choose" ? "wide" : "narrow"}
      steps={stage === "invite" ? 2 : undefined}
      currentStep={stage === "invite" ? 2 : undefined}
    >
      <div key={stage} className="animate-rise">
        {stage === "choose" && (
          <>
            <div className="mb-9 text-center">
              <h1 className="text-[26px] font-semibold leading-tight text-fg">
                Set up your workspace
              </h1>
              <p className="mx-auto mt-2.5 max-w-md text-[15px] leading-relaxed text-fg-subtle">
                Create a new organization, or join one your team already runs.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <ChoiceCard
                icon={<LayersIcon className="size-[18px]" />}
                title="Create organization"
                body="Start a fresh workspace, connect your sources and invite the team."
                onClick={() => setStage("create")}
              />
              <ChoiceCard
                icon={<UsersIcon className="size-[18px]" />}
                title="Join organization"
                body="Your company already uses Vibino and you were added by an admin."
                onClick={() => setStage("join")}
              />
            </div>
          </>
        )}

        {stage === "create" && (
          <form onSubmit={submitOrg}>
            <AuthHeading
              title="Name your organization"
              subtitle="You can change this later in workspace settings."
            />

            <Label htmlFor="org-name">Organization name</Label>
            <TextInput
              id="org-name"
              autoFocus
              placeholder="Meridian Labs"
              value={orgName}
              onChange={(event) => setOrgName(event.target.value)}
            />

            <Button
              type="submit"
              disabled={orgName.trim() === ""}
              className="mt-5 h-11 w-full"
            >
              Continue
            </Button>
          </form>
        )}

        {stage === "invite" && (
          <div>
            <AuthHeading
              title="Invite your teammates"
              subtitle={
                <>
                  Everyone at{" "}
                  <span className="text-fg">{orgName.trim()}</span> gets the same
                  answers, from the same sources.
                </>
              }
            />

            <Label htmlFor="invite-email">Email addresses</Label>
            <div className="flex gap-2">
              <TextInput
                id="invite-email"
                type="email"
                autoFocus
                placeholder="teammate@company.com"
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onKeyDown={handleInviteKey}
              />
              <Button
                type="button"
                variant="secondary"
                onClick={addInvite}
                disabled={!isEmail(draft.trim())}
                className="h-11 shrink-0"
              >
                Add
              </Button>
            </div>
            <p className="mt-2 text-[13px] text-fg-subtle">
              Press Enter to add another.
            </p>

            {invites.length > 0 && (
              <ul className="mt-5 space-y-2">
                {invites.map((invite) => (
                  <li
                    key={invite}
                    className="flex animate-fade items-center gap-3 rounded-card border border-hairline bg-surface px-3.5 py-2.5"
                  >
                    <MailIcon className="size-4 shrink-0 text-fg-subtle" />
                    <span className="min-w-0 flex-1 truncate text-sm text-fg-muted">
                      {invite}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        setInvites((current) =>
                          current.filter((item) => item !== invite),
                        )
                      }
                      aria-label={`Remove ${invite}`}
                      className="rounded-badge p-1 text-fg-subtle transition-colors hover:bg-elevated hover:text-fg"
                    >
                      <CloseIcon className="size-3.5" />
                    </button>
                  </li>
                ))}
              </ul>
            )}

            <div className="mt-7 flex flex-col gap-2.5">
              <Button
                onClick={() => router.push("/dashboard")}
                disabled={invites.length === 0}
                className="h-11 w-full"
              >
                Send {invites.length > 0 ? invites.length : ""}{" "}
                {invites.length === 1 ? "invite" : "invites"}
              </Button>
              <Button
                variant="ghost"
                onClick={() => router.push("/dashboard")}
                className="h-11 w-full"
              >
                Skip for now
              </Button>
            </div>
          </div>
        )}

        {stage === "join" && (
          <div className="text-center">
            <span className="mx-auto mb-6 inline-flex size-11 items-center justify-center rounded-card border border-hairline bg-surface text-fg-muted">
              <MailIcon className="size-5" />
            </span>
            <h1 className="text-[26px] font-semibold leading-tight text-fg">
              Ask your admin for an invite
            </h1>
            <p className="mx-auto mt-2.5 max-w-sm text-[15px] leading-relaxed text-fg-subtle">
              Ask your admin to invite you via email. The moment they do, your
              workspace appears here — nothing else to set up.
            </p>

            <Button
              onClick={() => router.push("/dashboard")}
              variant="secondary"
              className="mt-8 h-11 w-full"
            >
              Go to Dashboard
            </Button>
          </div>
        )}
      </div>
    </AuthShell>
  );
}

function ChoiceCard({
  icon,
  title,
  body,
  onClick,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group rounded-card border border-hairline bg-surface p-6 text-left transition-colors hover:border-accent/40 hover:bg-elevated"
    >
      <span className="inline-flex size-9 items-center justify-center rounded-card border border-hairline bg-elevated text-fg-muted transition-colors group-hover:text-fg">
        {icon}
      </span>
      <span className="mt-5 flex items-center gap-1.5 text-[15px] font-semibold text-fg">
        {title}
        <ChevronRightIcon className="size-4 text-fg-subtle transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
      <span className="mt-2 block text-sm leading-relaxed text-fg-subtle">
        {body}
      </span>
    </button>
  );
}
