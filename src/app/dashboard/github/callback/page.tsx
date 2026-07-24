"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LogoMark } from "@/components/ui/Logo";
import { Button } from "@/components/ui/Button";
import { AlertIcon, CheckIcon } from "@/components/icons";
import { githubApi } from "@/lib/github";

/**
 * GitHub redirects here after the App is installed (this is the App's
 * "Setup URL"), appending ?installation_id=…&setup_action=…&state=…. We finalize
 * the connection and bounce back to the dashboard.
 */
function GithubCallback() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const installationId = params.get("installation_id");
    const state = params.get("state") ?? "";

    if (!installationId) {
      setError("GitHub didn't return an installation. Please try connecting again.");
      return;
    }

    githubApi
      .connect(Number(installationId), state)
      .then(() => router.replace("/dashboard"))
      .catch((err) =>
        setError(
          err instanceof Error
            ? err.message
            : "Couldn't finish connecting GitHub.",
        ),
      );
  }, [params, router]);

  return (
    <div className="flex min-h-dvh items-center justify-center bg-canvas px-6">
      <div className="flex max-w-sm flex-col items-center text-center">
        <LogoMark size={32} />
        {error ? (
          <>
            <span className="mt-6 flex size-9 items-center justify-center rounded-full border border-danger/25 bg-danger/10 text-danger">
              <AlertIcon className="size-5" />
            </span>
            <h1 className="mt-4 text-[16px] font-semibold text-fg">
              Couldn&rsquo;t connect GitHub
            </h1>
            <p className="mt-2 text-[13px] leading-relaxed text-fg-subtle">{error}</p>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => router.replace("/dashboard")}
              className="mt-6"
            >
              Back to dashboard
            </Button>
          </>
        ) : (
          <>
            <span className="mt-6 flex size-9 items-center justify-center rounded-full border border-success/25 bg-success/10 text-success">
              <CheckIcon className="size-5" />
            </span>
            <p className="mt-4 text-[13px] text-fg-subtle">
              Finishing GitHub connection…
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GithubCallbackPage() {
  return (
    <Suspense fallback={null}>
      <GithubCallback />
    </Suspense>
  );
}
