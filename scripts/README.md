# Scripts

This directory contains operational tooling used to manage and maintain the repository.

Scripts are part of the governance layer of the project and are committed from the first repository initialization.

---

## create_issues.sh

Creates GitHub issues from one Markdown file per issue.

### Purpose

Automates issue creation to ensure:

- Consistent formatting
- Correct milestone assignment
- Correct label inference (`type:*`, `area:*`)
- Repeatable governance workflow

### Usage

Dry run (recommended first):

```
DRY_RUN=1 scripts/create_issues.sh \
  --milestone "Milestone 0 — Governance + Technical Skeleton" \
  --dir "docs/planning/milestone-0/issues"
```

Execute for real:

```
DRY_RUN=0 scripts/create_issues.sh \
  --milestone "Milestone 0 — Governance + Technical Skeleton" \
  --dir "docs/planning/milestone-0/issues"
```

### Requirements

- GitHub CLI (`gh`) installed
- Authenticated via `gh auth login`
- Labels and milestones created in repository

### Conventions

- Each issue must be a standalone `.md` file.
- The first non-empty line is used as the issue title.
- Type is inferred from `[Type]` prefix in the title.
- Area is inferred from keywords in the title.

---

## Execution Policy

- Always run with `DRY_RUN=1` before executing.
- Never create issues directly in the GitHub UI if an issue file exists.
- Issue files are considered source of truth for planning.

Scripts may evolve, but changes affecting workflow must be reviewed in a pull request.

