# ADR-005: Azure OpenAI via an Internal LLM Gateway

- **Status:** Accepted
- **Date:** 2026-05-24
- **Deciders:** Engineering lead, product lead
- **Phase:** 2 — Analysis & Planning

## Context

Phase 0 D-003 chose Azure OpenAI as the LLM provider. The application
calls the model from at least three places: reply drafting, new outbound
drafting, summarization. Calling the provider SDK directly from every
call site invites inconsistency in logging, prompt construction, and
error handling. A thin gateway also makes it easy to swap providers later.

## Decision

We will route all LLM calls through an internal module at
`app/lib/ai/gateway.ts` that exposes typed functions:

- `draftReply(input): AsyncIterable<string>`
- `draftNewEmail(input): AsyncIterable<string>`
- `summarizeEmail(input): Promise<string>`
- `suggestFollowUps(input): Promise<FollowUpSuggestion[]>`

The gateway:

- Constructs prompts from typed inputs (no string concatenation at the
  call site).
- Streams responses where the UI uses them.
- Logs model, depth, prompt token count, completion token count, latency,
  and outcome to the `ai_calls` D1 table.
- Implements retries with jittered backoff on 429 and 5xx.
- Reads provider config from `env.AZURE_OPENAI_*` secrets.

The provider implementation lives in `app/lib/ai/providers/azure.ts` and
implements a small `LlmProvider` interface. A `mock.ts` provider is used
in tests and in local dev when secrets are missing.

## Alternatives Considered

| Option | Pros | Cons | Why not chosen |
|---|---|---|---|
| Call Azure SDK directly from each Route Handler | Simplest | Duplicate logging, prompts, retries; harder to swap providers | Rejected |
| Vercel AI SDK | Great streaming primitives; pluggable providers | Couples us to its abstractions; some Cloudflare edge friction | Will likely use **inside** the gateway for streaming helpers; not the gateway itself |
| LangChain | Rich ecosystem | Heavy bundle; over-abstraction for our 4 entry points | Rejected |
| LiteLLM proxy as a sidecar | Provider portability for free | Extra deployable; latency cost | Rejected |

## Consequences

- **Positive:** one place to instrument cost, latency, and prompt
  evolution.
- **Positive:** swapping to OpenAI direct or Bedrock Claude is a one-file
  change later.
- **Negative:** thin layer to maintain; risk of becoming a leaky
  abstraction.
- **Risk:** Azure OpenAI quota delays before Sprint 5. Mitigation: the
  mock provider supports the full happy-path streaming contract.

## References

- Phase 0 D-003
- Phase 1 PRD section 9 (personalization depth)
