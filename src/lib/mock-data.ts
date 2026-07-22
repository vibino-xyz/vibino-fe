export const ORG = {
  name: "Meridian Labs",
  user: { firstName: "Ratnesh", lastName: "Mishra", initials: "RM" },
} as const;

export type RepoStatus = "indexed" | "syncing" | "queued" | "error";

export interface Repo {
  name: string;
  language: string;
  files: number;
  status: RepoStatus;
  detail: string;
}

/** Ordered so the simulated indexer works top-down through the list. */
export const REPOS: Repo[] = [
  {
    name: "meridian/web-platform",
    language: "TypeScript",
    files: 4218,
    status: "indexed",
    detail: "Indexed 2 minutes ago",
  },
  {
    name: "meridian/api-gateway",
    language: "Go",
    files: 1874,
    status: "indexed",
    detail: "Indexed 4 minutes ago",
  },
  {
    name: "meridian/billing-service",
    language: "Go",
    files: 963,
    status: "syncing",
    detail: "1,204 of 1,880 files",
  },
  {
    name: "meridian/design-system",
    language: "TypeScript",
    files: 742,
    status: "queued",
    detail: "Waiting to start",
  },
  {
    name: "meridian/data-pipeline",
    language: "Python",
    files: 1336,
    status: "queued",
    detail: "Waiting to start",
  },
  {
    name: "meridian/mobile-ios",
    language: "Swift",
    files: 2051,
    status: "queued",
    detail: "Waiting to start",
  },
  {
    name: "meridian/infra-terraform",
    language: "HCL",
    status: "error",
    files: 318,
    detail: "Access token missing repo scope",
  },
];

export type ActivityKind =
  | "commit"
  | "pull-request"
  | "message"
  | "document"
  | "member"
  | "sync";

export interface ActivityItem {
  id: string;
  kind: ActivityKind;
  title: string;
  meta: string;
  time: string;
}

export const ACTIVITY: ActivityItem[] = [
  {
    id: "a1",
    kind: "sync",
    title: "Finished indexing web-platform",
    meta: "4,218 files · 62 MB",
    time: "2m ago",
  },
  {
    id: "a2",
    kind: "pull-request",
    title: "Merged “Retry idempotent charges”",
    meta: "billing-service · #2841",
    time: "14m ago",
  },
  {
    id: "a3",
    kind: "commit",
    title: "38 commits ingested",
    meta: "api-gateway · main",
    time: "31m ago",
  },
  {
    id: "a4",
    kind: "member",
    title: "Priya Raghavan joined the workspace",
    meta: "Invited by you",
    time: "1h ago",
  },
  {
    id: "a5",
    kind: "document",
    title: "Architecture decision record added",
    meta: "ADR-014 · Event bus migration",
    time: "3h ago",
  },
  {
    id: "a6",
    kind: "message",
    title: "Connected #engineering history",
    meta: "12,904 messages",
    time: "5h ago",
  },
];

export const SUGGESTED_QUESTIONS = [
  {
    question: "How does our billing retry logic handle failed charges?",
    scope: "Answers from billing-service and 4 pull requests",
  },
  {
    question: "Who owns the API gateway and what changed last sprint?",
    scope: "Answers from api-gateway, commits and reviews",
  },
  {
    question: "What did we decide about the event bus migration?",
    scope: "Answers from ADR-014 and design discussions",
  },
];

export const GITHUB_STATS = [
  { label: "Repositories", value: "7" },
  { label: "Files indexed", value: "12,480" },
  { label: "Last sync", value: "2m ago" },
] as const;

export type IntegrationId = "slack" | "jira" | "teams" | "meet" | "email";

export const PENDING_INTEGRATIONS: { id: IntegrationId; name: string }[] = [
  { id: "slack", name: "Slack" },
  { id: "jira", name: "Jira" },
  { id: "teams", name: "Teams" },
  { id: "meet", name: "Google Meet" },
  { id: "email", name: "Email" },
];
