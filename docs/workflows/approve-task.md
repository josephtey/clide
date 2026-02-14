# Approve Task Workflow

## User Input Patterns
- "Approve task `<id>`"
- "Complete task `<id>`"
- "Task `<id>` looks good"

## Purpose
Moves a task from "staging" to "completed" and adds it to the merge queue.

## Workflow Steps

### 1. Validate
- Task exists
- Task status is "staging"

### 2. Update Task State
- Set status to "completed"
- Set `completed_at` timestamp
- Add task to merge queue (data/merge-queue.json) with status "waiting"
- Set task `merge_status` to "waiting"
- Save `data/tasks.json`

### 3. Cleanup Worktree
- Run `scripts/cleanup-worktree.sh` to remove worktree
- Update data/worktrees.json entry status to "removed"

### 4. Notify User
- Confirm task completion: "Task {id} approved and completed. Branch feature/task-{id} ready for merge."
- Remind about merge queue: "Use 'Process merge queue' when ready to merge to main."

## Error Handling

- **Task not found**: "Task {id} not found."
- **Invalid status**: "Task {id} is {current_status}. Can only approve tasks in 'staging' status."
