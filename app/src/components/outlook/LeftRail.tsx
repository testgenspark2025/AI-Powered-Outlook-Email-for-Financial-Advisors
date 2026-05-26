import Link from "next/link";
import type { Segment } from "@/lib/db/repos/segments";

type Props = {
  inboxCount: number;
  segments: Segment[];
  activeSegmentId?: number | null;
};

const FOLDERS = [
  { name: "Inbox", primary: true },
  { name: "Drafts" },
  { name: "Sent Items" },
  { name: "Junk Email" },
  { name: "Deleted Items" },
  { name: "Archive" },
];

export function LeftRail({ inboxCount, segments, activeSegmentId }: Props) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-slate-200 bg-slate-50 dark:border-slate-800 dark:bg-slate-950 md:block">
      <div className="border-b border-slate-200 px-3 py-3 dark:border-slate-800">
        <h2 className="text-sm font-semibold">Mail</h2>
      </div>
      <div className="overflow-y-auto">
        <Section title="Favorites">
          {FOLDERS.slice(0, 3).map((f) => (
            <FolderRow
              key={f.name}
              name={f.name}
              count={f.name === "Inbox" ? inboxCount : undefined}
              active={f.name === "Inbox"}
            />
          ))}
        </Section>
        <Section title="outlook@financialadvisor.com">
          {FOLDERS.map((f) => (
            <FolderRow
              key={`m-${f.name}`}
              name={f.name}
              count={f.name === "Inbox" ? inboxCount : undefined}
              active={f.name === "Inbox" && !activeSegmentId}
            />
          ))}
        </Section>
        <Section title="Client Segments">
          <Link
            href="/"
            className={`block rounded px-2 py-1 text-sm ${
              !activeSegmentId
                ? "bg-slate-200 dark:bg-slate-800"
                : "hover:bg-slate-100 dark:hover:bg-slate-800"
            }`}
          >
            All
          </Link>
          {segments.map((s) => (
            <Link
              key={s.id}
              href={`/?segmentId=${s.id}`}
              className={`flex items-center gap-2 rounded px-2 py-1 text-sm ${
                activeSegmentId === s.id
                  ? "bg-slate-200 dark:bg-slate-800"
                  : "hover:bg-slate-100 dark:hover:bg-slate-800"
              }`}
            >
              <span
                aria-hidden
                className="inline-block h-2 w-2 rounded-full"
                style={{ background: segmentDotColor(s.color) }}
              />
              <span className="truncate">{s.name}</span>
            </Link>
          ))}
        </Section>
      </div>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="p-2">
      <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
        {title}
      </div>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function FolderRow({
  name,
  count,
  active,
}: {
  name: string;
  count?: number;
  active?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between rounded px-2 py-1 text-sm ${
        active ? "bg-slate-200 dark:bg-slate-800" : "hover:bg-slate-100 dark:hover:bg-slate-800"
      }`}
    >
      <span>{name}</span>
      {typeof count === "number" ? (
        <span className="rounded bg-brand px-1.5 text-xs font-medium text-white">{count}</span>
      ) : null}
    </div>
  );
}

function segmentDotColor(name: string | null | undefined): string {
  switch (name) {
    case "purple":
      return "#8B5CF6";
    case "blue":
      return "#3B82F6";
    case "green":
      return "#10B981";
    case "teal":
      return "#14B8A6";
    case "orange":
      return "#F97316";
    case "indigo":
      return "#6366F1";
    case "cyan":
      return "#06B6D4";
    case "pink":
      return "#EC4899";
    case "amber":
      return "#F59E0B";
    case "rose":
      return "#F43F5E";
    default:
      return "#94A3B8";
  }
}
