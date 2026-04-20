# ADR-0003: Use Config-Driven Automation for Milestone Workflows

## Status

Sample (update to Proposed/Accepted when finalized)

## Date

2026-04-10

## Context

Milestone automation is currently driven by repository configuration and task execution logic.
Implementation evidence:

- src/utils/config-utils.ts loads release-workflow.yml and caches it.
- src/handlers/eligible.ts selects and validates eligible automations.
- src/action-tasks/task-executioner.ts executes supported tasks sequentially.
- src/utils/evaluator-utils.ts evaluates condition expressions and template rendering.

The app needs flexible automation behavior without frequent code changes for policy updates.

## Decision

Adopt a config-driven automation model where trigger conditions and tasks are defined in release-workflow.yml and interpreted by runtime.

Key points:

- Keep supported action types explicitly enumerated in code.
- Evaluate eligibility before task execution.
- Execute tasks sequentially to preserve deterministic order.
- Keep strict validation for required task inputs.

## Consequences

### Positive

- Faster automation changes through config updates.
- Reduced code churn for common policy adjustments.
- Stronger separation between policy and execution engine.

### Negative

- Invalid config can break runtime paths if not validated early.
- Dynamic expressions can increase debugging complexity.

### Neutral

- Requires disciplined documentation of supported triggers/actions.

## Alternatives Considered

1. Hard-coded automation rules in handlers: rejected for poor maintainability and slower iteration.
2. Fully dynamic plugin system: rejected as over-engineered for current scope.

## Rollout Plan

1. Add schema validation checks for release-workflow.yml as needed.
2. Expand test coverage for condition and template evaluation edge cases.
3. Document supported triggers and actions under app functionality docs.

## Validation

- Success criteria:
  - Eligible automations run with expected task outputs.
  - Ineligible automations fail gracefully without causing noisy failures.
- Observability:
  - Logs include automation name, trigger, and task-level outcomes.

## References

- src/utils/config-utils.ts
- src/handlers/eligible.ts
- src/action-tasks/task-executioner.ts
- src/utils/evaluator-utils.ts
