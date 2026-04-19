# Contributing Guidelines

## Purpose

This repository contains the release-manager GitHub App. These guidelines define how to propose changes so pull requests pass checks and can be merged reliably.

## Prerequisites

- Node.js 24 or later
- npm
- A GitHub issue describing the change

## Local Setup

1. Install dependencies.
2. Build the project.
3. Run tests.

Suggested commands:

```bash
npm ci
npm run build
npm run test
```

## Branch Naming

Use one of the approved prefixes:

- feature/
- bugfix/
- fix/
- docs/
- chore/
- refactor/

Examples:

- feature/release-window-validation
- fix/workflow-issue-link-check

## Pull Request Requirements

Before opening or updating a PR:

1. Keep the PR focused on one change.
2. Link the PR to an issue using a closing keyword in PR description, such as:
   - Closes #123
   - Fixes #456
   - Resolves #789
3. Ensure checks pass in CI.
4. If the PR author is not owner, request review from owner.

## Required Checks

The workflow currently runs these jobs:

- compile
- lint
- test
- security-scan

The target branch must also be up to date before merging.

## Auto-Merge Behavior

This repo uses a conditional auto-merge workflow.

Auto-merge is enabled when all of the following are true:

- Branch name matches the approved pattern.
- PR is linked to an issue.
- If PR author is @rajexcited, no explicit approval is required.
- If PR author is not @rajexcited, approval from @rajexcited is required.

The required approver can be configured using repository variable `REQUIRED_APPROVER`. If not set, it defaults to the repository owner.

After auto-merge is enabled, GitHub branch protection still blocks merge until all required checks are green and branch rules are satisfied.

## Code Owners

Code owners are defined in `.github/CODEOWNERS`:

- `* @rajexcited`

In repository branch rules for `main`, enable `Require review from Code Owners`.

## Commit and Change Quality

- Keep commits small and descriptive.
- Add or update tests when behavior changes.
- Update documentation when workflows, APIs, or expected behavior changes.
- Avoid unrelated refactors in feature PRs.

## Reviewer Readiness Checklist

Before requesting review, confirm:

- Build succeeds locally.
- Tests pass locally.
- PR description explains what changed and why.
- Linked issue is present with a closing keyword.
- Risks and rollback approach are documented for non-trivial changes.

## Security and Secrets

- Do not commit credentials, tokens, or private keys.
- Use environment variables for secrets.
- Treat workflow and permission changes as high-risk and highlight them in the PR description.
