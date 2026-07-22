import Link from "next/link";
import type { ReactNode } from "react";
import { Logo } from "@/components/ui/Logo";
import { ChevronLeftIcon } from "@/components/icons";
import { cn } from "@/lib/cn";

/**
 * Centered chrome shared by the auth steps and org setup so the whole
 * onboarding path feels like one continuous surface.
 */
export function AuthShell({
  steps,
  currentStep,
  onBack,
  width = "narrow",
  children,
}: {
  steps?: number;
  currentStep?: number;
  onBack?: () => void;
  width?: "narrow" | "wide";
  children: ReactNode;
}) {
  return (
    <div className="relative flex min-h-dvh flex-col">
      {/* Clipped to the shell so the oversized glow never widens the page */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-[-20rem] h-[32rem] w-[52rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-[130px]" />
      </div>

      <header className="relative flex h-16 items-center justify-between px-6">
        <Logo href="/" />
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-[13px] text-fg-subtle transition-colors hover:text-fg"
          >
            <ChevronLeftIcon className="size-3.5" />
            Back
          </button>
        ) : (
          <Link
            href="/"
            className="text-[13px] text-fg-subtle transition-colors hover:text-fg"
          >
            Back to site
          </Link>
        )}
      </header>

      <main className="relative flex flex-1 items-center justify-center px-6 pb-24 pt-6">
        <div
          className={cn(
            "w-full",
            width === "narrow" ? "max-w-[400px]" : "max-w-[760px]",
          )}
        >
          {children}

          {steps && currentStep && (
            <div className="mt-10 flex items-center justify-center gap-2">
              {Array.from({ length: steps }, (_, index) => (
                <span
                  key={index}
                  className={cn(
                    "h-1 rounded-full transition-all duration-300",
                    index + 1 === currentStep
                      ? "w-6 bg-accent"
                      : index + 1 < currentStep
                        ? "w-1.5 bg-fg-subtle"
                        : "w-1.5 bg-hairline-strong",
                  )}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export function AuthHeading({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: ReactNode;
}) {
  return (
    <div className="mb-8">
      <h1 className="text-[26px] font-semibold leading-tight text-fg">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-2.5 text-[15px] leading-relaxed text-fg-subtle">
          {subtitle}
        </p>
      )}
    </div>
  );
}
