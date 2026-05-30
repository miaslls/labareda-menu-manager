## Project Tree

```text
.
|-- .github
|   |-- ISSUE_TEMPLATE
|   |   |-- decision.md
|   |   |-- issue.md
|   |   `-- spike.md
|   |-- workflows
|   |   `-- ci.yml
|   |-- dependabot.yml
|   `-- pull_request_template.md
|-- .husky
|   `-- pre-commit
|-- app
|   |-- lib
|   |   |-- db
|   |   |   `-- prisma-client.ts
|   |   |-- domain
|   |   |   |-- __tests__
|   |   |   |   |-- CategoryRepository.contract.test.ts
|   |   |   |   |-- createCategoryInDraftWorkspace.test.ts
|   |   |   |   |-- domain-error-taxonomy.test.ts
|   |   |   |   |-- ensureDraftWorkspace.test.ts
|   |   |   |   |-- getDraftWorkspace.test.ts
|   |   |   |   |-- requireContiguousCategoryOrder.test.ts
|   |   |   |   |-- requireSingleDraftMenuVersion.test.ts
|   |   |   |   `-- vitest-harness.test.ts
|   |   |   |-- category
|   |   |   |   |-- repositories
|   |   |   |   |   `-- CategoryRepository.ts
|   |   |   |   |-- Category.ts
|   |   |   |   |-- CategoryOrderingInvariantViolationError.ts
|   |   |   |   |-- CreateCategoryInput.ts
|   |   |   |   |-- InvalidCategoryDisplayNameError.ts
|   |   |   |   |-- createCategoryInDraftWorkspace.ts
|   |   |   |   `-- requireContiguousCategoryOrder.ts
|   |   |   |-- errors
|   |   |   |   |-- DomainError.ts
|   |   |   |   `-- UnsupportedAudienceError.ts
|   |   |   |-- menu-version
|   |   |   |   |-- repositories
|   |   |   |   |   `-- MenuVersionRepository.ts
|   |   |   |   |-- DraftInvariantViolationError.ts
|   |   |   |   |-- MenuVersion.ts
|   |   |   |   |-- MenuVersionStatus.ts
|   |   |   |   |-- ensureDraftWorkspace.ts
|   |   |   |   |-- getDraftWorkspace.ts
|   |   |   |   `-- requireSingleDraftMenuVersion.ts
|   |   |   `-- Audience.ts
|   |   |-- errors
|   |   |   `-- NotImplementedError.ts
|   |   `-- persistence
|   |       |-- category
|   |       |   `-- PrismaCategoryRepository.ts
|   |       `-- menu-version
|   |           |-- PrismaMenuVersionRepository.ts
|   |           `-- mapStatus.ts
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
|       |-- milestone-2
|       |   |-- issues
|       |   |   |-- M2-05-move-category-up-down-within-draft-workspace.md
|       |   |   |-- M2-06-delete-empty-category-and-close-ordering-gap.md
|       |   |   |-- M2-07-integration-verification-and-milestone-2-proof.md
|       |   |   |-- M2-H01-harden-concurrent-category-appends.md
|       |   |   |-- M2-H02-add-category-creation-postcondition-checks.md
|       |   |   `-- M2-P01-implement-postgres-singleton-draft-enforcement.md
|       |   |-- ISSUE_MAP.md
|       |   `-- M2_HARDENING.md
|       `-- phase-1
|           `-- issues
|               |-- P1-01-foundational-governance-documents.md
|               |-- P1-02-branch-protection-and-pr-requirements.md
|               |-- P1-03-add-issue-and-pr-templates.md
|               `-- P1-04-create-labels-and-milestones.md
|-- prisma
|   |-- migrations
|   |   |-- 20260412000000_postgres_baseline
|   |   |   `-- migration.sql
|   |   |-- 20260513002753_add_category_model
|   |   |   `-- migration.sql
|   |   `-- migration_lock.toml
|   `-- schema.prisma
|-- scripts
|   |-- README.md
|   |-- create_issues.sh
|   |-- create_milestones.sh
|   `-- proof-m1.integration.test.ts
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
|-- vitest.config.ts
`-- vitest.proof.config.ts
```

## Summary

- **Total Files**: 100
- **Total Directories**: 36
- **Exclusion Source**: `.gitignore`
- **Excluded Highlights**: `.git`, `node_modules`, `.next`, `.temp`, `.agents`, `.vscode`,
  `coverage`, `out`, `build`, `generated`
