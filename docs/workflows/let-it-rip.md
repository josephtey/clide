# Let It Rip Mode (Fast Track)

## User Input Patterns
- "Let it rip: `<repo-name>`: `<title>`. `<description>`"
- "Fast track: `<repo-name>`: `<title>`. `<description>`"
- "Quick task: `<repo-name>`: `<title>`. `<description>`"

## Purpose
Fast-track mode for simple, straightforward tasks that don't require planning or staging. Creates, executes, and merges the task in one go.

## When to Use

**✅ Use for:**
- Simple bug fixes (typos, small corrections)
- Uncomment/comment code
- Add simple logging or debug statements
- Update documentation
- Rename files or variables
- Add simple configuration
- Any task that's obvious and low-risk

**❌ Do NOT use for:**
- New features requiring design decisions
- Refactoring or architectural changes
- Tasks affecting multiple components
- Anything requiring user input or clarification
- Complex bug fixes
- Tasks where multiple approaches exist

## Workflow Steps

### 1. Validate
- Repository exists
- Description is clear and actionable
- Task is simple enough for fast-track (use judgment)
- Current in_progress tasks < max_parallel_tasks

### 2. Create Minimal Spec
- Get next task ID from data/tasks.json
- Create directory `tasks/{id}/`
- Write minimal spec to `tasks/{id}/spec.md` based directly on user's description
- No plan mode, no conversation - just translate the user's prompt into a structured spec

**Minimal spec format:**
```markdown
# Task #{id}: {title}

**Repository:** {repo}
**Mode:** Fast Track
**Created:** {timestamp}

## Description

{user's description expanded slightly}

## Implementation

{brief bullet points of what needs to be done}

## Success Criteria

- Task completed as described
- No breaking changes
- Code follows repository conventions
```

### 3. Register Task
- Add task to data/tasks.json with status "in_progress" (skip "todo")
- Increment next_id
- Set created_at and assigned_at to same timestamp

### 4. Create Worktree and Assign Immediately
- Run scripts/init-worktree.sh
- Add entry to data/worktrees.json
- Update task with worktree_path and branch

### 5. Spawn Sub-Agent
- Use Task tool with subagent_type="general-purpose"
- Run in FOREGROUND
- Provide straightforward prompt:
  - Task description
  - Repository and worktree paths
  - Student context (assigned student for repo)
  - Instruction to implement, test, commit, and push
  - Note that this is a fast-track task (simple and straightforward)

### 6. Auto-Progression on Success
**If agent succeeds:**
- Update status to "staging"
- Immediately update status to "completed"
- Add to merge queue with status "waiting"
- Set merge_status to "waiting"
- Cleanup worktree
- Process merge queue automatically

**If agent fails:**
- Update status to "failed"
- Cleanup worktree
- Report error to user

### 7. Notify User
- **On success**: "Task {id} completed and merged via fast-track! Branch feature/task-{id} merged to main."
- **On failure**: "Fast-track task {id} failed. Error: {error}. Use 'Retry task {id}' or create a proper task for this."

## Example

```
User: Let it rip: joetey.com: Fix typo in README. Change "teh" to "the" in line 42.

Claude:
1. Creates task #15 with minimal spec
2. Assigns to Rio (joetey.com owner)
3. Spawns agent to fix typo
4. Agent commits and pushes
5. Auto-approves and merges
6. "Task 15 completed and merged via fast-track!"

Total time: ~30 seconds instead of ~5 minutes with full workflow
```

## Important Notes

- Skip plan mode entirely - trust the user's description
- Skip staging/review - merge directly on success
- Only for tasks where you're confident of the approach
- If in doubt, use regular "Create task" with planning instead
- Update student context even for fast-track tasks

## Error Handling

- **Too complex**: "This task seems complex. Use 'Create task' with planning instead."
- **Unclear description**: "Please provide more details. Fast-track requires clear, specific instructions."
- **Repository not found**: "Repository {repo} not found."
- **Max parallel tasks**: "Already running {count} tasks. Wait for completion or use regular workflow."
