"use client";

import { useEffect, useState } from "react";
import { Dialog } from "@/components/ui/Dialog";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Label } from "@/components/ui/Input";
import { githubApi } from "@/lib/github";
import { indexingApi, type IndexedRepo } from "@/lib/indexing";

export function BranchDialog({
  repo,
  onClose,
  onChanged,
}: {
  repo: IndexedRepo | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [branch, setBranch] = useState(repo?.branch ?? "main");
  const [branches, setBranches] = useState<string[]>(repo ? [repo.branch] : []);
  const [submitting, setSubmitting] = useState(false);

  // Load the repo's real branches from GitHub when the dialog opens.
  useEffect(() => {
    if (!repo) return;
    setBranch(repo.branch);
    setBranches([repo.branch]);
    githubApi
      .listBranches(repo.full_name)
      .then((list) => setBranches(list.length ? list : [repo.branch]))
      .catch(() => setBranches([repo.branch]));
  }, [repo]);

  const submit = async () => {
    if (!repo) return;
    setSubmitting(true);
    try {
      await indexingApi.setBranch(repo.id, branch);
      onChanged();
      onClose();
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog
      open={repo !== null}
      onClose={onClose}
      title="Change indexed branch"
      description={
        repo ? (
          <>
            Vibino will re-index <span className="text-fg">{repo.full_name}</span>{" "}
            from the branch you choose.
          </>
        ) : undefined
      }
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose}>
            Cancel
          </Button>
          <Button
            size="sm"
            onClick={submit}
            disabled={submitting || branch === repo?.branch}
          >
            {submitting ? "Switching…" : "Switch & reindex"}
          </Button>
        </>
      }
    >
      <Label htmlFor="branch-select">Branch</Label>
      <Select
        id="branch-select"
        value={branch}
        onChange={(event) => setBranch(event.target.value)}
        className="h-10 w-full"
      >
        {branches.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </Select>
      <p className="mt-3 text-[12.5px] leading-relaxed text-fg-subtle">
        Vibino currently indexes a single branch per repository. Switching
        discards the current index and rebuilds it from the new branch.
      </p>
    </Dialog>
  );
}
