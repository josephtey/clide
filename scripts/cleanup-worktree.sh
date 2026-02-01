#!/bin/bash
# Usage: ./scripts/cleanup-worktree.sh <repo_path> <worktree_path>

set -e  # Exit on error

REPO_PATH=$1
WORKTREE_PATH=$2

if [ -z "$REPO_PATH" ] || [ -z "$WORKTREE_PATH" ]; then
  echo "ERROR: Missing required arguments"
  echo "Usage: ./scripts/cleanup-worktree.sh <repo_path> <worktree_path>"
  exit 1
fi

# Navigate to main repo
if [ ! -d "$REPO_PATH" ]; then
  echo "ERROR: Repository not found at $REPO_PATH"
  exit 1
fi

cd "$REPO_PATH"

# Check if worktree exists
if [ ! -d "$WORKTREE_PATH" ]; then
  echo "WARNING: Worktree not found at $WORKTREE_PATH (may already be removed)"
  exit 0
fi

# Remove worktree (force flag handles uncommitted changes)
git worktree remove "$WORKTREE_PATH" --force 2>/dev/null || {
  echo "ERROR: Failed to remove worktree at $WORKTREE_PATH"
  exit 1
}

echo "SUCCESS: Worktree removed at $WORKTREE_PATH"
