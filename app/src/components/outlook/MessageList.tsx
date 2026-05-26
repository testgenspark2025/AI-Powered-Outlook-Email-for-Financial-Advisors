"use client";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Email } from "@/lib/db/repos/emails";

type Props = {
  emails: Email[];
  selectedId: string | null;
};

function formatTime(iso: string): string {
  const d = new Date(iso);
  const now = new Date();
  const sameDay = d.toDateString() === now.toDateString();
  return sameDay
    ? d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })
    : d.toLocaleDateString([], { month: "short", day: "numeric" });
}

export function MessageList({ emails, selectedId }: Props) {
  const router = useRouter();
  const params = useSearchParams();
  const segmentId = params.get("segmentId");
  const listRef = useRef<HTMLDivElement>(null);

  const ids = useMemo(() => emails.map((e) => e.id), [emails]);

  const navigateTo = useCallback(
    (id: string) => {
      const url = new URL(window.location.href);
      url.searchParams.set("id", id);
      if (segmentId) url.searchParams.set("segmentId", segmentId);
      router.replace(`${url.pathname}?${url.searchParams.toString()}`);
    },
    [router, segmentId],
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
      ref={listRef}
      role="listbox"
      aria-label="Inbox messages"
      className="flex w-full max-w-md shrink-0 flex-col overflow-y-auto border-r border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900"
    >
      <div className="border-b border-slate-200 px-3 py-2 dark:border-slate-800">
        <h2 className="text-base font-semibold">Inbox</h2>
        <div className="text-xs text-slate-500 dark:text-slate-400">
          {emails.length} message{emails.length === 1 ? "" : "s"}
        </div>
      </div>
      {emails.length === 0 ? (
        <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">
          No messages match this filter.
        </div>
      ) : (
        <ul>
          {emails.map((e) => {
            const isActive = e.id === selectedId;
            const senderName = e.client?.fullName ?? e.fromEmail;
            return (
              <li key={e.id} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => navigateTo(e.id)}
                  className={`w-full border-b border-slate-100 px-3 py-3 text-left transition dark:border-slate-800 ${
                    isActive
                      ? "bg-blue-50 dark:bg-slate-800"
                      : "hover:bg-slate-50 dark:hover:bg-slate-800/60"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className={`truncate ${e.isRead ? "" : "font-semibold"}`}>
                      {senderName}
                    </div>
                    <div className="shrink-0 text-xs text-slate-500 dark:text-slate-400">
                      {formatTime(e.receivedAt)}
                    </div>
                  </div>
                  <div className={`truncate text-sm ${e.isRead ? "text-slate-600 dark:text-slate-400" : "font-medium"}`}>
                    {e.subject}
                  </div>
                  <div className="truncate text-xs text-slate-500 dark:text-slate-400">
                    {e.preview}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[11px]">
                    {e.client?.segment ? (
                      <span className="rounded bg-slate-100 px-1.5 py-0.5 text-slate-700 dark:bg-slate-800 dark:text-slate-300">
                        {e.client.segment.name}
                      </span>
                    ) : null}
                    {e.isImportant ? (
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
