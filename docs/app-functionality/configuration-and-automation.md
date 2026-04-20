# Configuration and Automation Schema

## Summary

Automation behavior is configured through repository config file release-workflow.yml.

## Effective Configuration Shape

Based on src/utils/config-utils.ts:

```yaml
configVersion: 1
projectBoard:
  id: 123
automations:
  - name: milestone-init
    enabled: true
    on: milestone.created
    when: ${{ milestone.title != "" }}
    tasks:
      - enabled: true
        action: milestone.initialize
        description: "Milestone initialized for ${{milestone.title}}"
      - enabled: true
        action: projectItem.create
        title: "Release planning: ${{milestone.title}}"
        description: "Milestone URL: ${{milestone.html_url}}"
```

## Supported Trigger and Actions

Supported trigger:

- milestone.created

Supported task actions:

- projectItem.create
- milestone.initialize

Unsupported actions are rejected by validation logic in src/handlers/milestones.ts.

## Conditions and Templates

Condition evaluation:

- Uses Jexl expressions.
- Accepts dollar-curly format, for example: ${{ milestone.number > 0 }}.

Template rendering:

- Uses Handlebars syntax but requires dollar-curly wrappers.
- Valid: ${{milestone.title}}
- Invalid: {{milestone.title}}

Relevant file:

- src/utils/evaluator-utils.ts

## Resolver Context Available to Conditions/Templates

Current top-level resolver objects:

- milestone
- project (after project tasks run)
- projectItem (after project item creation)

Relevant file:

- src/action-tasks/context-resolvers.ts

## Caching and Load Behavior

- release-workflow.yml is loaded via context.config.
- Config is cached in an LRU cache keyed by owner and repo.

Relevant file:

- src/utils/config-utils.ts

## Validation Notes

- projectBoard.id must be a positive number.
- milestone.initialize requires description.
- projectItem.create requires title and description.

## Practical Examples

- [release-workflow.yml Configuration Examples](release-workflow-config-examples.md)
- [Config Example Files](config-examples/README.md)
