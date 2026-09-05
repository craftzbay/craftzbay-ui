#!/usr/bin/env bash
# Showcase deploy: run ON the server, inside the clone that nginx serves
# (`apps/site/dist`). No hosts, users or paths live here — the caller is
# already in the right checkout:
#
#   cd <clone> && deploy/deploy.sh
#
# Pull → install → build, with the checks that have caught silent failures:
#   - the tree must be clean before and after (a generated file that differs
#     means the build ran against other dependencies than the commit expects);
#   - `pnpm install` must actually have applied the lockfile — over ssh pnpm
#     may skip its "modules will be reinstalled, proceed?" prompt and install
#     nothing, and the build then succeeds on stale node_modules.
set -euo pipefail

cd "$(dirname "$0")/.."

if [ -n "$(git status --porcelain)" ]; then
  echo "deploy: working tree is not clean — refusing to pull over local changes:" >&2
  git status --short >&2
  exit 1
fi

before=$(git rev-parse --short HEAD)
git pull --ff-only
after=$(git rev-parse --short HEAD)
echo "deploy: $before → $after"

pnpm install --frozen-lockfile --config.confirmModulesPurge=false

# pnpm keeps a copy of the lockfile it last applied; if it differs from the
# repo's, the install above did not take.
if ! cmp -s pnpm-lock.yaml node_modules/.pnpm/lock.yaml; then
  echo "deploy: node_modules does not match pnpm-lock.yaml — install did not apply" >&2
  exit 1
fi
echo "deploy: vite $(node -p "require('vite/package.json').version"), node $(node -v)"

pnpm build

if [ -n "$(git status --porcelain)" ]; then
  echo "deploy: build left the tree dirty (generated file drift?):" >&2
  git status --short >&2
  exit 1
fi

echo "deploy: built $(date -u +%FT%TZ)"
ls -1 apps/site/dist/assets | grep -E '^(index|vendor)-' | sed 's/^/  /'
