#!/usr/bin/env bash
set -euo pipefail

# create_issues.sh
#
# Creates GitHub issues from one .md file per issue (title = first non-empty line).
# Infers labels from [Type] prefix and keywords in title.
#
# Usage:
#   ./create_issues.sh --milestone "Milestone 0 — Governance + Technical Skeleton" --dir "docs/planning/milestone-0/issues"
#
# Or via env vars:
#   MILESTONE="Milestone 0 — ..." ISSUES_DIR="docs/planning/milestone-0/issues" ./create_issues.sh
#
# Dry run (default):
#   DRY_RUN=1 ./create_issues.sh --milestone "..." --dir "..."
#
# Execute for real:
#   DRY_RUN=0 ./create_issues.sh --milestone "..." --dir "..."

MILESTONE="${MILESTONE:-}"
ISSUES_DIR="${ISSUES_DIR:-}"
DRY_RUN="${DRY_RUN:-1}"

usage() {
  cat <<'USAGE'
create_issues.sh

Required:
  --milestone "<milestone name>"
  --dir "<issues directory containing .md files>"

Optional:
  --dry-run 0|1   (default: 1)
  -h, --help

Examples:
  DRY_RUN=1 ./create_issues.sh --milestone "Phase 1 — Repository Initialization" --dir "docs/planning/phase-1/issues"
  DRY_RUN=0 ./create_issues.sh --milestone "Milestone 0 — Governance + Technical Skeleton" --dir "docs/planning/milestone-0/issues"
USAGE
}

# ---- arg parsing ----
while [[ ${#} -gt 0 ]]; do
  case "$1" in
    --milestone)
      shift
      MILESTONE="${1:-}"
      ;;
    --dir)
      shift
      ISSUES_DIR="${1:-}"
      ;;
    --dry-run)
      shift
      DRY_RUN="${1:-1}"
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown arg: $1"
      echo
      usage
      exit 1
      ;;
  esac
  shift || true
done

if [[ -z "${MILESTONE}" || -z "${ISSUES_DIR}" ]]; then
  echo "Missing required arguments."
  echo
  usage
  exit 1
fi

require_cmd() {
  command -v "$1" >/dev/null 2>&1 || {
    echo "Missing required command: $1"
    exit 1
  }
}

require_cmd gh
require_cmd sed
require_cmd awk
require_cmd grep
require_cmd tr

# Ensure we're authenticated
if ! gh auth status >/dev/null 2>&1; then
  echo "Not authenticated with GitHub CLI. Run: gh auth login"
  exit 1
fi

# Title = first non-empty line, with leading markdown heading markers stripped
clean_title() {
  sed -n -e '/^[[:space:]]*$/d' -e '1p' | sed -E 's/^[[:space:]]*#+[[:space:]]*//'
}

infer_type_label() {
  local title="$1"
  if [[ "$title" == \[*\]* ]]; then
    local prefix lower
    prefix="$(echo "$title" | sed -n 's/^\[\([^]]\+\)\].*$/\1/p')"
    lower="$(echo "$prefix" | tr '[:upper:]' '[:lower:]')"
    case "$lower" in
      decision) echo "type: decision" ;;
      feature) echo "type: feature" ;;
      refactor) echo "type: refactor" ;;
      documentation|docs|doc) echo "type: documentation" ;;
      spike) echo "type: spike" ;;
      governance) echo "type: governance" ;;
      *) echo "" ;;
    esac
  else
    echo ""
  fi
}

infer_area_label() {
  local title="$1"
  local lower
  lower="$(echo "$title" | tr '[:upper:]' '[:lower:]')"

  # governance / repo administration
  if echo "$lower" | grep -Eq "\bgovernance\b|branch protection|pull request template|pr template|\btemplates?\b|\blabels?\b|\bmilestones?\b|\bgithub\b|\brepo\b"; then
    echo "area: governance"; return
  fi

  # docs
  if echo "$lower" | grep -Eq "\bdocumentation\b|\bdocs\b|readme|architecture\.md|decisions\.md|roadmap\.md|milestones\.md"; then
    echo "area: docs"; return
  fi

  # Admin UI
  if echo "$lower" | grep -Eq "admin ui|ordering interaction"; then
    echo "area: admin-ui"; return
  fi

  # API
  if echo "$lower" | grep -Eq "\bapi\b|route handler|route handlers"; then
    echo "area: api"; return
  fi

  # lib
  if echo "$title" | grep -q "lib/"; then
    echo "area: lib"; return
  fi
  if echo "$lower" | grep -Eq "validation|dto|ordering behavior|ordering invariants|domain"; then
    echo "area: lib"; return
  fi

  # schema
  if echo "$lower" | grep -Eq "model|migration|schema|prisma|sqlite|database"; then
    echo "area: schema"; return
  fi

  echo ""
}

create_issue() {
  local file="$1"

  local title type_label area_label
  title="$(clean_title < "$file")"
  type_label="$(infer_type_label "$title")"
  area_label="$(infer_area_label "$title")"

  local labels=()
  [[ -n "$type_label" ]] && labels+=("$type_label")
  [[ -n "$area_label" ]] && labels+=("$area_label")

  echo "File:      $file"
  echo "Title:     $title"
  echo "Milestone: $MILESTONE"
  echo "Labels:    ${labels[*]:-(none)}"

  if [[ "$DRY_RUN" == "1" ]]; then
    echo "DRY RUN: not creating issue"
    echo "----"
    return
  fi

  local label_args=()
  for l in "${labels[@]}"; do
    label_args+=(--label "$l")
  done

  gh issue create \
    --title "$title" \
    --body-file "$file" \
    --milestone "$MILESTONE" \
    "${label_args[@]}"

  echo "----"
}

if [[ ! -d "$ISSUES_DIR" ]]; then
  echo "Issues directory not found: $ISSUES_DIR"
  exit 1
fi

shopt -s nullglob
files=("$ISSUES_DIR"/*.md)

if (( ${#files[@]} == 0 )); then
  echo "No .md files found in: $ISSUES_DIR"
  exit 1
fi

echo "Found ${#files[@]} issue files."
echo "DRY_RUN=$DRY_RUN"
echo "===="

for f in "${files[@]}"; do
  create_issue "$f"
done

echo "Done."
