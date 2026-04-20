# release-workflow.yml Configuration Examples

## Purpose

This page provides practical configuration examples for the app's config-driven milestone automation.

## Notes Before Using

- The file name must be release-workflow.yml in the repository config path.
- Supported trigger today: milestone.created.
- Supported actions today: projectItem.create and milestone.initialize.
- Current implementation selects the first enabled automation matching the trigger.

Relevant implementation:

- src/utils/config-utils.ts

## File-Based Examples

Use these checked-in files as copy-ready templates:

- [Examples Index](config-examples/README.md)
- [Basic milestone initialization](config-examples/release-workflow.basic-init.yml)
- [Milestone initialization + project item](config-examples/release-workflow.init-plus-project-item.yml)
- [Conditional by milestone title](config-examples/release-workflow.conditional-release-title.yml)
- [Staged rollout with disabled task](config-examples/release-workflow.staged-rollout-disabled-task.yml)
- [Multiple automations and first-enabled behavior](config-examples/release-workflow.multi-automation-first-enabled.yml)
- [Invalid unsupported action (troubleshooting)](config-examples/release-workflow.invalid-unsupported-action.yml)

## Example 1: Basic Milestone Initialization

```yaml
configVersion: 1
projectBoard:
  id: 7
automations:
  - name: milestone-basic-init
    enabled: true
    on: milestone.created
    when: ${{ milestone.title != "" }}
    tasks:
      - enabled: true
        action: milestone.initialize
        description: |
          ## Milestone Summary

          Milestone: ${{milestone.title}}
          Number: ${{milestone.number}}
          Link: ${{milestone.html_url}}
```

What it does:

- On milestone creation, updates milestone description using template values from webhook payload.

## Example 2: Milestone Initialization Plus Project Draft Item

```yaml
configVersion: 1
projectBoard:
  id: 7
automations:
  - name: milestone-plan-item
    enabled: true
    on: milestone.created
    when: ${{ milestone.title != "" && milestone.number > 0 }}
    tasks:
      - enabled: true
        action: milestone.initialize
        description: |
          Release planning started for milestone: ${{milestone.title}}
          Milestone URL: ${{milestone.html_url}}

      - enabled: true
        action: projectItem.create
        title: "Release plan - ${{milestone.title}}"
        description: |
          Draft planning card created for milestone ${{milestone.title}}.
          Milestone URL: ${{milestone.html_url}}
```

What it does:

- Initializes milestone description.
- Creates a Project V2 draft issue item linked by context for planning visibility.

## Example 3: Feature-Flag a Task While Keeping Automation Enabled

```yaml
configVersion: 1
projectBoard:
  id: 7
automations:
  - name: milestone-staged-rollout
    enabled: true
    on: milestone.created
    when: ${{ milestone.number > 0 }}
    tasks:
      - enabled: true
        action: milestone.initialize
        description: "Milestone initialized for ${{milestone.title}}"

      - enabled: false
        action: projectItem.create
        title: "Disabled for now"
        description: "This task is intentionally disabled"
```

What it does:

- Disabled tasks are filtered out before execution.

## Common Validation Errors

- Missing file release-workflow.yml.
- projectBoard.id missing or not a positive number.
- Unsupported action type.
- Required fields missing:
  - projectItem.create requires title and description.
  - milestone.initialize requires description.
- Invalid condition or template syntax.

## Expression Syntax Rules

- Conditions use Jexl and should use dollar-curly form:
  - ${{ milestone.number > 0 }}
- Templates use Handlebars, but raw {{ ... }} is rejected.
  - Use: ${{milestone.title}}
  - Do not use: {{milestone.title}}

Relevant implementation:

- src/utils/evaluator-utils.ts
- src/action-tasks/context-resolvers.ts
- src/action-tasks/task-executioner.ts
