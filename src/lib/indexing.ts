/**
 * Index-status simulation.
 *
 * GitHub connection and repository listing are now REAL (see `github.ts` →
 * nexy `/github/*`). The actual indexing pipeline (synthy: clone → parse →
 * embed) is not yet wired to a status API, so this module simulates the
 * per-repo index status for repos the user chooses to index. It is fed real
 * repo identity from GitHub and persists to localStorage; progress is derived
 * from timestamps so it advances across reloads like a real polling client.
 *
 * This is the remaining seam: replace `indexingApi` with calls to a real
 * indexing-status endpoint once synthy exposes one.
 */

"use client";

export type IndexState = "indexed" | "syncing" | "queued" | "error" | "paused";

export interface Commit {
  sha: string;
  message: string;
  author_name: string;
  committed_at: string;
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
  last_commit?: Commit; // absent until real indexing captures it
  last_synced_at: string | null;
  error_message?: string;
}

/** What the repo picker hands over — real GitHub repo identity + chosen branch. */
export interface AddRepoInput {
  external_id: string;
  full_name: string;
  language: string;
  is_private: boolean;
  branch: string;
  description?: string;
}

const STORAGE_KEY = "vibino.index-status.v2";
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
  sync_started_at: number; // epoch ms this repo's sync window opens
}

interface Store {
  repos: StoredRepo[];
}

function emptyStore(): Store {
  return { repos: [] };
}

function load(): Store {
  if (typeof window === "undefined") return emptyStore();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Store) : emptyStore();
  } catch {
    return emptyStore();
  }
}

function save(store: Store): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

/** Stable pseudo file count derived from the repo name, so the sim is
 * consistent across reloads without needing real data. */
function fileCountFor(fullName: string): number {
  let hash = 0;
  for (let i = 0; i < fullName.length; i++) hash = (hash * 31 + fullName.charCodeAt(i)) | 0;
  return 300 + (Math.abs(hash) % 4200);
}

/** Latest projected finish across pending repos, for sequential queueing. */
function pipelineEnd(repos: StoredRepo[]): number {
  return repos.reduce(
    (end, r) => Math.max(end, r.sync_started_at + SYNC_MS),
    Date.now(),
  );
}

function view(r: StoredRepo): IndexedRepo {
  const now = Date.now();
  const base = {
    id: r.id,
    external_id: r.external_id,
    full_name: r.full_name,
    description: r.description,
    is_private: r.is_private,
    branch: r.branch,
    language: r.language,
    file_count: r.file_count,
    chunk_count: r.chunk_count,
  };

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
  return "idx_" + Math.random().toString(16).slice(2, 10) + Math.random().toString(16).slice(2, 10);
}

function delay<T>(value: T, ms = 200): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export const indexingApi = {
  listIndexedRepos(): Promise<IndexedRepo[]> {
    return delay(load().repos.map(view), 150);
  },

  /** True if a repo (by external id) is already being indexed. */
  indexedExternalIds(): string[] {
    return load().repos.map((r) => r.external_id);
  },

  addRepositories(inputs: AddRepoInput[]): Promise<IndexedRepo[]> {
    const store = load();
    let cursor = pipelineEnd(store.repos);

    for (const input of inputs) {
      if (store.repos.some((r) => r.external_id === input.external_id)) continue;
      const files = fileCountFor(input.full_name);
      store.repos.push({
        id: genId(),
        external_id: input.external_id,
        full_name: input.full_name,
        description: input.description,
        is_private: input.is_private,
        branch: input.branch,
        language: input.language,
        file_count: files,
        chunk_count: Math.round(files * 3.4),
        sync_started_at: cursor,
      });
      cursor += SYNC_MS;
    }

    save(store);
    return delay(store.repos.map(view), 400);
  },

  setBranch(repoId: string, branch: string): Promise<IndexedRepo> {
    const store = load();
    const repo = store.repos.find((r) => r.id === repoId);
    if (!repo) return Promise.reject(new Error("Repository not found"));
    repo.branch = branch;
    repo.sync_started_at = pipelineEnd(store.repos.filter((r) => r.id !== repoId));
    save(store);
    return delay(view(repo), 350);
  },

  reindex(repoId: string): Promise<IndexedRepo> {
    const store = load();
    const repo = store.repos.find((r) => r.id === repoId);
    if (!repo) return Promise.reject(new Error("Repository not found"));
    repo.sync_started_at = pipelineEnd(store.repos.filter((r) => r.id !== repoId));
    save(store);
    return delay(view(repo), 350);
  },

  removeRepository(repoId: string): Promise<void> {
    const store = load();
    store.repos = store.repos.filter((r) => r.id !== repoId);
    save(store);
    return delay(undefined, 250);
  },
};
