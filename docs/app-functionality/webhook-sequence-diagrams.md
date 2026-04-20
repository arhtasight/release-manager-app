# Webhook Sequence Diagrams

## issues.opened Flow

```mermaid
sequenceDiagram
  participant GH as GitHub Webhooks
  participant APP as Probot App
  participant H as issues handler
  participant IS as issue service
  participant PS as project service
  participant GQL as GitHub GraphQL API
  participant REST as GitHub REST API

  GH->>APP: issues.opened payload
  APP->>H: handleIssueOpened(context)
  H->>IS: addComment("Thanks for opening this issue")
  IS->>REST: issues.createComment
  REST-->>IS: comment created
  H->>PS: addProjectItem(projectNumber, title, body)
  PS->>GQL: query organization.projectV2(number)
  GQL-->>PS: project id/url
  PS->>GQL: mutation addProjectV2DraftIssue
  GQL-->>PS: project item id
  PS-->>H: project/item URLs
  H->>IS: addComment(with project/item links)
  IS->>REST: issues.createComment
  REST-->>IS: comment created
  H-->>APP: success
```

## milestone.created Flow

```mermaid
sequenceDiagram
  participant GH as GitHub Webhooks
  participant APP as Probot App
  participant MH as milestone handler
  participant EL as eligibility checker
  participant CFG as config utils
  participant EV as evaluator utils
  participant TX as task executioner
  participant REST as GitHub REST API
  participant GQL as GitHub GraphQL API

  GH->>APP: milestone.created payload
  APP->>MH: handleMilestoneCreated(context)
  MH->>EL: getEligibleAutomation(trigger)
  EL->>CFG: getAutomationsForTrigger(milestone.created)
  CFG-->>EL: automation config
  EL->>EV: evaluateCondition(automation.when)
  EV-->>EL: true/false

  alt not eligible or no config
    EL-->>MH: NotEligibleAutomationError
    MH-->>APP: non-fatal return via wrapper
  else eligible
    EL-->>MH: eligible automation
    MH->>TX: executeTasksSequentially(tasks)

    loop each task in order
      alt action == milestone.initialize
        TX->>REST: issues.updateMilestone(description)
        REST-->>TX: updated
      else action == projectItem.create
        TX->>GQL: projectV2 lookup
        GQL-->>TX: project id/url
        TX->>GQL: addProjectV2DraftIssue
        GQL-->>TX: project item id
      end
    end

    TX-->>MH: all tasks complete
    MH-->>APP: success
  end
```

## Error Behavior

- NotEligibleAutomationError is handled as expected and non-fatal.
- Other errors are logged and rethrown by wrapper for visibility.

Relevant implementation:

- src/index.ts
- src/handlers/eligible.ts
- src/handlers/milestones.ts
