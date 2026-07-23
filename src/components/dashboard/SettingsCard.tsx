import type { ReactNode } from "react";

export function SettingsCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <section className="overflow-hidden rounded-card border border-hairline bg-surface">
      <div className="px-5 py-5 sm:px-6">
        <h2 className="text-[15px] font-semibold text-fg">{title}</h2>
        {description && (
          <p className="mt-1 max-w-xl text-[13px] leading-relaxed text-fg-subtle">
            {description}
          </p>
        )}
        <div className="mt-5">{children}</div>
      </div>
      {footer && (
        <div className="flex items-center justify-between gap-4 border-t border-hairline bg-canvas/40 px-5 py-3.5 sm:px-6">
          {footer}
        </div>
      )}
    </section>
  );
}

/** Inline "Saved" / error line for form footers. */
export function SaveStatus({
  state,
}: {
  state: "idle" | "saving" | "saved" | "error";
}) {
  if (state === "saved")
    return <span className="text-[12.5px] text-success">Saved</span>;
  if (state === "error")
    return (
      <span className="text-[12.5px] text-danger">Couldn&rsquo;t save changes</span>
    );
  return <span />;
}
