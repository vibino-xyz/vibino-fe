"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GitHubIcon, ShieldIcon, RefreshIcon, CheckIcon, AlertIcon } from "@/components/icons";
import { githubApi } from "@/lib/github";

const POINTS = [
  { icon: ShieldIcon, text: "Fine-grained, read-only access to the repos you pick" },
  { icon: RefreshIcon, text: "Stays in sync automatically as your team pushes" },
  { icon: CheckIcon, text: "Install once for the whole organization" },
];

export function ConnectGithubCard({ configured }: { configured: boolean }) {
  const [connecting, setConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const connect = async () => {
    setConnecting(true);
    setError(null);
    try {
      // Hand off to GitHub's App-install page; it redirects back to
      // /dashboard/github/callback with the installation id.
      const url = await githubApi.getInstallUrl();
      window.location.href = url;
    } catch {
      setError("Couldn't start the GitHub install. Please try again.");
      setConnecting(false);
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-hairline bg-surface">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-64 rounded-full bg-accent/[0.08] blur-[90px]"
      />
      <div className="relative px-6 py-10 sm:px-10 sm:py-12">
        <div className="mx-auto max-w-md text-center">
          <span className="mx-auto inline-flex size-12 items-center justify-center rounded-card border border-hairline-strong bg-elevated text-fg">
            <GitHubIcon className="size-6" />
          </span>
          <h2 className="mt-5 text-[19px] font-semibold text-fg">
            Connect GitHub to start indexing
          </h2>
          <p className="mx-auto mt-2 max-w-sm text-[14px] leading-relaxed text-fg-subtle">
            Install the Vibino GitHub App on your organization, then choose which
            repositories and branch to index.
          </p>

          {configured ? (
            <>
              <Button size="lg" onClick={connect} disabled={connecting} className="mt-7">
                <GitHubIcon className="size-[18px]" />
                {connecting ? "Redirecting to GitHub…" : "Connect GitHub"}
              </Button>
              {error && <p className="mt-3 text-[13px] text-danger">{error}</p>}
            </>
          ) : (
            <div className="mx-auto mt-7 flex max-w-sm items-start gap-2.5 rounded-card border border-warning/25 bg-warning/[0.07] px-4 py-3 text-left">
              <AlertIcon className="mt-px size-4 shrink-0 text-warning" />
              <p className="text-[12.5px] leading-relaxed text-[#e8c48a]">
                The Vibino GitHub App isn&rsquo;t configured on the server yet. An
                administrator needs to create the App and set its credentials in
                nexy&rsquo;s environment before you can connect.
              </p>
            </div>
          )}
        </div>

        <ul className="mx-auto mt-9 flex max-w-md flex-col gap-2.5">
          {POINTS.map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2.5 text-[13px] text-fg-muted">
              <span className="flex size-6 shrink-0 items-center justify-center rounded-badge border border-hairline bg-elevated text-fg-subtle">
                <Icon className="size-3.5" />
              </span>
              {text}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
