import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

/**
 * One shared shell for every glyph: 24px grid, 1.5 stroke, currentColor.
 * Keeping the whole set on identical rails is what stops the UI from
 * looking like a sticker sheet.
 */
function Icon({ children, ...props }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      width={16}
      height={16}
      {...props}
    >
      {children}
    </svg>
  );
}

/* ---------------------------------------------------------------- product */

export function GitHubIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.4 5.4 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </Icon>
  );
}

export function SlackIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect width="3" height="8" x="13" y="2" rx="1.5" />
      <path d="M19 8.5V10h1.5A1.5 1.5 0 1 0 19 8.5" />
      <rect width="3" height="8" x="8" y="14" rx="1.5" />
      <path d="M5 15.5V14H3.5A1.5 1.5 0 1 0 5 15.5" />
      <rect width="8" height="3" x="14" y="13" rx="1.5" />
      <path d="M15.5 19H14v1.5a1.5 1.5 0 1 0 1.5-1.5" />
      <rect width="8" height="3" x="2" y="8" rx="1.5" />
      <path d="M8.5 5H10V3.5A1.5 1.5 0 1 0 8.5 5" />
    </Icon>
  );
}

export function JiraIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 2.6 21.4 12 12 21.4 2.6 12z" />
      <path d="M12 7.8 16.2 12 12 16.2 7.8 12z" />
    </Icon>
  );
}

export function TeamsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2.5" y="5.5" width="12" height="13" rx="2" />
      <path d="M5.6 9.2h5.8M8.5 9.2v6" />
      <circle cx="19" cy="7.5" r="2.2" />
      <path d="M17 18.5v-3.2a2.4 2.4 0 0 1 2.4-2.4h2.1" />
    </Icon>
  );
}

export function MeetIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="6" width="13" height="12" rx="2" />
      <path d="m15 10.6 5.3-3.1a.5.5 0 0 1 .7.5v8a.5.5 0 0 1-.7.4L15 13.4" />
    </Icon>
  );
}

export function MailIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="2" y="4.5" width="20" height="15" rx="2" />
      <path d="m2.6 6.2 8.4 5.7a1.8 1.8 0 0 0 2 0l8.4-5.7" />
    </Icon>
  );
}

export function NotionIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="2.5" />
      <path d="M8.5 16V8l7 8V8" />
    </Icon>
  );
}

export function LinearIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <path d="M6.5 12.5 11.5 17.5M4.2 9.4l10.4 10.4M9.4 4.2l10.4 10.4" />
    </Icon>
  );
}

/* ------------------------------------------------------------------- ui */

export function SearchIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.6-3.6" />
    </Icon>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M18 8a6 6 0 1 0-12 0c0 6-2.5 7-2.5 7h17S18 14 18 8" />
      <path d="M13.7 19a2 2 0 0 1-3.4 0" />
    </Icon>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1A1.7 1.7 0 0 0 9 19.4a1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4.6 9a1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1" />
    </Icon>
  );
}

export function ArrowRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4.5 12h15M13.5 6l6 6-6 6" />
    </Icon>
  );
}

export function ArrowUpRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M7 17 17 7M8 7h9v9" />
    </Icon>
  );
}

export function ChevronRightIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m9 5 7 7-7 7" />
    </Icon>
  );
}

export function ChevronLeftIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m15 5-7 7 7 7" />
    </Icon>
  );
}

export function CheckIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m4.5 12.5 5 5 10-11" />
    </Icon>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5.2l3.2 1.9" />
    </Icon>
  );
}

export function AlertIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7.5v5M12 16.2v.2" />
    </Icon>
  );
}

export function RefreshIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 11a8.5 8.5 0 0 0-14.6-4.6L2.5 9.5" />
      <path d="M2.5 4.5v5h5" />
      <path d="M3.5 13a8.5 8.5 0 0 0 14.6 4.6l3.4-3.1" />
      <path d="M21.5 19.5v-5h-5" />
    </Icon>
  );
}

export function CommitIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="12" cy="12" r="3.5" />
      <path d="M3 12h5.5M15.5 12H21" />
    </Icon>
  );
}

export function PullRequestIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="6.5" cy="6" r="2.5" />
      <circle cx="6.5" cy="18" r="2.5" />
      <path d="M6.5 8.5v7" />
      <circle cx="17.5" cy="18" r="2.5" />
      <path d="M17.5 15.5V10a3 3 0 0 0-3-3h-2.8" />
      <path d="m13.8 4.8-2.2 2.2 2.2 2.2" />
    </Icon>
  );
}

export function MessageIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M20.5 12.4a7.7 7.7 0 0 1-8.3 7.7 8.4 8.4 0 0 1-3.1-.7L3.5 21l1.6-5.1a7.6 7.6 0 0 1-.8-3.4 7.7 7.7 0 0 1 7.7-8.1 7.7 7.7 0 0 1 8.5 8" />
    </Icon>
  );
}

export function DocumentIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
      <path d="M14 3v5h5M9 13h6M9 17h4" />
    </Icon>
  );
}

export function UsersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M15.5 20v-1.8a3.6 3.6 0 0 0-3.6-3.6H6.6A3.6 3.6 0 0 0 3 18.2V20" />
      <circle cx="9.2" cy="7.5" r="3.5" />
      <path d="M21 20v-1.8a3.6 3.6 0 0 0-2.7-3.5M15.8 4.2a3.6 3.6 0 0 1 0 6.9" />
    </Icon>
  );
}

export function VideoIcon(props: IconProps) {
  return <MeetIcon {...props} />;
}

export function LayersIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="m12 2.8 9 4.7-9 4.7-9-4.7z" />
      <path d="m3 12.4 9 4.7 9-4.7M3 17.1l9 4.7 9-4.7" />
    </Icon>
  );
}

export function ShieldIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 22s8-3.6 8-9.6V5.6L12 2.6 4 5.6v6.8C4 18.4 12 22 12 22" />
      <path d="m9 12 2.2 2.2L15.2 10" />
    </Icon>
  );
}

export function BoltIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M13.2 2.5 4.4 13.2a.6.6 0 0 0 .5 1h5.6l-.7 7.3 8.8-10.7a.6.6 0 0 0-.5-1h-5.6z" />
    </Icon>
  );
}

export function GraphIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="6" cy="7" r="2.5" />
      <circle cx="18" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="m8.2 8.4 2.6 7.4M16 8.2l-2.6 7.6M8.4 6.6l7.2-.4" />
    </Icon>
  );
}

export function SparkIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 3.2 13.8 9l5.8 1.8-5.8 1.8L12 18.4 10.2 12.6 4.4 10.8 10.2 9z" />
      <path d="M18.5 3v3M20 4.5h-3" />
    </Icon>
  );
}
