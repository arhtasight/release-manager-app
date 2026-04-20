# Documentation Hub

This folder contains repository-scoped documentation for the release-manager app.

## Sections

- [App Functionality](app-functionality/overview.md): features, configuration behavior, and API/event flow details.
- [Architecture](architecture/system-design.md): system design, module boundaries, and integration points.
- [Runbooks](runbooks/operations-runbooks.md): operational procedures and troubleshooting.
- [Dev Team](dev-team/repository-process.md): team process that is specific to this repository.
- [ADRs](adr/adr-guide.md): architecture decision records.

## Ownership

- App functionality and architecture docs should be updated in the same PR as related code changes.
- Team-wide process standards that apply across repositories should live in your central team docs site/repo; this folder should link to them instead of duplicating them.

## App Functionality Pages

- [Overview](app-functionality/overview.md)
- [Event and Webhook Behavior](app-functionality/event-and-webhook-behavior.md)
- [Webhook Sequence Diagrams](app-functionality/webhook-sequence-diagrams.md)
- [Configuration and Automation Schema](app-functionality/configuration-and-automation.md)
- [release-workflow.yml Configuration Examples](app-functionality/release-workflow-config-examples.md)
- [Config Example Files](app-functionality/config-examples/README.md)
- [Release Flow and Edge Cases](app-functionality/release-flow-and-edge-cases.md)
- [GitHub API Interaction Notes](app-functionality/github-api-interactions.md)
