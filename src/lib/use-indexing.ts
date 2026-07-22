"use client";

import { useEffect, useState } from "react";
import { REPOS, type Repo, type RepoStatus } from "@/lib/mock-data";

/**
 * Where each repository sits on the overall completion bar. Statuses are
 * derived from one number rather than tracked separately, so the list and
 * the progress bar can never disagree.
 */
const SCHEDULE = [
  { start: 0, done: 18 },
  { start: 18, done: 40 },
  { start: 40, done: 62 },
  { start: 62, done: 76 },
  { start: 76, done: 88 },
  { start: 88, done: 100 },
];

const START_AT = 52;
const STEP = 0.6;
const TICK_MS = 600;

export interface RepoState extends Repo {
  filesDone: number;
}

function statusFor(index: number, progress: number): RepoStatus {
  if (REPOS[index].status === "error") return "error";

  const window = SCHEDULE[index];
  if (!window) return "queued";
  if (progress >= window.done) return "indexed";
  if (progress >= window.start) return "syncing";
  return "queued";
}

function detailFor(repo: Repo, status: RepoStatus, filesDone: number) {
  switch (status) {
    case "indexed":
      return `${repo.files.toLocaleString()} files indexed`;
    case "syncing":
      return `${filesDone.toLocaleString()} of ${repo.files.toLocaleString()} files`;
    case "error":
      return repo.detail;
    default:
      return "Waiting to start";
  }
}

export function useIndexing() {
  const [progress, setProgress] = useState(START_AT);

  useEffect(() => {
    if (progress >= 100) return;
    const timer = setTimeout(
      () => setProgress((value) => Math.min(100, value + STEP)),
      TICK_MS,
    );
    return () => clearTimeout(timer);
  }, [progress]);

  const repos: RepoState[] = REPOS.map((repo, index) => {
    const status = statusFor(index, progress);
    const window = SCHEDULE[index];

    let filesDone = 0;
    if (status === "indexed") {
      filesDone = repo.files;
    } else if (status === "syncing" && window) {
      const span = window.done - window.start;
      const ratio = span > 0 ? (progress - window.start) / span : 0;
      filesDone = Math.round(repo.files * Math.min(1, Math.max(0, ratio)));
    }

    return {
      ...repo,
      status,
      filesDone,
      detail: detailFor(repo, status, filesDone),
    };
  });

  const indexedCount = repos.filter((repo) => repo.status === "indexed").length;
  const filesIndexed = repos.reduce((total, repo) => total + repo.filesDone, 0);

  return {
    progress,
    repos,
    indexedCount,
    filesIndexed,
    complete: progress >= 100,
    minutesLeft: Math.max(1, Math.round((100 - progress) / 12)),
  };
}
