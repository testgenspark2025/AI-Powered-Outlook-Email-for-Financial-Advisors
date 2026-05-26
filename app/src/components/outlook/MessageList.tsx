"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export type MailRow = {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  receivedAt: string;
  isRead: boolean;
  isImportant: boolean;
  segmentName?: string | null;
};

type Props = {
  rows: MailRow[];
  selectedId: string | null;
  title: string;
  emptyHint?: string;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function MessageList({ rows, selectedId, title, emptyHint }: Props) {
  const router = useRouter();
  const params = useSearchParams();

  const ids = useMemo(() => rows.map((r) => r.id), [rows]);

  const buildHref = useCallback(
    (id: string): string => {
      const sp = new URLSearchParams(params.toString());
      sp.set("id", id);
      return `/?${sp.toString()}`;
    },
    [params],
  );

  const navigateTo = useCallback(
    (id: string) => {
      router.replace(buildHref(id));
    },
    [router, buildHref],
  );

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "Enter") return;
      if (ids.length === 0) return;
      const currentIndex = selectedId ? ids.indexOf(selectedId) : -1;
      if (e.key === "ArrowDown") {
        e.preventDefault();
        const next = currentIndex < 0 ? 0 : Math.min(currentIndex + 1, ids.length - 1);
        navigateTo(ids[next]!);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        const next = currentIndex <= 0 ? 0 : currentIndex - 1;
        navigateTo(ids[next]!);
      } else if (e.key === "Enter") {
        if (currentIndex < 0) {
          e.preventDefault();
          navigateTo(ids[0]!);
        }
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [ids, selectedId, navigateTo]);

  return (
    <div
      role="listbox"
      aria-label={title}
      className="flex w-full max-w-md shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h2 className="text-base font-semibold">{title}</h2>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {rows.length} message{rows.length === 1 ? "" : "s"}
        </div>
      </div>
      {rows.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          {emptyHint ?? "No messages here."}
        </div>
      ) : (
        <ul>
          {rows.map((r) => {
            const isActive = r.id === selectedId;
            return (
              <li key={r.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => navigateTo(r.id)}
                  className={`w-full border-b border-slate-100 px-3 py-3 text-left transition dark:border-slate-800 ${
                    isActive
                      ? "bg-blue-50 dark:bg-slate-800"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`truncate ${r.isRead ? "" : "font-semibold"}`}>{r.sender}</div>
                    <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                      {formatTime(r.receivedAt)}
                    </div>
                  </div>
                  <div className={`truncate text-sm ${r.isRead ? "text-slate-600 dark:text-slate-400" : "font-medium"}`}>
                    {r.subject || "(no subject)"}
                  </div>
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {r.preview}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    {r.segmentName ? (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {r.segmentName}
                      </span>
                    ) : null}
                    {r.isImportant ? (
                      <span className="rounded bg-amber-100 px-1.5 py-0.5 text-amber-800 dark:bg-amber-900/40 dark:text-amber-200">
                        Important
                      </span>
                    ) : null}
                  </div>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
