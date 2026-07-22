"use client";

import { TopBar } from "@/components/dashboard/TopBar";
import { SourcesPanel } from "@/components/dashboard/SourcesPanel";
import { IndexingPanel } from "@/components/dashboard/IndexingPanel";
import { SuggestedQuestions } from "@/components/dashboard/SuggestedQuestions";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { useIndexing } from "@/lib/use-indexing";

export function ActiveDashboard() {
  const { repos, progress, indexedCount, filesIndexed, minutesLeft, complete } =
    useIndexing();

  return (
    <div className="min-h-dvh">
      <TopBar />

      <div
        className={[
          "mx-auto max-w-[1440px] px-5 py-8 lg:px-8 lg:py-10",
          "grid items-start gap-8",
          "lg:grid-cols-[240px_minmax(0,1fr)]",
          "xl:grid-cols-[248px_minmax(0,1fr)_312px] xl:gap-10",
        ].join(" ")}
      >
        <aside className="lg:col-start-1 lg:row-start-1">
          <SourcesPanel repoCount={repos.length} filesIndexed={filesIndexed} />
        </aside>

        <main className="min-w-0 lg:col-start-2 lg:row-start-1">
          <IndexingPanel
            repos={repos}
            progress={progress}
            indexedCount={indexedCount}
            filesIndexed={filesIndexed}
            minutesLeft={minutesLeft}
            complete={complete}
          />
          <SuggestedQuestions />
        </main>

        <aside className="min-w-0 lg:col-start-2 lg:row-start-2 xl:col-start-3 xl:row-start-1">
          <ActivityFeed />
        </aside>
      </div>
    </div>
  );
}
