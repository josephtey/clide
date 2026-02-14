#!/bin/bash
# Usage: ./scripts/cleanup-worktree.sh <repo_path> <worktree_path> [ssh_host]

set -e  # Exit on error

REPO_PATH=$1
WORKTREE_PATH=$2
SSH_HOST=$3  # Optional: if provided, repo is remote

if [ -z "$REPO_PATH" ] || [ -z "$WORKTREE_PATH" ]; then
  echo "ERROR: Missing required arguments"
  echo "Usage: ./scripts/cleanup-worktree.sh <repo_path> <worktree_path> [ssh_host]"
  exit 1
fi

# Helper function to execute git commands (local or remote)
git_exec() {
  if [ -n "$SSH_HOST" ]; then
    ssh "$SSH_HOST" "cd '$REPO_PATH' && git $*"
  else
    git "$@"
  fi
}

# Helper function to check directory existence
dir_exists() {
  if [ -n "$SSH_HOST" ]; then
    ssh "$SSH_HOST" "[ -d '$1' ]"
  else
    [ -d "$1" ]
  fi
}

# Check if main repo exists
if ! dir_exists "$REPO_PATH"; then
  echo "ERROR: Repository not found at $REPO_PATH"
  exit 1
fi

# Navigate to main repo (only for local repos)
if [ -z "$SSH_HOST" ]; then
  cd "$REPO_PATH"
fi

# Check if worktree exists
if ! dir_exists "$WORKTREE_PATH"; then
  echo "WARNING: Worktree not found at $WORKTREE_PATH (may already be removed)"
  exit 0
fi

# Remove worktree (force flag handles uncommitted changes)
git_exec worktree remove "$WORKTREE_PATH" --force 2>/dev/null || {
  echo "ERROR: Failed to remove worktree at $WORKTREE_PATH"
  exit 1
}

echo "SUCCESS: Worktree removed at $WORKTREE_PATH"
