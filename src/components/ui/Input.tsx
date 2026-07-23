import type { InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/cn";

export function Label({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-[13px] font-medium text-fg-muted"
    >
      {children}
    </label>
  );
}

export function TextInput({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-card border border-hairline-strong bg-surface px-3.5 text-[15px] text-fg",
        "placeholder:text-fg-subtle",
        "transition-colors duration-150 hover:border-[#33333a]",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "w-full resize-none rounded-card border border-hairline-strong bg-surface px-3.5 py-2.5 text-[14px] leading-relaxed text-fg",
        "placeholder:text-fg-subtle",
        "transition-colors duration-150 hover:border-[#33333a]",
        "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
        className,
      )}
      {...props}
    />
  );
}
