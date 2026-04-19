# Reviewing Guidelines

## Purpose

Use this guide to perform consistent, high-signal code reviews for this repository.

## Reviewer Priorities

Review in this order:

1. Correctness and regressions
2. Security and permissions
3. Test coverage and reliability
4. Maintainability and clarity
5. Style and minor polish

## Review Checklist

For each PR, verify:

1. Problem and scope are clear.
2. PR is linked to an issue with a closing keyword.
3. Branch naming follows approved prefixes.
4. Logic changes include appropriate tests.
5. Error handling and edge cases are covered.
6. No secrets or unsafe workflow changes are introduced.
7. Required CI checks pass according to current branch protection settings:
   - compile
   - lint
   - test
   - security-scan
8. PR branch is up to date with main when required.
9. For PRs authored by someone other than @rajexcited, ensure @rajexcited approval is present before merge.

## Workflow and Ruleset Context

Branch rules protect main by requiring status checks and up-to-date branches.

Auto-merge is enabled conditionally by workflow when branch naming and issue-linking criteria are met, and owner approval criteria are satisfied:

- PR authored by @rajexcited: owner approval check is auto-satisfied.
- PR authored by others: approval from @rajexcited is required.

Even after auto-merge is enabled, merge does not occur until required checks pass.

## Approval Guidance

Approve when:

- Risk is acceptable for current release goals.
- Required checks are passing or expected to pass with no open blockers.
- Code is understandable and maintainable by the team.

Request changes when:

- Behavior is incorrect or risky.
- Tests are missing for key paths.
- Security, permissions, or data handling concerns exist.
- Scope is unclear or too broad for a safe review.

## Code Owner Enforcement

Code owner mapping is defined in `.github/CODEOWNERS`.

- `* @rajexcited`

Enable `Require review from Code Owners` on the `main` branch ruleset to enforce owner review policy in GitHub UI.

## Review Comment Style

- Be specific and action-oriented.
- Separate blocking issues from optional improvements.
- Include expected behavior when requesting changes.
- Prefer small, concrete suggestions over broad statements.

## Suggested Review Decision Template

### Approve

- Summary: change is correct and low risk.
- Notes: optional follow-up improvements.

### Request Changes

- Blocking items:
  1. <issue>
  2. <issue>
- Optional improvements:
  1. <suggestion>

## Fast Path for Low-Risk Changes

For docs-only or trivial internal refactors:

- Confirm no behavior change.
- Confirm checks pass.
- Approve promptly to keep flow moving.
