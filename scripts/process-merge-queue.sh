#!/bin/bash
# Usage: ./scripts/process-merge-queue.sh <repo_path> <branch_name>

set -e  # Exit on error

REPO_PATH=$1
BRANCH=$2

if [ -z "$REPO_PATH" ] || [ -z "$BRANCH" ]; then
  echo "ERROR: Missing required arguments"
  echo "Usage: ./scripts/process-merge-queue.sh <repo_path> <branch_name>"
  exit 1
fi

# Navigate to repo
if [ ! -d "$REPO_PATH" ]; then
  echo "ERROR: Repository not found at $REPO_PATH"
  exit 1
fi

cd "$REPO_PATH"

# Determine main branch (try main first, fall back to master)
MAIN_BRANCH="main"
if ! git show-ref --verify --quiet refs/heads/main; then
  if git show-ref --verify --quiet refs/heads/master; then
    MAIN_BRANCH="master"
  else
    echo "ERROR: Could not find main or master branch"
    exit 1
  fi
fi

# Ensure on main and up to date
git checkout "$MAIN_BRANCH" 2>/dev/null || {
  echo "ERROR: Failed to checkout $MAIN_BRANCH"
  exit 1
}

git pull origin "$MAIN_BRANCH" 2>/dev/null || {
  echo "WARNING: Could not pull from origin (continuing anyway)"
}

# Check if branch exists
if ! git show-ref --verify --quiet refs/heads/"$BRANCH"; then
  echo "ERROR: Branch $BRANCH does not exist"
  exit 1
fi

# Attempt merge
if git merge "$BRANCH" --no-edit 2>/dev/null; then
  # Merge succeeded
  echo "SUCCESS"

  # Push to origin
  git push origin "$MAIN_BRANCH" 2>/dev/null || {
    echo "WARNING: Merge succeeded locally but push failed"
  }

  # Delete merged branch
  git branch -d "$BRANCH" 2>/dev/null || {
    echo "WARNING: Could not delete branch $BRANCH"
  }
else
  # Merge failed (conflict)
  echo "CONFLICT"
  git merge --abort 2>/dev/null || true
fi
