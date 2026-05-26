import { listEmails, getEmail, type Email } from "@/lib/db/repos/emails";
import { listSegments } from "@/lib/db/repos/segments";
import { getDraft, listDrafts, listSent, type Draft } from "@/lib/db/repos/drafts";
import { RibbonBar } from "@/components/outlook/RibbonBar";
import { LeftRail, type FolderKey } from "@/components/outlook/LeftRail";
import { MessageList, type MailRow } from "@/components/outlook/MessageList";
import { DraftList } from "@/components/outlook/DraftList";
import { ReadingPane } from "@/components/outlook/ReadingPane";

type SP = {
  id?: string | string[];
  folder?: string | string[];
  segmentId?: string | string[];
};

function pickString(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

function parseFolder(value: string | null): FolderKey {
  switch (value) {
    case "drafts":
    case "sent":
    case "junk":
    case "archive":
    case "deleted":
      return value;
    default:
      return "inbox";
  }
}

function emailToRow(e: Email): MailRow {
  return {
    id: e.id,
    sender: e.client?.fullName ?? e.fromEmail,
    subject: e.subject,
    preview: e.preview,
    receivedAt: e.receivedAt,
    isRead: e.isRead,
    isImportant: e.isImportant,
    segmentName: e.client?.segment.name ?? null,
  };
}

function sentToRow(d: Draft): MailRow {
  return {
    id: d.id,
    sender: `To: ${d.toAddress || "—"}`,
    subject: d.subject,
    preview: d.body.slice(0, 120),
    receivedAt: d.sentAt ?? d.updatedAt,
    isRead: true,
    isImportant: false,
    segmentName: d.client?.segment.name ?? null,
  };
}

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const folder = parseFolder(pickString(sp.folder));

  const segmentParam = pickString(sp.segmentId);
  const segmentId =
    segmentParam !== null && Number.isInteger(Number(segmentParam))
      ? Number(segmentParam)
      : undefined;

  const segments = listSegments();
  const inboxEmails = listEmails({ folder: "inbox", segmentId });
  const drafts = listDrafts();
  const sent = listSent().filter((d) => (segmentId ? d.client?.segmentId === segmentId : true));
  const requestedId = pickString(sp.id);

  let rows: MailRow[] = [];
  let title = "Inbox";
  let selectedId: string | null = null;
  let pane: React.ReactNode = null;

  if (folder === "inbox") {
    rows = inboxEmails.map(emailToRow);
    title = "Inbox";
    selectedId = requestedId ?? rows[0]?.id ?? null;
    const email = selectedId ? getEmail(selectedId) : null;
    pane = <ReadingPane kind="email" email={email} />;
  } else if (folder === "sent") {
    rows = sent.map(sentToRow);
    title = "Sent Items";
    selectedId = requestedId ?? rows[0]?.id ?? null;
    const draft = selectedId ? getDraft(selectedId) : null;
    pane = <ReadingPane kind="sent" draft={draft} />;
  } else if (folder === "drafts") {
    pane = <ReadingPane kind="empty" />;
  } else {
    rows = [];
    title = folder.charAt(0).toUpperCase() + folder.slice(1);
    pane = <ReadingPane kind="empty" />;
  }

  return (
    <div className="flex h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <RibbonBar selectedEmailId={folder === "inbox" ? selectedId : null} />
      <div className="flex flex-1 overflow-hidden">
        <LeftRail
          inboxCount={inboxEmails.length}
          draftsCount={drafts.length}
          sentCount={sent.length}
          segments={segments}
          activeFolder={folder}
          activeSegmentId={segmentId ?? null}
        />
        {folder === "drafts" ? (
          <DraftList drafts={drafts} />
        ) : (
          <MessageList
            rows={rows}
            selectedId={selectedId}
            title={title}
            emptyHint={
              folder === "sent"
                ? "Nothing sent yet — try composing a new message."
                : "No messages match this filter."
            }
          />
        )}
        {pane}
      </div>
    </div>
  );
}
