# Branch Naming Reference

Status: Active Purpose: Central reference for approved branch names during milestone execution.

---

# Milestone 0 — Governance + Technical Skeleton

## Issues and Branch Names

### 1. Initialize Next.js App Router skeleton

```
feature/app-router-skeleton
```

### 2. Configure TypeScript and ESLint

```
feature/typescript-eslint-setup
```

### 3. Integrate Prisma with SQLite

```
feature/prisma-sqlite-integration
```

### 4. Run initial migration pipeline

```
feature/initial-migration-pipeline
```

### 5. Finalize README setup instructions

```
docs/readme-setup-instructions
```

---

# Branch Naming Rules

- One branch per issue
- Prefix must match issue type (`feature/`, `docs/`, `refactor/`, `decision/`, `spike/`)
- No milestone prefixes in branch names
- Keep names short and capability-oriented
- Avoid redundant words (e.g., avoid "milestone-0-")

This file exists to prevent naming drift and reduce cognitive overhead during execution.
