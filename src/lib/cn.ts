type ClassValue = string | false | null | undefined;

/** Tiny class joiner — keeps conditional Tailwind strings readable. */
export function cn(...values: ClassValue[]) {
  return values.filter(Boolean).join(" ");
}
