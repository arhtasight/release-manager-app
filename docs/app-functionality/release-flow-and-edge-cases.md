# Release Flow and Edge Cases

## Summary

This page describes functional flow and known edge cases for current automations.

## Flow: issues.opened

1. Receive issues.opened webhook.
2. Comment with acknowledgment.
3. Resolve project board number from config.
4. Build draft item body from issue details.
5. Create Project V2 draft item.
6. Comment with created item and project links.

## Flow: milestone.created

1. Receive milestone.created webhook.
2. Load configured automation for milestone.created.
3. Evaluate eligibility condition.
4. Validate task definitions.
5. Execute tasks sequentially:
   - milestone.initialize
   - projectItem.create

## Edge Cases

### No automation configured

- Behavior: treated as NotEligibleAutomationError.
- Effect: event is logged and ignored without failing the process.

### Automation not eligible

- Behavior: treated as NotEligibleAutomationError.
- Effect: event is logged and ignored without failing the process.

### Missing or invalid release-workflow.yml

- Behavior: throws runtime error.
- Effect: event processing fails and surfaces in logs.

### Invalid task action

- Behavior: assertion failure during task validation.
- Effect: handler fails and error is rethrown.

### Project board lookup failure

- Behavior: GraphQL project lookup fails.
- Effect: item creation fails and error is surfaced.

### Template or condition syntax error

- Behavior: evaluation/render throws explicit error.
- Effect: task execution fails.

## Operational Recommendations

- Keep automation conditions simple and testable.
- Roll out new task combinations with small pilot repositories first.
- Add tests whenever condition or templating complexity increases.
