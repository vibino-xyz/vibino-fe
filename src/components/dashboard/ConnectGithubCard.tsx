"use client";

import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { GitHubIcon, ShieldIcon, RefreshIcon, CheckIcon } from "@/components/icons";
import { indexingApi } from "@/lib/indexing";

const POINTS = [
  { icon: ShieldIcon, text: "Fine-grained, read-only access to the repos you pick" },
  { icon: RefreshIcon, text: "Stays in sync automatically as your team pushes" },
  { icon: CheckIcon, text: "Install once for the whole organization" },
];

export function ConnectGithubCard({ onConnected }: { onConnected: () => void }) {
  const [connecting, setConnecting] = useState(false);

  const connect = async () => {
    setConnecting(true);
    try {
      // Real flow redirects to the GitHub App install screen and returns via
      // callback; the mock resolves the installation immediately.
      await indexingApi.connectGithub();
      onConnected();
    } finally {
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

          <Button
            size="lg"
            onClick={connect}
            disabled={connecting}
            className="mt-7"
          >
            <GitHubIcon className="size-[18px]" />
            {connecting ? "Connecting…" : "Connect GitHub"}
          </Button>
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
