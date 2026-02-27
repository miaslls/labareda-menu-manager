# Project Tree

```text
.
|-- .github
|   |-- ISSUE_TEMPLATE
|   |   |-- decision.md
|   |   |-- issue.md
|   |   `-- spike.md
|   |-- dependabot.yml
|   `-- pull_request_template.md
|-- app
|   |-- lib
|   |   |-- domain
|   |   |   |-- __tests__
|   |   |   |   |-- domain-error-taxonomy.test.ts
|   |   |   |   |-- requireSingleDraftMenuVersion.test.ts
|   |   |   |   `-- vitest-harness.test.ts
|   |   |   |-- errors
|   |   |   |   `-- DomainError.ts
|   |   |   `-- menu-version
|   |   |       |-- repositories
|   |   |       |   `-- MenuVersionRepository.ts
|   |   |       |-- DraftInvariantViolationError.ts
|   |   |       |-- MenuVersion.ts
|   |   |       |-- MenuVersionStatus.ts
|   |   |       `-- requireSingleDraftMenuVersion.ts
|   |   |-- persistence
|   |   |   `-- menu-version
|   |   |       |-- mapStatus.ts
|   |   |       `-- PrismaMenuVersionRepository.ts
|   |   `-- db.ts
|   |-- globals.css
|   |-- layout.tsx
|   |-- page.tsx
|   |-- robots.ts
|   `-- sitemap.ts
|-- docs
|   |-- governance
|   |   |-- BRANCH_NAMING_REFERENCE.md
|   |   `-- LABELS.md
|   `-- planning
|       |-- governance
|       |   `-- issues
|       |       |-- G-01-introduce-prettier-toolchain.md
|       |       |-- G-02-add-branch-naming-reference.md
|       |       `-- G-03-improve-create-issues-script-label-inference.md
|       |-- milestone-0
|       |   `-- issues
|       |       |-- M0-01-initialize-nextjs-app-router-skeleton.md
|       |       |-- M0-02-configure-typescript-and-eslint.md
|       |       |-- M0-03-integrate-prisma-with-sqlite.md
|       |       |-- M0-04-run-initial-migration-pipeline.md
|       |       `-- M0-05-finalize-readme-setup-instructions.md
|       |-- milestone-1
|       |   |-- issues
|       |   |   |-- M1-01-introduce-menuversion-schema.md
|       |   |   |-- M1-02.5-introduce-vitest-domain-testing-harness.md
|       |   |   |-- M1-02-introduce-menuversion-domain-model-and-repository-boundary.md
|       |   |   |-- M1-03-enforce-single-draft-invariant.md
|       |   |   |-- M1-04-implement-audience-based-draft-workspace-read.md
|       |   |   |-- M1-05-ensure-initial-draft-workspace-exists-idempotently.md
|       |   |   `-- M1-06-integration-verification-and-milestone-1-proof.md
|       |   `-- ISSUE_MAP.md
|       `-- phase-1
|           `-- issues
|               |-- P1-01-foundational-governance-documents.md
|               |-- P1-02-branch-protection-and-pr-requirements.md
|               |-- P1-03-add-issue-and-pr-templates.md
|               `-- P1-04-create-labels-and-milestones.md
|-- prisma
|   |-- migrations
|   |   |-- 20260212173944_smoke_test
|   |   |   `-- migration.sql
|   |   |-- 20260223212023_add_menuversion_model
|   |   |   `-- migration.sql
|   |   `-- migration_lock.toml
|   `-- schema.prisma
|-- scripts
|   |-- create_issues.sh
|   |-- create_milestones.sh
|   `-- README.md
|-- .env.example
|-- .gitignore
|-- .prettierignore
|-- .prettierrc
|-- ARCHITECTURE.md
|-- CHANGELOG.md
|-- DECISIONS.md
|-- eslint.config.mjs
|-- MILESTONES.md
|-- next.config.ts
|-- package.json
|-- package-lock.json
|-- prisma.config.ts
|-- PROJECT_TREE.md
|-- README.md
|-- ROADMAP.md
|-- SCOPE.md
|-- tsconfig.json
`-- vitest.config.ts
```

## Summary

- **Total Files:** 70
- **Total Folders:** 27
