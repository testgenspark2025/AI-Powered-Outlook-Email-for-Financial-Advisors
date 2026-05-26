export default function Home() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-12">
      <header>
        <h1 className="text-2xl font-semibold tracking-tight">Financial Advisor Outlook</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Sprint 0 skeleton. Inbox, compose, and AI workflows ship in later sprints.
        </p>
      </header>

      <section className="rounded-lg border border-slate-200 p-4 dark:border-slate-800">
        <h2 className="mb-2 text-lg font-semibold">Verified in this build</h2>
        <ul className="list-inside list-disc text-sm">
          <li>Shared-password gate (ADR-007)</li>
          <li>Drizzle schema for D1 (10 tables) per Phase 3 ERD</li>
          <li>LLM gateway with the mock provider</li>
          <li>SSE streaming demo at <code>POST /api/v1/ai/draft-reply</code></li>
          <li>Health endpoint at <code>GET /api/v1/health</code></li>
        </ul>
      </section>

      <footer className="text-xs text-slate-400">
        Built per the Phase 0-3 documents under <code>docs/sdlc/</code>.
      </footer>
    </main>
  );
}
