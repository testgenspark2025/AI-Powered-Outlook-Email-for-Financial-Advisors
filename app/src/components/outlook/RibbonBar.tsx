import Link from "next/link";
import { ThemeToggle } from "@/components/outlook/ThemeToggle";

type Props = {
  selectedEmailId?: string | null;
};

export function RibbonBar({ selectedEmailId = null }: Props) {
  return (
    <header className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
      <div className="flex items-center justify-between bg-brand px-3 py-1 text-xs text-white">
        <span>Financial Advisor Outlook</span>
        <span className="text-white/70">Sprint 2 prototype</span>
      </div>
      <nav className="flex items-center gap-6 border-b border-slate-200 px-3 py-1 text-sm text-slate-600 dark:border-slate-800 dark:text-slate-300">
        <span className="border-b-2 border-brand py-1 font-medium text-brand">Home</span>
        <span className="py-1">Send / Receive</span>
        <span className="py-1">Folder</span>
        <span className="py-1">View</span>
      </nav>
      <div className="flex items-center gap-4 px-3 py-2">
        <Link
          href="/compose"
          className="rounded bg-accent px-3 py-1.5 text-sm font-medium text-white hover:opacity-90"
        >
          + New Email
        </Link>
        <div className="h-8 w-px bg-slate-200 dark:bg-slate-700" />
        <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          {selectedEmailId ? (
            <Link
              href={`/compose?replyTo=${selectedEmailId}`}
              className="rounded px-2 py-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Reply
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="rounded px-2 py-1 text-slate-400 dark:text-slate-500"
            >
              Reply
            </button>
          )}
          <button type="button" disabled className="rounded px-2 py-1 text-slate-400 dark:text-slate-500">
            Reply All
          </button>
          <button type="button" disabled className="rounded px-2 py-1 text-slate-400 dark:text-slate-500">
            Forward
          </button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
