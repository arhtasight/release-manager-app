# GitHub API Interaction Notes

## Summary

The app uses both GitHub REST and GraphQL APIs through Probot octokit client.

## REST API Usage

### Issue comments

- Endpoint class: octokit.rest.issues.createComment
- Used to acknowledge issue creation and post project item links.
- Source: src/services/issue-services.ts

### Milestone updates

- Endpoint class: octokit.rest.issues.updateMilestone
- Used by milestone.initialize task to set milestone description.
- Source: src/services/issue-services.ts

## GraphQL API Usage

### Project V2 lookup by number

- Query: organization.projectV2(number: ...)
- Purpose: resolve project ID and URL for mutations.
- Source: src/services/project-services.ts

### Project V2 draft item creation

- Mutation: addProjectV2DraftIssue
- Purpose: create project draft issue item and build deep link.
- Source: src/services/project-services.ts

## Permissions Context

Declared in app.yml:

- issues: write
- pull_requests: write
- repository_projects: write
- contents: write
- metadata: read
- repository_hooks: read
- deployments: read

These permissions should remain minimal and aligned with implemented capabilities.

## Reliability Notes

- All API calls are made during webhook handling; failures bubble to wrapper behavior.
- Logging includes response details for operational diagnosis.
- Consider adding explicit retry/backoff policy if API throttling becomes a recurring issue.
