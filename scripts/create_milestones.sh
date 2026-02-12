#!/usr/bin/env bash
set -euo pipefail

# Creates milestones if missing (idempotent).
# Requires: gh auth login, and the repo to already exist.

OWNER="$(gh repo view --json owner -q .owner.login)"
REPO="$(gh repo view --json name -q .name)"

ensure_milestone () {
  local title="$1"
  local description="$2"

  # Check if milestone already exists by title
  local existing_number
  existing_number="$(gh api "repos/${OWNER}/${REPO}/milestones?state=all&per_page=100" \
    --jq ".[] | select(.title == \"${title}\") | .number" || true)"

  if [[ -n "${existing_number}" ]]; then
    echo "✔ Milestone exists: ${title} (#${existing_number})"
    return 0
  fi

  echo "➕ Creating milestone: ${title}"
  gh api -X POST "repos/${OWNER}/${REPO}/milestones" \
    -f title="${title}" \
    -f state="open" \
    -f description="${description}" >/dev/null

  echo "✅ Created: ${title}"
}

# Titles should match MILESTONES.md exactly.
ensure_milestone \
  "Milestone 0 — Governance + Technical Skeleton" \
  "Capability unlocked: the project can be cloned, installed, migrated, and run consistently with governance in place."

ensure_milestone \
  "Milestone 1 — Draft Workspace Exists" \
  "Capability unlocked: a draft MenuVersion workspace exists and can be retrieved through the domain layer."

ensure_milestone \
  "Milestone 2 — Categories Ordered Within Draft" \
  "Capability unlocked: categories can be created and ordered within the draft workspace with strict ordering invariants."

ensure_milestone \
  "Milestone 3 — Items Ordered Within Categories" \
  "Capability unlocked: items can be managed within draft categories with ordering, uniqueness, priceCents, and visibility."

ensure_milestone \
  "Milestone 4 — Publish and Public Read" \
  "Capability unlocked: draft can be published atomically and the public menu reads only from the published workspace."

ensure_milestone \
  "Milestone 5 — Authentication + Admin Protection" \
  "Capability unlocked: admin routes, preview, and mutations are protected by minimal authentication."

echo "🎉 All milestones ensured."
