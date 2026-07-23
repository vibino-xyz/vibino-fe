/**
 * Indexing / GitHub client.
 *
 * The repository-indexing backend (synthy) does not yet expose a management
 * API — there is no GitHub App connection, repo listing, or index-status
 * endpoint. Until it does, this module is the single seam that stands in for
 * it: every screen talks to `indexingApi`, and the mock adapter below can be
 * replaced with real `fetch` calls one method at a time without touching any
 * component.
 *
 * State is persisted to localStorage and index progress is derived purely from
 * timestamps, so a running/queued repo keeps advancing across reloads and route
 * changes — the same way a real polling client would observe a backend job.
 */

"use client";

export type IndexState =
  | "indexed"
  | "syncing"
  | "queued"
  | "error"
  | "paused";

export interface Commit {
  sha: string;
  message: string;
  author_name: string;
  committed_at: string;
}

export interface GithubConnection {
  connected: boolean;
  account_login?: string;
  installation_id?: string;
  connected_at?: string;
}

export interface ConnectableRepo {
  external_id: string;
  full_name: string;
  description?: string;
  is_private: boolean;
  default_branch: string;
  branches: string[];
  language: string;
  updated_at: string;
}

export interface IndexedRepo {
  id: string;
  external_id: string;
  full_name: string;
  description?: string;
  is_private: boolean;
  branch: string;
  language: string;
  state: IndexState;
  progress: number; // 0..100
  file_count: number;
  indexed_file_count: number;
  chunk_count: number;
  last_commit: Commit;
  last_synced_at: string | null;
  error_message?: string;
}

export interface RepoSelection {
  external_id: string;
  branch: string;
}

/* ------------------------------------------------------------------ mock */

const STORAGE_KEY = "vibino.indexing.v1";
const SYNC_MS = 16_000; // wall-clock a single repo spends "syncing"

interface StoredRepo {
  id: string;
  external_id: string;
  full_name: string;
  description?: string;
  is_private: boolean;
  branch: string;
  language: string;
  file_count: number;
  chunk_count: number;
  last_commit: Commit;
  sync_started_at: number; // epoch ms this repo's sync window opens
  always_errors?: boolean; // seeded repo that fails, to exercise the error UI
}

interface Store {
  connection: GithubConnection;
  repos: StoredRepo[];
}

// The catalog the GitHub App "installation" can see. Realistic, varied.
const CATALOG: ConnectableRepo[] = [
  {
    external_id: "gh_884213",
    full_name: "meridian/web-platform",
    description: "Customer-facing Next.js application and design system.",
    is_private: true,
    default_branch: "main",
    branches: ["main", "develop", "release/24.3"],
    language: "TypeScript",
    updated_at: iso(-2 * 3600),
  },
  {
    external_id: "gh_884219",
    full_name: "meridian/api-gateway",
    description: "Public API gateway, auth and rate limiting.",
    is_private: true,
    default_branch: "main",
    branches: ["main", "staging"],
    language: "Go",
    updated_at: iso(-26 * 3600),
  },
  {
    external_id: "gh_884231",
    full_name: "meridian/billing-service",
    description: "Subscriptions, invoicing and dunning.",
    is_private: true,
    default_branch: "main",
    branches: ["main", "develop"],
    language: "Go",
    updated_at: iso(-5 * 3600),
  },
  {
    external_id: "gh_884244",
    full_name: "meridian/data-pipeline",
    description: "Batch and streaming ETL for the analytics warehouse.",
    is_private: true,
    default_branch: "main",
    branches: ["main"],
    language: "Python",
    updated_at: iso(-49 * 3600),
  },
  {
    external_id: "gh_884251",
    full_name: "meridian/design-system",
    description: "Shared React component library and tokens.",
    is_private: false,
    default_branch: "main",
    branches: ["main", "next"],
    language: "TypeScript",
    updated_at: iso(-9 * 3600),
  },
  {
    external_id: "gh_884260",
    full_name: "meridian/mobile-ios",
    description: "Native iOS client.",
    is_private: true,
    default_branch: "main",
    branches: ["main", "develop"],
    language: "Swift",
    updated_at: iso(-73 * 3600),
  },
  {
    external_id: "gh_884277",
    full_name: "meridian/infra-terraform",
    description: "Cloud infrastructure as code.",
    is_private: true,
    default_branch: "main",
    branches: ["main"],
    language: "HCL",
    updated_at: iso(-14 * 3600),
  },
];

const COMMITS: Record<string, Commit> = {
  gh_884213: commit("a1c9f04", "Fix hydration mismatch in pricing table", "Priya Raghavan", -2 * 3600),
  gh_884219: commit("7fe2b18", "Add retry budget to upstream calls", "Diego Salas", -26 * 3600),
  gh_884231: commit("3b9d5aa", "Retry idempotent charges on gateway 5xx", "Anna Kaur", -5 * 3600),
  gh_884244: commit("c05e731", "Backfill late-arriving events", "Marcus Webb", -49 * 3600),
  gh_884251: commit("9d41e0c", "Tighten focus-ring tokens for dark mode", "Priya Raghavan", -9 * 3600),
  gh_884260: commit("2a77b90", "Migrate to Swift concurrency", "Yuki Tanaka", -73 * 3600),
  gh_884277: commit("f18cc42", "Split staging and prod state backends", "Diego Salas", -14 * 3600),
};

const FILE_COUNTS: Record<string, number> = {
  gh_884213: 4218,
  gh_884219: 1874,
  gh_884231: 963,
  gh_884244: 1336,
  gh_884251: 742,
  gh_884260: 2051,
  gh_884277: 318,
};

function iso(secondsFromNow: number): string {
  return new Date(Date.now() + secondsFromNow * 1000).toISOString();
}

function commit(sha: string, message: string, author: string, secs: number): Commit {
  return { sha, message, author_name: author, committed_at: iso(secs) };
}

function emptyStore(): Store {
  return { connection: { connected: false }, repos: [] };
}

function load(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyStore();
    return JSON.parse(raw) as Store;
  } catch {
    return emptyStore();
  }
}

function save(store: Store): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Latest projected finish time across all pending repos, for sequential queueing. */
function pipelineEnd(repos: StoredRepo[]): number {
  return repos.reduce((end, r) => {
    if (r.always_errors) return end;
    return Math.max(end, r.sync_started_at + SYNC_MS);
  }, Date.now());
}

function view(r: StoredRepo): IndexedRepo {
  const now = Date.now();
  const base: Omit<IndexedRepo, "state" | "progress" | "indexed_file_count" | "last_synced_at" | "error_message"> = {
    id: r.id,
    external_id: r.external_id,
    full_name: r.full_name,
    description: r.description,
    is_private: r.is_private,
    branch: r.branch,
    language: r.language,
    file_count: r.file_count,
    chunk_count: r.chunk_count,
    last_commit: r.last_commit,
  };

  if (r.always_errors) {
    return {
      ...base,
      state: "error",
      progress: 0,
      indexed_file_count: 0,
      last_synced_at: null,
      error_message: "Indexing failed: repository access was revoked. Reconnect to retry.",
    };
  }

  const start = r.sync_started_at;
  if (now < start) {
    return { ...base, state: "queued", progress: 0, indexed_file_count: 0, last_synced_at: null };
  }

  const elapsed = now - start;
  if (elapsed < SYNC_MS) {
    const progress = Math.min(99, Math.round((elapsed / SYNC_MS) * 100));
    return {
      ...base,
      state: "syncing",
      progress,
      indexed_file_count: Math.round((progress / 100) * r.file_count),
      last_synced_at: null,
    };
  }

  return {
    ...base,
    state: "indexed",
    progress: 100,
    indexed_file_count: r.file_count,
    last_synced_at: new Date(start + SYNC_MS).toISOString(),
  };
}

function genId(): string {
  return "rep_" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
}

/** Small delay so the UI exercises its loading states like a real network. */
function delay<T>(value: T, ms = 320): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const indexingApi = {
  getConnection(): Promise<GithubConnection> {
    return delay(load().connection, 200);
  },

  connectGithub(): Promise<GithubConnection> {
    const store = load();
    store.connection = {
      connected: true,
      account_login: "meridian-labs",
      installation_id: "inst_" + Math.random().toString(16).slice(2, 10),
      connected_at: new Date().toISOString(),
    };
    save(store);
    return delay(store.connection, 900);
  },

  disconnectGithub(): Promise<void> {
    save(emptyStore());
    return delay(undefined, 300);
  },

  listConnectableRepos(): Promise<ConnectableRepo[]> {
    const store = load();
    const taken = new Set(store.repos.map((r) => r.external_id));
    return delay(CATALOG.filter((c) => !taken.has(c.external_id)), 400);
  },

  listIndexedRepos(): Promise<IndexedRepo[]> {
    return delay(load().repos.map(view), 180);
  },

  addRepositories(selections: RepoSelection[]): Promise<IndexedRepo[]> {
    const store = load();
    let cursor = pipelineEnd(store.repos);

    for (const sel of selections) {
      const cat = CATALOG.find((c) => c.external_id === sel.external_id);
      if (!cat || store.repos.some((r) => r.external_id === sel.external_id)) continue;

      const alwaysErrors = cat.external_id === "gh_884277"; // infra-terraform demo failure
      const repo: StoredRepo = {
        id: genId(),
        external_id: cat.external_id,
        full_name: cat.full_name,
        description: cat.description,
        is_private: cat.is_private,
        branch: sel.branch || cat.default_branch,
        language: cat.language,
        file_count: FILE_COUNTS[cat.external_id] ?? 500,
        chunk_count: Math.round((FILE_COUNTS[cat.external_id] ?? 500) * 3.4),
        last_commit: COMMITS[cat.external_id],
        sync_started_at: alwaysErrors ? Date.now() : cursor,
        always_errors: alwaysErrors,
      };
      if (!alwaysErrors) cursor += SYNC_MS;
      store.repos.push(repo);
    }

    save(store);
    return delay(store.repos.map(view), 500);
  },

  setBranch(repoId: string, branch: string): Promise<IndexedRepo> {
    const store = load();
    const repo = store.repos.find((r) => r.id === repoId);
    if (!repo) return Promise.reject(new Error("Repository not found"));
    repo.branch = branch;
    repo.sync_started_at = pipelineEnd(store.repos.filter((r) => r.id !== repoId));
    repo.always_errors = false;
    save(store);
    return delay(view(repo), 400);
  },

  reindex(repoId: string): Promise<IndexedRepo> {
    const store = load();
    const repo = store.repos.find((r) => r.id === repoId);
    if (!repo) return Promise.reject(new Error("Repository not found"));
    repo.sync_started_at = pipelineEnd(store.repos.filter((r) => r.id !== repoId));
    repo.always_errors = false;
    save(store);
    return delay(view(repo), 400);
  },

  removeRepository(repoId: string): Promise<void> {
    const store = load();
    store.repos = store.repos.filter((r) => r.id !== repoId);
    save(store);
    return delay(undefined, 300);
  },
};

/** Branches available for a repo, looked up from the installation catalog. */
export function repoBranches(externalId: string): string[] {
  return CATALOG.find((c) => c.external_id === externalId)?.branches ?? ["main"];
}

