# ADR-0001: Use Probot Webhook Event Model for Release Automation

## Status

Sample (update to Proposed/Accepted when finalized)

## Date

2026-04-10

## Context

The app currently processes GitHub webhook events using Probot handlers, including:

- issues.opened
- milestone.created

Implementation evidence:

- src/index.ts registers event listeners and wraps handlers with centralized error handling.
- src/handlers/issues.ts and src/handlers/milestones.ts execute automation logic via GitHub REST/GraphQL APIs.

The team needs an event-driven model that aligns with GitHub App permissions and webhook delivery behavior.

## Decision

Adopt Probot as the webhook runtime and keep event handling centered in app-level listeners with per-event handlers.

Key points:

- Use app.on(...) for explicit event subscriptions.
- Route business logic to dedicated handler modules by event type.
- Keep a common wrapper for logging and controlled rethrow behavior.
- Treat known non-eligible automation paths as non-fatal to avoid noisy failures.

## Consequences

### Positive

- Native alignment with GitHub App webhook delivery.
- Clear separation of event registration and business logic.
- Easier observability and error handling consistency.

### Negative

- Event growth can increase handler complexity unless modularized.
- Requires careful idempotency and retry-safe behavior.

### Neutral

- Coupled to GitHub webhook semantics, which is acceptable for this app's scope.

## Alternatives Considered

1. Polling GitHub APIs on schedule: rejected due to delay, higher API usage, and poorer event fidelity.
2. Custom webhook server without Probot: rejected due to increased maintenance and less framework support.

## Rollout Plan

1. Keep new automation triggers behind explicit event handlers.
2. Add or update tests for each new event handler path.
3. Document newly supported events in app functionality docs.

## Validation

- Success criteria:
  - Handlers execute reliably for supported events.
  - Known non-eligible automations do not fail workflow runs.
- Observability:
  - Structured logs per event type and payload IDs.

## References

- src/index.ts
- src/handlers/issues.ts
- src/handlers/milestones.ts
- app.yml
