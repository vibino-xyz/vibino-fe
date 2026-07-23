"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Badge } from "@/components/ui/Badge";
import { CheckIcon, BranchIcon, ShieldIcon, SearchIcon } from "@/components/icons";
import { indexingApi, type ConnectableRepo, type RepoSelection } from "@/lib/indexing";
import { timeAgo } from "@/lib/format";
import { cn } from "@/lib/cn";

interface Selection {
  checked: boolean;
  branch: string;
}

export function RepoPickerDialog({
  open,
  onClose,
  onAdded,
}: {
  open: boolean;
  onClose: () => void;
  onAdded: () => void;
}) {
  const [repos, setRepos] = useState<ConnectableRepo[] | null>(null);
  const [selections, setSelections] = useState<Record<string, Selection>>({});
  const [query, setQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!open) return;
    setRepos(null);
    setSelections({});
    setQuery("");
    indexingApi.listConnectableRepos().then((list) => {
      setRepos(list);
      setSelections(
        Object.fromEntries(
          list.map((r) => [r.external_id, { checked: false, branch: r.default_branch }]),
        ),
      );
    });
  }, [open]);

  const toggle = (id: string) =>
    setSelections((prev) => ({
      ...prev,
      [id]: { ...prev[id], checked: !prev[id].checked },
    }));

  const setBranch = (id: string, branch: string) =>
    setSelections((prev) => ({ ...prev, [id]: { ...prev[id], branch } }));

  const chosen = Object.entries(selections).filter(([, s]) => s.checked);

  const submit = async () => {
    const payload: RepoSelection[] = chosen.map(([external_id, s]) => ({
      external_id,
      branch: s.branch,
    }));
    if (payload.length === 0) return;
    setSubmitting(true);
    try {
      await indexingApi.addRepositories(payload);
      onAdded();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = (repos ?? []).filter((r) =>
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
          <Button
            size="sm"
            onClick={submit}
            disabled={chosen.length === 0 || submitting}
          >
            {submitting
              ? "Starting…"
              : `Index ${chosen.length || ""} ${chosen.length === 1 ? "repository" : "repositories"}`.trim()}
          </Button>
        </>
      }
    >
      {/* Search */}
      <div className="mb-3 flex h-9 items-center gap-2.5 rounded-card border border-hairline-strong bg-canvas px-3">
        <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Search repositories…"
          className="min-w-0 flex-1 bg-transparent text-[13px] text-fg placeholder:text-fg-subtle focus:outline-none"
        />
      </div>

      {repos === null ? (
        <LoadingRows />
      ) : filtered.length === 0 ? (
        <p className="py-10 text-center text-[13px] text-fg-subtle">
          {repos.length === 0
            ? "All available repositories are already indexed."
            : "No repositories match your search."}
        </p>
      ) : (
        <ul className="space-y-1.5">
          {filtered.map((repo) => {
            const selection = selections[repo.external_id];
            const checked = selection?.checked;
            return (
              <li
                key={repo.external_id}
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
                    onClick={() => toggle(repo.external_id)}
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
                    onClick={() => toggle(repo.external_id)}
                    className="min-w-0 flex-1 text-left"
                  >
                    <span className="flex items-center gap-1.5">
                      <span className="truncate text-[13.5px] font-medium text-fg">
                        {repo.full_name}
                      </span>
                      {repo.is_private && (
                        <ShieldIcon className="size-3.5 shrink-0 text-fg-subtle" />
                      )}
                    </span>
                    <span className="mt-0.5 flex items-center gap-2 text-[12px] text-fg-subtle">
                      <span>{repo.language}</span>
                      <span className="text-hairline-strong">·</span>
                      <span>updated {timeAgo(repo.updated_at)}</span>
                    </span>
                  </button>

                  {checked ? (
                    <span className="flex shrink-0 items-center gap-1.5">
                      <BranchIcon className="size-3.5 text-fg-subtle" />
                      <Select
                        value={selection.branch}
                        onChange={(event) => setBranch(repo.external_id, event.target.value)}
                        className="h-8 w-auto min-w-[110px]"
                      >
                        {repo.branches.map((branch) => (
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
