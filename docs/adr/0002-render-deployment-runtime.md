# ADR-0002: Deploy Probot App to Render Using Containerized Node Runtime

## Status

Sample (update to Proposed/Accepted when finalized)

## Date

2026-04-10

## Context

The app is deployed on Render and runs as a Probot-based Node service.
Current build/runtime setup includes:

- Multi-stage Docker build on node:24-slim
- TypeScript compile step generating build artifacts
- Runtime command npm start executing probot run ./build/index.js
- Network settings exposing port 3000 with host 0.0.0.0

Deployment platform constraints:

- External webhook traffic must reach a stable HTTPS endpoint.
- Environment variables and app credentials must be managed as secrets.

## Decision

Use a containerized deployment model on Render with a separate build stage and minimal runtime image.

Key points:

- Build TypeScript in builder stage.
- Run production dependencies only in runtime stage.
- Start Probot process from compiled output.
- Keep GitHub App secrets configured in Render environment variables, not in source control.

## Consequences

### Positive

- Reproducible deployments across environments.
- Smaller runtime image than single-stage builds.
- Clear boundary between build-time and runtime dependencies.

### Negative

- Requires container build pipeline support and maintenance.
- Cold starts/restarts rely on container startup time.

### Neutral

- Runtime remains state-light; any persistent state should be externalized.

## Alternatives Considered

1. Non-container deployment with direct npm start: rejected for weaker parity and less reproducible runtime setup.
2. Serverless deployment model: deferred due to webhook lifecycle and runtime assumptions in current app design.

## Rollout Plan

1. Maintain Dockerfile parity with package scripts and Node version.
2. Ensure Render service health checks and webhook URL configuration are validated.
3. Document required env vars and secret rotation steps in runbooks.

## Validation

- Success criteria:
  - Render service starts and serves webhook endpoint consistently.
  - GitHub webhook deliveries show successful processing in logs.
- Observability:
  - Render logs for startup and webhook handling.
  - GitHub App delivery logs for retries and failures.

## References

- Dockerfile
- package.json
- src/index.ts
