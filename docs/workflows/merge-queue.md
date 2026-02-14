# Process Merge Queue Workflow

## User Input Patterns
- "Process merge queue"
- "Merge next task"
- "Merge completed tasks"

## Workflow Steps

### 1. Read Merge Queue
- Read `data/merge-queue.json`
- Find first task with status "waiting"
- If queue is empty or no waiting tasks, notify user

### 2. Process Merge
- Get task details from data/tasks.json
- Update queue entry status to "merging"
- Run `scripts/process-merge-queue.sh` with repo_path and branch name
- Capture output (SUCCESS or CONFLICT)

### 3. Handle Result

**If SUCCESS:**
- Update queue entry status to "merged"
- Update task `merge_status` to "merged"
- Remove entry from queue
- **Verify worktree cleanup**: Check that worktree was removed by approve command (should have status "removed" in data/worktrees.json)
- Notify user: "Task {id} merged successfully to main."

**If CONFLICT:**
- Update queue entry status to "conflict"
- Update task `merge_status` to "conflict"
- Keep entry in queue for manual resolution
- Notify user: "Task {id} has merge conflicts. Resolve conflicts manually in {repo_path}, then run 'Process merge queue' again."

**Note:** Worktrees are cleaned up by the "Approve task" command before tasks are added to merge queue, so they should already be removed by the time merge processing happens.

### 4. Continue if Auto-Merge Enabled
- If data/merge-queue.json config has `auto_merge: true`
- Recursively process next task in queue
- Stop on first conflict or when queue is empty

## Error Handling

- **Empty queue**: "Merge queue is empty. No tasks to merge."
- **Merge script fails**: "Merge failed for task {id}. Check {repo_path} for issues."
