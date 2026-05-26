"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { Draft } from "@/lib/db/repos/drafts";

type Props = {
  draft: Draft;
};

type SaveState =
  | { kind: "idle"; savedAt: string | null }
  | { kind: "dirty" }
  | { kind: "saving" }
  | { kind: "saved"; savedAt: string }
  | { kind: "error"; message: string };

const AUTOSAVE_MS = 5_000;

function describe(state: SaveState): string {
  switch (state.kind) {
    case "idle":
      return state.savedAt ? `Last saved ${formatTime(state.savedAt)}` : "Not saved yet";
    case "dirty":
      return "Unsaved changes";
    case "saving":
      return "Saving…";
    case "saved":
      return `Saved at ${formatTime(state.savedAt)}`;
    case "error":
      return `Save failed: ${state.message}`;
  }
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "numeric", minute: "2-digit", second: "2-digit" });
}

export function ComposeForm({ draft }: Props) {
  const router = useRouter();
  const [toAddress, setTo] = useState(draft.toAddress);
  const [subject, setSubject] = useState(draft.subject);
  const [body, setBody] = useState(draft.body);
  const [state, setState] = useState<SaveState>({ kind: "idle", savedAt: draft.updatedAt });
  const [sending, setSending] = useState(false);
  const dirty = useRef(false);
  const inflight = useRef(false);

  const persist = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    setState({ kind: "saving" });
    try {
      const res = await fetch(`/api/v1/drafts/${draft.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toAddress, subject, body }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setState({ kind: "error", message: msg.slice(0, 100) });
        return;
      }
      const updated = (await res.json()) as Draft;
      dirty.current = false;
      setState({ kind: "saved", savedAt: updated.updatedAt });
    } catch (err) {
      setState({ kind: "error", message: err instanceof Error ? err.message : "network error" });
    } finally {
      inflight.current = false;
    }
  }, [draft.id, toAddress, subject, body]);

  useEffect(() => {
    if (!dirty.current) return;
    setState({ kind: "dirty" });
    const t = setTimeout(() => {
      void persist();
    }, AUTOSAVE_MS);
    return () => clearTimeout(t);
  }, [toAddress, subject, body, persist]);

  function markDirty<T>(setter: (v: T) => void) {
    return (v: T) => {
      dirty.current = true;
      setter(v);
    };
  }

  async function onSaveClick() {
    await persist();
  }

  async function onSend() {
    if (sending) return;
    if (!toAddress.trim() || !subject.trim() || !body.trim()) {
      setState({ kind: "error", message: "To, subject, and body are required" });
      return;
    }
    setSending(true);
    try {
      if (dirty.current) await persist();
      const res = await fetch(`/api/v1/emails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ draftId: draft.id }),
      });
      if (!res.ok) {
        const msg = await res.text();
        setState({ kind: "error", message: msg.slice(0, 200) });
        return;
      }
      router.push("/?folder=sent");
      router.refresh();
    } finally {
      setSending(false);
    }
  }

  async function onDiscard() {
    if (sending) return;
    const ok = confirm("Discard this draft?");
    if (!ok) return;
    await fetch(`/api/v1/drafts/${draft.id}`, { method: "DELETE" });
    router.push("/");
    router.refresh();
  }

  return (
    <div className="flex flex-1 flex-col overflow-hidden bg-white dark:bg-slate-900">
      <header className="flex items-center justify-between border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
        <h1 className="text-base font-semibold">New Message</h1>
        <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
          <span aria-live="polite">{describe(state)}</span>
        </div>
      </header>
      <div className="grid grid-cols-1 gap-3 border-b border-slate-200 px-4 py-3 dark:border-slate-800">
        <Field label="To">
          <input
            type="email"
            value={toAddress}
            onChange={(e) => markDirty(setTo)(e.target.value)}
            placeholder="client@example.com"
            className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>
        <Field label="Subject">
          <input
            type="text"
            value={subject}
            onChange={(e) => markDirty(setSubject)(e.target.value)}
            placeholder="Subject"
            className="w-full rounded border border-slate-200 bg-white px-2 py-1 text-sm focus:border-brand focus:outline-none dark:border-slate-700 dark:bg-slate-900"
          />
        </Field>
      </div>
      <textarea
        value={body}
        onChange={(e) => markDirty(setBody)(e.target.value)}
        placeholder="Write your message…"
        className="flex-1 resize-none bg-white px-4 py-3 text-sm leading-relaxed focus:outline-none dark:bg-slate-900"
      />
      <footer className="flex items-center gap-2 border-t border-slate-200 px-4 py-3 dark:border-slate-800">
        <button
          type="button"
          onClick={onSend}
          disabled={sending}
          className="rounded bg-brand px-3 py-1.5 text-sm font-medium text-white hover:bg-brand-hover disabled:opacity-60"
        >
          {sending ? "Sending…" : "Send"}
        </button>
        <button
          type="button"
          onClick={onSaveClick}
          className="rounded border border-slate-200 px-3 py-1.5 text-sm hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          Save draft
        </button>
        <button
          type="button"
          onClick={onDiscard}
          className="ml-auto rounded border border-slate-200 px-3 py-1.5 text-sm text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          Discard
        </button>
      </footer>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex items-center gap-3 text-sm">
      <span className="w-16 shrink-0 text-slate-500 dark:text-slate-400">{label}</span>
      {children}
    </label>
  );
}
