#!/bin/bash
# Usage: ./scripts/process-merge-queue.sh <repo_path> <branch_name> [ssh_host]

set -e  # Exit on error

REPO_PATH=$1
BRANCH=$2
SSH_HOST=$3  # Optional: if provided, repo is remote

if [ -z "$REPO_PATH" ] || [ -z "$BRANCH" ]; then
  echo "ERROR: Missing required arguments"
  echo "Usage: ./scripts/process-merge-queue.sh <repo_path> <branch_name> [ssh_host]"
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

# Check if repo exists
if ! dir_exists "$REPO_PATH"; then
  echo "ERROR: Repository not found at $REPO_PATH"
  exit 1
fi

# Navigate to repo (only for local repos)
if [ -z "$SSH_HOST" ]; then
  cd "$REPO_PATH"
fi

# Determine main branch (try main first, fall back to master)
MAIN_BRANCH="main"
if ! git_exec show-ref --verify --quiet refs/heads/main; then
  if git_exec show-ref --verify --quiet refs/heads/master; then
    MAIN_BRANCH="master"
  else
    echo "ERROR: Could not find main or master branch"
    exit 1
  fi
fi

# Ensure on main and up to date
git_exec checkout "$MAIN_BRANCH" 2>/dev/null || {
  echo "ERROR: Failed to checkout $MAIN_BRANCH"
  exit 1
}

git_exec pull origin "$MAIN_BRANCH" 2>/dev/null || {
  echo "WARNING: Could not pull from origin (continuing anyway)"
}

# Check if branch exists
if ! git_exec show-ref --verify --quiet refs/heads/"$BRANCH"; then
  echo "ERROR: Branch $BRANCH does not exist"
  exit 1
fi

# Attempt merge
if git_exec merge "$BRANCH" --no-edit 2>/dev/null; then
  # Merge succeeded
  echo "SUCCESS"

  # Push to origin
  git_exec push origin "$MAIN_BRANCH" 2>/dev/null || {
    echo "WARNING: Merge succeeded locally but push failed"
  }

  # Delete merged branch
  git_exec branch -d "$BRANCH" 2>/dev/null || {
    echo "WARNING: Could not delete branch $BRANCH"
  }
else
  # Merge failed (conflict)
  echo "CONFLICT"
  git_exec merge --abort 2>/dev/null || true
fi
