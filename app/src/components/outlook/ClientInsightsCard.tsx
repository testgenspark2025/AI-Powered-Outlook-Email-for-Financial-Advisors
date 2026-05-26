import type { ClientWithHousehold } from "@/lib/db/repos/clients";

export function ClientInsightsCard({ client }: { client: ClientWithHousehold }) {
  return (
    <aside className="space-y-3 text-sm">
      <section className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <h3 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
          Client
        </h3>
        <div className="text-base font-semibold">{client.fullName}</div>
        <div className="text-slate-600 dark:text-slate-300">
          {client.occupation} · {client.company}
        </div>
        <dl className="mt-2 grid grid-cols-2 gap-2 text-xs">
          <DT label="Segment" value={client.segment.name} />
          <DT label="Risk profile" value={client.riskProfile ?? "—"} />
          <DT label="Client since" value={client.clientSince ?? "—"} />
          <DT label="Age" value={String(client.age)} />
        </dl>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-2 flex items-center justify-between">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
            Household
          </h3>
          <span className="text-xs text-slate-500 dark:text-slate-400">
            {client.household.totalMembers} member{client.household.totalMembers === 1 ? "" : "s"} · {client.household.householdAssetsLabel}
          </span>
        </div>
        <ul className="space-y-2">
          {client.household.members.map((m) => (
            <li
              key={m.id}
              className="rounded-md border border-slate-100 px-2 py-2 dark:border-slate-800"
            >
              <div className="flex items-baseline justify-between gap-2">
                <span className="font-medium">{m.fullName}</span>
                <span className="text-xs text-slate-500 dark:text-slate-400">{m.assetsLabel}</span>
              </div>
              <div className="text-xs text-slate-500 dark:text-slate-400">
                {m.relation} · {m.role} · {m.occupation}
              </div>
            </li>
          ))}
        </ul>
      </section>
    </aside>
  );
}

function DT({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-slate-500 dark:text-slate-400">{label}</dt>
      <dd className="font-medium">{value}</dd>
    </>
  );
}
