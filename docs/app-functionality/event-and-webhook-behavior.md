# Event and Webhook Behavior

## Summary

The app is event-driven and uses Probot webhook listeners to trigger release automation logic.

## Supported Events

Implemented listeners:

- issues.opened
- milestone.created

Event registration is done in src/index.ts.

## Processing Model

1. GitHub delivers webhook payload to the app.
2. Probot routes the event to the corresponding handler.
3. The event wrapper provides common logging and error behavior.
4. Handler-specific logic calls REST and GraphQL services.

## Handler Responsibilities

### issues.opened

- Logs basic issue details.
- Posts acknowledgment comment on the issue.
- Creates a draft project item in Project V2.
- Posts follow-up comment with project and item links.

Relevant files:

- src/handlers/issues.ts
- src/services/issue-services.ts
- src/services/project-services.ts

### milestone.created

- Logs milestone metadata.
- Loads and checks eligible automation from config.
- Validates task inputs and supported actions.
- Executes tasks sequentially.

Relevant files:

- src/handlers/milestones.ts
- src/handlers/eligible.ts
- src/action-tasks/task-executioner.ts

## Error Handling

- NotEligibleAutomationError is treated as expected and non-fatal.
- Unexpected errors are rethrown after logging, so failures are visible.

Relevant file:

- src/index.ts

## Notes for Operations

- Webhook redeliveries may occur; handlers should remain as idempotent as practical.
- Logs should be used as the primary source for webhook diagnosis.

## Sequence View

- [Webhook Sequence Diagrams](webhook-sequence-diagrams.md)
