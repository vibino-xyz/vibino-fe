"use client";

import { useRef, type ClipboardEvent, type KeyboardEvent } from "react";
import { cn } from "@/lib/cn";

const LENGTH = 6;

export function OtpInput({
  value,
  onChange,
  onComplete,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  onComplete?: (code: string) => void;
}) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const focusAt = (index: number) => {
    inputs.current[Math.max(0, Math.min(LENGTH - 1, index))]?.focus();
  };

  const commit = (next: string[]) => {
    onChange(next);
    if (next.every((digit) => digit !== "")) onComplete?.(next.join(""));
  };

  const handleInput = (index: number, raw: string) => {
    const digits = raw.replace(/\D/g, "");
    if (!digits) return;

    // Typing into a filled box, or a fast paste, spills into the boxes after it
    const next = [...value];
    for (let offset = 0; offset < digits.length && index + offset < LENGTH; offset++) {
      next[index + offset] = digits[offset];
    }
    commit(next);
    focusAt(index + digits.length);
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Backspace") {
      event.preventDefault();
      const next = [...value];
      if (next[index]) {
        next[index] = "";
      } else if (index > 0) {
        next[index - 1] = "";
        focusAt(index - 1);
      }
      onChange(next);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      focusAt(index - 1);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      focusAt(index + 1);
    }
  };

  const handlePaste = (index: number, event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    handleInput(index, event.clipboardData.getData("text"));
  };

  return (
    <div className="flex items-center justify-between gap-2 sm:gap-2.5">
      {Array.from({ length: LENGTH }, (_, index) => (
        <input
          key={index}
          ref={(element) => {
            inputs.current[index] = element;
          }}
          value={value[index] ?? ""}
          onChange={(event) => handleInput(index, event.target.value)}
          onKeyDown={(event) => handleKeyDown(index, event)}
          onPaste={(event) => handlePaste(index, event)}
          onFocus={(event) => event.target.select()}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label={`Digit ${index + 1}`}
          className={cn(
            "nums h-13 w-full min-w-0 rounded-card border bg-surface text-center text-[19px] font-medium text-fg",
            "transition-colors duration-150",
            "focus:border-accent focus:outline-none focus:ring-2 focus:ring-accent/25",
            value[index]
              ? "border-hairline-strong"
              : "border-hairline hover:border-hairline-strong",
          )}
        />
      ))}
    </div>
  );
}
