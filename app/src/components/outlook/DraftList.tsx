import Link from "next/link";
import type { Draft } from "@/lib/db/repos/drafts";

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function DraftList({ drafts }: { drafts: Draft[] }) {
  return (
    <div className="flex w-full flex-col overflow-y-auto bg-white dark:bg-slate-900">
      <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h2 className="text-base font-semibold">Drafts</h2>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {drafts.length} draft{drafts.length === 1 ? "" : "s"}
        </div>
      </div>
      {drafts.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No drafts yet. Click <span className="font-medium">+ New Email</span> to start one.
        </div>
      ) : (
        <ul>
          {drafts.map((d) => (
            <li key={d.id}>
              <Link
                href={`/compose?draftId=${d.id}`}
                className="block border-b border-slate-100 px-3 py-3 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800/60"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="truncate font-medium">
                    To: {d.toAddress || <span className="italic text-slate-400">unset</span>}
                  </div>
                  <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                    {formatTime(d.updatedAt)}
                  </div>
                </div>
                <div className="truncate text-sm">
                  {d.subject || <span className="italic text-slate-400">(no subject)</span>}
                </div>
                <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                  {d.body.slice(0, 120) || "(empty body)"}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
