import { redirect } from "next/navigation";
import { createDraft, getDraft } from "@/lib/db/repos/drafts";
import { getEmail } from "@/lib/db/repos/emails";
import { RibbonBar } from "@/components/outlook/RibbonBar";
import { ComposeForm } from "@/components/outlook/ComposeForm";

type SP = { draftId?: string | string[]; replyTo?: string | string[] };

function first(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export default async function ComposePage({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const draftId = first(sp.draftId);
  const replyTo = first(sp.replyTo);

  if (!draftId) {
    if (replyTo) {
      const source = getEmail(replyTo);
      if (!source) redirect("/");
      const created = createDraft({
        clientId: source.client?.id ?? null,
        inReplyToEmailId: source.id,
        toAddress: source.client?.email ?? source.fromEmail,
        subject: source.subject.startsWith("RE:") ? source.subject : `RE: ${source.subject}`,
        body: `\n\n\n---\nOn ${new Date(source.receivedAt).toLocaleString()}, ${source.fromEmail} wrote:\n\n${source.body}`,
      });
      redirect(`/compose?draftId=${created.id}`);
    }
    const fresh = createDraft({});
    redirect(`/compose?draftId=${fresh.id}`);
  }

  const draft = getDraft(draftId);
  if (!draft) redirect("/");

  return (
    <div className="flex h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <RibbonBar />
      <div className="flex flex-1 overflow-hidden">
        <ComposeForm draft={draft} />
      </div>
    </div>
  );
}
