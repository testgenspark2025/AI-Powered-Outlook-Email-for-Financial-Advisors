import type { EmailDetail } from "@/lib/db/repos/emails";
import type { Draft } from "@/lib/db/repos/drafts";
import { ClientInsightsCard } from "@/components/outlook/ClientInsightsCard";
import { getClientWithHousehold } from "@/lib/db/repos/clients";

type Props = { kind: "email"; email: EmailDetail | null } | { kind: "sent"; draft: Draft | null } | { kind: "empty" };

export function ReadingPane(props: Props) {
  if (props.kind === "empty" || (props.kind === "email" && !props.email) || (props.kind === "sent" && !props.draft)) {
    return (
      <div className="flex flex-1 items-center justify-center bg-slate-50 text-slate-500 dark:bg-slate-950 dark:text-slate-400">
        <div className="text-center">
          <div className="text-lg font-medium">No item selected</div>
          <div className="text-sm">Select a message to read</div>
        </div>
      </div>
    );
  }

  if (props.kind === "email" && props.email) {
    const email = props.email;
    return (
      <div className="flex flex-1 overflow-hidden">
        <article className="flex-1 overflow-y-auto bg-white p-6 dark:bg-slate-900">
          <header className="mb-4 border-b border-slate-200 pb-3 dark:border-slate-800">
            <h1 className="text-xl font-semibold">{email.subject}</h1>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              From <span className="font-medium">{email.fromEmail}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              {new Date(email.receivedAt).toLocaleString()}
            </div>
          </header>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {email.body}
          </pre>
        </article>
        {email.client ? (
          <div className="hidden w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 xl:block">
            <ClientInsightsCard client={email.client} />
          </div>
        ) : null}
      </div>
    );
  }

  if (props.kind === "sent" && props.draft) {
    const draft = props.draft;
    const cwh = draft.clientId ? getClientWithHousehold(draft.clientId) : null;
    return (
      <div className="flex flex-1 overflow-hidden">
        <article className="flex-1 overflow-y-auto bg-white p-6 dark:bg-slate-900">
          <header className="mb-4 border-b border-slate-200 pb-3 dark:border-slate-800">
            <h1 className="text-xl font-semibold">{draft.subject || "(no subject)"}</h1>
            <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              To <span className="font-medium">{draft.toAddress || "—"}</span>
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400">
              Sent {draft.sentAt ? new Date(draft.sentAt).toLocaleString() : "—"}
            </div>
          </header>
          <pre className="whitespace-pre-wrap font-sans text-sm leading-relaxed text-slate-800 dark:text-slate-200">
            {draft.body}
          </pre>
        </article>
        {cwh ? (
          <div className="hidden w-80 shrink-0 overflow-y-auto border-l border-slate-200 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950 xl:block">
            <ClientInsightsCard client={cwh} />
          </div>
        ) : null}
      </div>
    );
  }

  return null;
}
