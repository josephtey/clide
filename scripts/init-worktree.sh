#!/bin/bash
# Usage: ./scripts/init-worktree.sh <repo_path> <task_id> <branch_name> [ssh_host]

set -e  # Exit on error

REPO_PATH=$1
TASK_ID=$2
BRANCH=$3
SSH_HOST=$4  # Optional: if provided, repo is remote

if [ -z "$REPO_PATH" ] || [ -z "$TASK_ID" ] || [ -z "$BRANCH" ]; then
  echo "ERROR: Missing required arguments"
  echo "Usage: ./scripts/init-worktree.sh <repo_path> <task_id> <branch_name> [ssh_host]"
  exit 1
fi

WORKTREE_PATH="${REPO_PATH}-task-${TASK_ID}"

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

# Check if worktree already exists
if dir_exists "$WORKTREE_PATH"; then
  echo "ERROR: Worktree already exists at $WORKTREE_PATH"
  exit 1
fi

# Check if main repo exists
if ! dir_exists "$REPO_PATH"; then
  echo "ERROR: Repository not found at $REPO_PATH"
  exit 1
fi

# Navigate to main repo (only for local repos)
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

# Ensure we're on main branch and up to date
git_exec checkout "$MAIN_BRANCH" 2>/dev/null || {
  echo "ERROR: Failed to checkout $MAIN_BRANCH branch"
  exit 1
}

git_exec pull origin "$MAIN_BRANCH" 2>/dev/null || {
  echo "WARNING: Could not pull from origin (continuing anyway)"
}

# Check if branch already exists
if git_exec show-ref --verify --quiet refs/heads/"$BRANCH"; then
  echo "ERROR: Branch $BRANCH already exists"
  exit 1
fi

# Create worktree with new branch
git_exec worktree add "$WORKTREE_PATH" -b "$BRANCH" 2>/dev/null || {
  echo "ERROR: Failed to create worktree"
  exit 1
}

# Output worktree path for capture
echo "$WORKTREE_PATH"
