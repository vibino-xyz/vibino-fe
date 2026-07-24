/**
 * Real GitHub App client. Unlike the still-simulated index status in
 * `indexing.ts`, connection and repository listing are backed by nexy's
 * `/github/*` endpoints, which talk to GitHub as the installed App.
 *
 * These wrappers hide the access-token plumbing so components call them just
 * like the mock (tokenless async methods).
 */

"use client";

import { api, type GithubConnection, type GithubRepo } from "@/lib/api";
import { authorized } from "@/lib/session";

export type { GithubConnection, GithubRepo };

export const githubApi = {
  /** Connection status for the current org. `configured` is false when the
   * server has no GitHub App credentials set up yet. */
  getConnection(): Promise<GithubConnection> {
    return authorized((token) => api.githubConnection(token));
  },

  /** The GitHub page where an admin installs the App. */
  getInstallUrl(): Promise<string> {
    return authorized((token) => api.githubInstallUrl(token)).then((r) => r.url);
  },

  /** Finalize a connection after GitHub redirects back with an installation id. */
  connect(installationId: number, state: string): Promise<GithubConnection> {
    return authorized((token) => api.githubConnect(installationId, state, token));
  },

  disconnect(): Promise<void> {
    return authorized((token) => api.githubDisconnect(token));
  },

  /** Repositories the installation can access. */
  listRepositories(): Promise<GithubRepo[]> {
    return authorized((token) => api.githubRepositories(token)).then(
      (r) => r.repositories,
    );
  },

  /** Branches of a single repo ("owner/name"). */
  listBranches(repoFullName: string): Promise<string[]> {
    return authorized((token) => api.githubBranches(repoFullName, token)).then(
      (r) => r.branches,
    );
  },
};
