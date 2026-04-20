# Architecture Decision Records (ADRs)

Store significant technical decisions as ADRs in this folder.

## What Belongs in an ADR

- Long-lived architectural decisions
- Runtime or deployment model decisions
- Security and permission boundary decisions
- Integration contract decisions (GitHub APIs, webhook processing model)
- Major process decisions that affect system behavior

Do not use ADRs for temporary notes, sprint tasks, or minor refactors.

## When to Write an ADR

Write an ADR when future contributors are likely to ask "why was this done this way?" in 3-6 months.

## Naming Convention

Use sequential file names:

- 0001-short-title.md
- 0002-short-title.md

## Starter Files in This Repo

- [Generic ADR template](0000-adr-template.md)
- [Sample: Probot webhook event model](0001-probot-webhook-event-model.md)
- [Sample: Render deployment runtime](0002-render-deployment-runtime.md)
- [Sample: Config-driven automation tasks](0003-config-driven-automation-tasks.md)

## ADR Template

1. Title
2. Status (Proposed, Accepted, Superseded)
3. Context
4. Decision
5. Consequences
6. Alternatives Considered
