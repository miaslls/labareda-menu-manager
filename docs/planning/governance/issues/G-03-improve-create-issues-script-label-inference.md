## [Governance] Improve issue creation script label inference

## Problem Statement

The `scripts/create_issues.sh` automation does not fully align with the canonical label taxonomy.

Without consistent inference rules, issues created via the script may miss required `type:` labels
or omit useful `area:` labels, causing taxonomy drift and extra manual cleanup.

---

## Why This Matters Now

We are actively using `create_issues.sh` to create canonical work items.

The script must stay aligned with `docs/governance/LABELS.md` so governance remains consistent and
low-friction.

---

## Success Criteria

- [ ] Issues with `[Chore]` prefix are created with `type: governance`
- [ ] Tooling-related issue titles infer `area: tooling` when applicable
- [ ] Existing inference behavior remains unchanged for other issue types and areas

---

## Scope & Constraints

In scope:

- Update `scripts/create_issues.sh` label inference:
  - map `[Chore]` → `type: governance`
  - infer `area: tooling` for formatter/lint/tooling work

Out of scope:

- Changing label taxonomy
- Enforcing labels via CI
- Any changes to issue templates

---

## Verification Notes

- Run script in dry-run mode and confirm inferred labels are correct:
  - `DRY_RUN=1 ./scripts/create_issues.sh --milestone \"...\" --dir \"...\"`
- Create at least one issue for real and confirm labels appear on GitHub:
  - `DRY_RUN=0 ...`
