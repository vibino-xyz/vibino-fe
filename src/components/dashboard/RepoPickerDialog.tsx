"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon, BranchIcon, ShieldIcon, SearchIcon } from "@/components/icons";
import { githubApi, type GithubRepo } from "@/lib/github";
import { indexingApi, type AddRepoInput } from "@/lib/indexing";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Selection {
  checked: boolean;
  branch: string;
  branches: string[]; // lazily loaded real branches
  loadingBranches: boolean;
}

export function RepoPickerDialog({
  open,
  onClose,
  onAdded,
  alreadyIndexed,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
  alreadyIndexed: string[];
}) {
  const [repos, setRepos] = useState<GithubRepo[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setRepos(null);
    setError(null);
    setSelections({});
    setQuery("");
    githubApi
      .listRepositories()
      .then((list) => {
        setRepos(list);
        setSelections(
          Object.fromEntries(
            list.map((r) => [
              String(r.external_id),
              {
                checked: false,
                branch: r.default_branch,
                branches: [r.default_branch],
                loadingBranches: false,
              },
            ]),
          ),
        );
      })
      .catch(() => setError("Couldn't load repositories from GitHub."));
  }, [open]);

  const toggle = (repo: GithubRepo) => {
    const key = String(repo.external_id);
    setSelections((prev) => {
      const current = prev[key];
      const nextChecked = !current.checked;
      // Lazily fetch the real branch list the first time a repo is selected.
      if (nextChecked && current.branches.length <= 1 && !current.loadingBranches) {
        githubApi
          .listBranches(repo.full_name)
          .then((branches) =>
            setSelections((p) => ({
              ...p,
              [key]: {
                ...p[key],
                branches: branches.length ? branches : [repo.default_branch],
                loadingBranches: false,
              },
            })),
          )
          .catch(() =>
            setSelections((p) => ({ ...p, [key]: { ...p[key], loadingBranches: false } })),
          );
      }
      return {
        ...prev,
        [key]: {
          ...current,
          checked: nextChecked,
          loadingBranches: nextChecked && current.branches.length <= 1,
        },
      };
    });
  };

  const setBranch = (key: string, branch: string) =>
    setSelections((prev) => ({ ...prev, [key]: { ...prev[key], branch } }));

  const chosen = (repos ?? []).filter((r) => selections[String(r.external_id)]?.checked);

  const submit = async () => {
    if (chosen.length === 0) return;
    const payload: AddRepoInput[] = chosen.map((r) => {
      const sel = selections[String(r.external_id)];
      return {
        external_id: String(r.external_id),
        full_name: r.full_name,
        language: r.language ?? "—",
        is_private: r.private,
        branch: sel.branch || r.default_branch,
        description: r.description ?? undefined,
      };
    });
    setSubmitting(true);
    try {
      await indexingApi.addRepositories(payload);
      onAdded();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const indexed = new Set(alreadyIndexed);
  const filtered = (repos ?? []).filter(
    (r) =>
      !indexed.has(String(r.external_id)) &&
      r.full_name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      size="lg"
      title="Add repositories"
      description="Choose repositories to index and the branch Vibino should read from."
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={submit} disabled={chosen.length === 0 || submitting}>
            {submitting
              ? "Starting…"
              : `Index ${chosen.length || ""} ${chosen.length === 1 ? "repository" : "repositories"}`.trim()}
          </Button>
        </>
      }
    >
      <div className="mb-3 flex h-9 items-center gap-2.5 rounded-card border border-hairline-strong bg-canvas px-3">
        <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search repositories…"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-fg placeholder:text-fg-subtle focus:outline-none"
        />
      </div>

      {error ? (
        <p className="py-10 text-center text-[13px] text-danger">{error}</p>
      ) : repos === null ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-fg-subtle">
          {(repos.length === 0)
            ? "The installation can't see any repositories. Grant the Vibino GitHub App access to more repos in GitHub."
            : indexed.size >= repos.length
              ? "All accessible repositories are already indexed."
              : "No repositories match your search."}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {filtered.map((repo) => {
            const key = String(repo.external_id);
            const selection = selections[key];
            const checked = selection?.checked;
            return (
              <li
                key={key}
                className={cn(
                  "rounded-card border px-3 py-2.5 transition-colors",
                  checked
                    ? "border-accent/40 bg-accent/[0.06]"
                    : "border-hairline bg-canvas hover:border-hairline-strong",
                )}
              >
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    onClick={() => toggle(repo)}
                    className={cn(
                      "flex size-[18px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                      checked
                        ? "border-accent bg-accent text-white"
                        : "border-hairline-strong bg-surface",
                    )}
                  >
                    {checked && <CheckIcon className="size-3" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => toggle(repo)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13.5px] font-medium text-fg">
                        {repo.full_name}
                      </span>
                      {repo.private && (
                        <ShieldIcon className="size-3.5 shrink-0 text-fg-subtle" />
                      )}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[12px] text-fg-subtle">
                      {repo.language && <span>{repo.language}</span>}
                      {repo.language && <span className="text-hairline-strong">·</span>}
                      <span>updated {timeAgo(repo.pushed_at)}</span>
                    </span>
                  </button>

                  {checked ? (
                    <span className="flex shrink-0 items-center gap-1.5">
                      <BranchIcon className="size-3.5 text-fg-subtle" />
                      <Select
                        value={selection.branch}
                        onChange={(event) => setBranch(key, event.target.value)}
                        disabled={selection.loadingBranches}
                        className="h-8 w-auto min-w-[120px]"
                      >
                        {selection.branches.map((branch) => (
                          <option key={branch} value={branch}>
                            {branch}
                          </option>
                        ))}
                      </Select>
                    </span>
                  ) : (
                    <Badge tone="neutral">{repo.default_branch}</Badge>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </Dialog>
  );
}

function LoadingRows() {
  return (
    <ul className="space-y-1.5">
      {Array.from({ length: 4 }, (_, index) => (
        <li
          key={index}
          className="h-[58px] animate-fade rounded-card border border-hairline bg-canvas"
          style={{ animationDelay: `${index * 60}ms` }}
        />
      ))}
    </ul>
  );
}
