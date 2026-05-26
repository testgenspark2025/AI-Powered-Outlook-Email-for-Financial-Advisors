# On-call Handoff Checklist

The outgoing on-call hands this to the incoming on-call every Monday
at 09:00 local. About 10 minutes async, 5 minutes sync if anything is
worth talking through.

## Outgoing on-call fills this in

### Week of YYYY-MM-DD to YYYY-MM-DD

#### Health snapshot

- [ ] SLO burn this week (any > 20% of monthly budget?)
- [ ] Production uptime over the rolling 7 days
- [ ] Backup count over the rolling 7 days (expected: 7 daily)
- [ ] Cost MTD vs cap

Brief: _one paragraph, what the week felt like._

#### Alerts

| Date / time | Alert | Severity | Outcome |
|---|---|---|---|
| | | | |

#### Open incidents

| Id | Severity | Status | Next action | Owner |
|---|---|---|---|---|
| | | | | |

#### In-flight work that touches production

| Item | Risk | Watch for |
|---|---|---|
| | | |

#### Anything else

- _One paragraph on anything that surprised you, even if it was good._

#### Outgoing signature

> I confirm the production environment is in a state where it can be
> handed over. Open incidents are tracked. Cost is within envelope.

| Outgoing | | |
|---|---|---|
| Name | Date | |

## Incoming on-call confirms

- [ ] I have read the snapshot above.
- [ ] I have access to the dashboards listed in `observability.md`.
- [ ] My phone is set up to receive pages.
- [ ] I know where the deploy + rollback runbooks live (Phase 6).
- [ ] I have a copy of `incident-response.md` open in a tab.

| Incoming | | |
|---|---|---|
| Name | Date | |

## Notes

- This checklist is filed under
  `docs/sdlc/phase-7-operations/handoffs/YYYY-MM-DD.md` once both
  signatures are in.
- When the same person holds on-call for the whole month (today's
  reality), they still fill this in every Monday — for themselves.
  The act of writing it down catches drift.
