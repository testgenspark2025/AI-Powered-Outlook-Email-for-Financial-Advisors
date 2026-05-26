import { listEmails, getEmail } from "@/lib/db/repos/emails";
import { listSegments } from "@/lib/db/repos/segments";
import { RibbonBar } from "@/components/outlook/RibbonBar";
import { LeftRail } from "@/components/outlook/LeftRail";
import { MessageList } from "@/components/outlook/MessageList";
import { ReadingPane } from "@/components/outlook/ReadingPane";

type SP = { id?: string | string[]; segmentId?: string | string[] };

function pickString(v: string | string[] | undefined): string | null {
  if (Array.isArray(v)) return v[0] ?? null;
  return v ?? null;
}

export default async function Home({ searchParams }: { searchParams: Promise<SP> }) {
  const sp = await searchParams;
  const segmentParam = pickString(sp.segmentId);
  const segmentId =
    segmentParam !== null && Number.isInteger(Number(segmentParam))
      ? Number(segmentParam)
      : undefined;

  const emails = listEmails({ folder: "inbox", segmentId });
  const segments = listSegments();

  const requestedId = pickString(sp.id);
  const selectedId = requestedId ?? emails[0]?.id ?? null;
  const selected = selectedId ? getEmail(selectedId) : null;

  return (
    <div className="flex h-screen flex-col bg-white text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <RibbonBar />
      <div className="flex flex-1 overflow-hidden">
        <LeftRail
          inboxCount={emails.length}
          segments={segments}
          activeSegmentId={segmentId ?? null}
        />
        <MessageList emails={emails} selectedId={selectedId} />
        <ReadingPane email={selected} />
      </div>
    </div>
  );
}
