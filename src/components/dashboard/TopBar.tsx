import Link from "next/link";
import { LogoMark } from "@/components/ui/Logo";
import { SearchIcon, BellIcon, SettingsIcon } from "@/components/icons";
import { ORG } from "@/lib/mock-data";

export function TopBar({ showAsk = true }: { showAsk?: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-hairline bg-canvas/85 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-[1440px] items-center gap-4 px-5 lg:px-8">
        {/* Identity */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <LogoMark size={24} />
          <span className="hidden text-sm font-semibold tracking-[-0.01em] text-fg sm:inline">
            Vibino
          </span>
          <span aria-hidden className="hidden h-4 w-px bg-hairline-strong sm:inline-block" />
          <span className="hidden text-[13px] text-fg-subtle md:inline">
            {ORG.name}
          </span>
        </Link>

        {/* Ask bar — min-w-0 lets this column shrink past its content so the
            account cluster stays on screen on narrow viewports */}
        <div className="flex min-w-0 flex-1 justify-center">
          {showAsk && (
            <button
              type="button"
              className="group flex h-9 w-full max-w-[460px] items-center gap-2.5 rounded-pill border border-hairline-strong bg-surface px-4 text-left transition-colors hover:border-[#33333a] hover:bg-elevated"
            >
              <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
              <span className="min-w-0 flex-1 truncate text-[13px] text-fg-subtle transition-colors group-hover:text-fg-muted">
                Ask Vibino anything about your company...
              </span>
              <kbd className="hidden shrink-0 rounded-[5px] border border-hairline-strong bg-elevated px-1.5 py-0.5 text-[11px] font-medium text-fg-subtle sm:inline-block">
                ⌘K
              </kbd>
            </button>
          )}
        </div>

        {/* Account */}
        <div className="flex shrink-0 items-center gap-1">
          <IconButton label="Notifications">
            <BellIcon className="size-[18px]" />
            <span className="absolute right-2 top-2 size-1.5 rounded-full bg-accent" />
          </IconButton>
          <IconButton label="Settings">
            <SettingsIcon className="size-[18px]" />
          </IconButton>
          <button
            type="button"
            aria-label="Account"
            className="ml-1.5 flex size-7 items-center justify-center rounded-full border border-hairline-strong bg-elevated text-[11px] font-medium text-fg-muted transition-colors hover:text-fg"
          >
            {ORG.user.initials}
          </button>
        </div>
      </div>
    </header>
  );
}

function IconButton({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      className="relative flex size-8 items-center justify-center rounded-card text-fg-subtle transition-colors hover:bg-elevated hover:text-fg"
    >
      {children}
    </button>
  );
}
