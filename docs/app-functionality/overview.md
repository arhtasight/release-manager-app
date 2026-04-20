# App Functionality Overview

This document is a draft functional overview of the release-manager GitHub App, based on current implementation and ADR decisions.

## What the App Does

The app automates release-management tasks in GitHub repositories using webhook-driven behavior.

Current implemented event handlers:

- issues.opened
- milestone.created

## Functional Capabilities

### 1. Issue Opened Automation

When a new issue is opened:

- The app posts an acknowledgment comment.
- The app reads project board configuration from release-workflow.yml.
- The app creates a draft issue item in GitHub Project V2 with a backlink to the source issue.
- The app comments again with links to the created project item and project board.

Primary code paths:

- src/handlers/issues.ts
- src/services/issue-services.ts
- src/services/project-services.ts

### 2. Milestone Created Automation

When a milestone is created:

- The app loads automation configuration for milestone.created.
- It evaluates whether the automation is eligible using a condition expression.
- It validates each configured task.
- It executes eligible tasks sequentially.

Supported task actions today:

- projectItem.create
- milestone.initialize

Primary code paths:

- src/handlers/milestones.ts
- src/handlers/eligible.ts
- src/action-tasks/task-executioner.ts
- src/action-tasks/context-resolvers.ts

## Runtime and Error Behavior

- Event routing is implemented with Probot app.on listeners.
- A shared event wrapper logs errors and payload context.
- NotEligibleAutomationError is treated as non-fatal and is not rethrown.
- Unexpected errors are rethrown so failures are visible and actionable.

Primary code path:

- src/index.ts

## Configuration-Driven Design

Automation behavior is primarily controlled via release-workflow.yml:

- projectBoard.id determines target project board.
- automations define trigger, eligibility condition, and task list.
- Disabled tasks are filtered out before execution.
- Config is cached in-memory with an LRU cache per owner-repo key.

Primary code path:

- src/utils/config-utils.ts

## Related ADRs

- docs/adr/0001-probot-webhook-event-model.md
- docs/adr/0002-render-deployment-runtime.md
- docs/adr/0003-config-driven-automation-tasks.md

## Detailed Pages

- [Event and Webhook Behavior](event-and-webhook-behavior.md)
- [Webhook Sequence Diagrams](webhook-sequence-diagrams.md)
- [Configuration and Automation Schema](configuration-and-automation.md)
- [release-workflow.yml Configuration Examples](release-workflow-config-examples.md)
- [Release Flow and Edge Cases](release-flow-and-edge-cases.md)
- [GitHub API Interaction Notes](github-api-interactions.md)
