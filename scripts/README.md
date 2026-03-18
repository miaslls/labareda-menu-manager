# Scripts

Last reviewed: 2026-03-18.

This directory contains operational tooling used to manage and maintain the repository.

---

## `create_issues.sh`

Creates GitHub issues from one Markdown file per issue.

### Purpose

Automates issue creation to ensure:

- consistent formatting
- correct milestone assignment
- canonical label inference (`type:*`, `area:*`)
- repeatable governance workflow

### Usage

Dry run (recommended first):

```bash
DRY_RUN=1 scripts/create_issues.sh \
  --milestone "Milestone 1 - Draft Workspace Exists" \
  --dir "docs/planning/milestone-1/issues"
```

Execute for real:

```bash
DRY_RUN=0 scripts/create_issues.sh \
  --milestone "Milestone 1 - Draft Workspace Exists" \
  --dir "docs/planning/milestone-1/issues"
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

## `create_milestones.sh`

Ensures canonical milestones exist in GitHub (idempotent).

### Purpose

Keeps GitHub milestone configuration aligned with `MILESTONES.md`.

### Usage

```bash
scripts/create_milestones.sh
```

### Requirements

- GitHub CLI (`gh`) installed
- Authenticated via `gh auth login`
- Current directory set to repository root

---

## `proof-m1.integration.test.ts`

Milestone 1 verification proof runner.

### Purpose

Proves from a clean DB state that:

- empty database bootstraps one `DRAFT`
- repeated ensure calls are idempotent
- admin draft read resolves the same workspace

### Usage

```bash
npm run db:reset
npm run proof:m1
```

---

## Execution Policy

- Always run `create_issues.sh` with `DRY_RUN=1` before real execution.
- Do not create milestone/issue planning artifacts manually in GitHub if canonical files already
  exist in `docs/planning`.
- Planning docs in the repository are the source of truth for governance automation.
