import Link from "next/link";

export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="vibino-mark" x1="0" y1="0" x2="32" y2="32">
          <stop stopColor="#8B5CF6" />
          <stop offset="1" stopColor="#6D28D9" />
        </linearGradient>
      </defs>
      <rect width="32" height="32" rx="8" fill="url(#vibino-mark)" />
      <path
        d="M9.6 10.8 16 22l6.4-11.2"
        stroke="#fff"
        strokeWidth="2.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="12.4" r="1.7" fill="#fff" fillOpacity="0.92" />
    </svg>
  );
}

export function Logo({
  href = "/",
  size = 28,
  showWordmark = true,
}: {
  href?: string | null;
  size?: number;
  showWordmark?: boolean;
}) {
  const inner = (
    <>
      <LogoMark size={size} />
      {showWordmark && (
        <span className="text-[15px] font-semibold tracking-[-0.02em] text-fg">
          Vibino
        </span>
      )}
    </>
  );

  if (!href) {
    return <span className="flex items-center gap-2.5">{inner}</span>;
  }

  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 rounded-badge transition-opacity hover:opacity-85"
    >
      {inner}
    </Link>
  );
}
