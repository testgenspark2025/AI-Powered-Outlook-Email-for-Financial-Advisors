# C4 — Level 3: Components (inside the FAO Web App)

**Phase:** 3 — Design (Architecture)
**Status:** Approved
**Date:** 2026-05-24

Canonical diagram in Figma / draw.io: _TBD_.

Component view zooms into the REST API + LLM Gateway + Repository
containers.

## Draft Mermaid diagram

```mermaid
flowchart LR
    subgraph "app/api/v1/* (Route Handlers)"
        H_AUTH["/auth/login\n/auth/logout"]
        H_CLI["/clients\n/clients/:id"]
        H_EML["/emails\n/emails/:id"]
        H_DRF["/drafts\n/drafts/:id"]
        H_SNT["/sent\n/sent/:id"]
        H_FUP["/follow-ups\n/follow-ups/:id"]
        H_SET["/settings"]
        H_SCH["/search"]
        H_AI_R["/ai/draft-reply\n(SSE)"]
        H_AI_N["/ai/draft-new\n(SSE)"]
        H_AI_S["/ai/summarize"]
        H_AI_F["/ai/follow-ups"]
        H_HC["/health"]
    end

    subgraph "app/lib/ai (Gateway)"
        GW["Gateway dispatcher"]
        PB["Prompt builders\n(per depth)"]
        Prov["LlmProvider interface"]
        AzP["Azure provider"]
        Mk["Mock provider"]
        Log["AI call logger"]
    end

    subgraph "app/lib/db (Persistence)"
        Sch["Drizzle schema"]
        RClient["clients repo"]
        REmail["emails repo"]
        RDraft["drafts repo"]
        RSent["sent repo"]
        RFup["follow-ups repo"]
        RSet["settings repo"]
        RAi["ai_calls repo"]
        RSearch["search repo (FTS)"]
    end

    H_AUTH --> RSet
    H_CLI --> RClient
    H_EML --> REmail
    H_DRF --> RDraft
    H_SNT --> RSent
    H_FUP --> RFup
    H_SET --> RSet
    H_SCH --> RSearch
    H_AI_R --> GW
    H_AI_N --> GW
    H_AI_S --> GW
    H_AI_F --> GW

    GW --> PB
    GW --> Prov
    GW --> Log --> RAi
    Prov -. impl .-> AzP
    Prov -. impl .-> Mk

    RClient --> Sch
    REmail --> Sch
    RDraft --> Sch
    RSent --> Sch
    RFup --> Sch
    RSet --> Sch
    RAi --> Sch
    RSearch --> Sch
```

## Component responsibilities

### Route handlers (`app/api/v1/*/route.ts`)

Thin. Parse + validate input with Zod, call a repository or the LLM
gateway, return JSON or SSE. No business logic beyond input shape.

### LLM Gateway (`app/lib/ai/`)

| File | Role |
|---|---|
| `gateway.ts` | Dispatch entry points: `draftReply`, `draftNewEmail`, `summarizeEmail`, `suggestFollowUps`. |
| `prompts/reply.ts`, `prompts/new.ts`, `prompts/summarize.ts`, `prompts/follow-ups.ts` | Pure functions producing the structured message array per depth. |
| `providers/azure.ts` | Implements `LlmProvider` against Azure OpenAI; supports streaming. |
| `providers/mock.ts` | Deterministic mock that emits canned tokens; used in tests and dev without secrets. |
| `logger.ts` | Persists call metadata to `ai_calls` (model, depth, tokens, latency, outcome). |

### Repositories (`app/lib/db/repos/`)

| Repo | Tables | Key methods |
|---|---|---|
| `clients.ts` | `clients`, `households`, `household_members` | `getById`, `list`, `search`, `getWithHousehold` |
| `emails.ts` | `emails` | `list(folder)`, `getById`, `markRead` |
| `drafts.ts` | `drafts` | `list`, `getById`, `upsert` (autosave), `delete` |
| `sent.ts` | `sent_items` | `list`, `getById`, `create` (mock send) |
| `follow-ups.ts` | `follow_ups` | `list`, `create`, `update`, `complete` |
| `settings.ts` | `settings` | `get`, `upsert` |
| `ai-calls.ts` | `ai_calls` | `log` (append-only) |
| `search.ts` | virtual FTS table | `query(q)` returns mixed result types |

## Streaming flow detail

```mermaid
sequenceDiagram
    participant UI as UI (compose)
    participant API as /api/v1/ai/draft-reply
    participant GW as Gateway
    participant Az as Azure OpenAI
    participant DB as ai_calls repo

    UI->>API: POST { emailId, depth }
    API->>GW: draftReply(input)
    GW->>GW: build prompt by depth
    GW->>Az: chat.completions.create({ stream:true })
    Az-->>GW: token stream
    GW-->>API: AsyncIterable<string>
    API-->>UI: SSE: data: {token}
    GW->>DB: append ai_calls row (on finish or error)
```

## Module boundaries (enforced via lint)

- `app/components/**` may not import from `app/lib/db/**` directly; all
  data access goes through Server Components + handlers.
- `app/lib/ai/**` may not import from `app/lib/db/**` except the
  `ai-calls` repo.
- `app/lib/db/repos/**` may not import each other; cross-table queries
  belong to a `joins.ts` module.
