# docs/planning/phase-1/issues/P1-03-add-issue-and-pr-templates.md
## [Governance] Add issue and PR templates

## Problem Statement

Issues and PRs require consistent structure to support review quality, traceability, and disciplined execution.

Without templates, issues drift into vague descriptions and PRs become harder to verify.

---

## Why This Matters Now

Templates are a governance tool and must exist before the first issue-driven PR cycle.

---

## Success Criteria

- [ ] Issue template exists and is selectable in GitHub UI
- [ ] Decision template exists and is selectable in GitHub UI
- [ ] Spike template exists and is selectable in GitHub UI
- [ ] Pull request template exists and auto-populates on new PRs
- [ ] PR template includes Layer Check section

---

## Scope & Constraints

In scope:
- Add templates under `.github/` (or GitHub-supported directory structure)

Out of scope:
- Creating issues (handled separately)
- CI automation

---

## Verification Notes

- GitHub UI shows the templates when creating a new issue.
- Opening a new PR auto-populates the PR template content.
