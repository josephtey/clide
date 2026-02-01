# Agent Dashboard

A centralized task management system for orchestrating Claude agents across multiple project repositories.

## Overview

The Agent Dashboard allows you to:
- Create and manage feature development tasks across different repos
- Spawn Claude agents to autonomously implement features
- Track task status and progress
- Maintain clean git workflows with feature branches

## Setup

1. Clone this repository
2. Ensure Claude Code CLI is installed and authenticated
3. Open this directory in Claude Code: `cd /path/to/agent-dashboard && claude`

## Architecture

```
agent-dashboard/
├── tasks.json       # Task state and metadata
├── repos.json       # Repository configuration
├── specs/           # Auto-generated task specifications
├── CLAUDE.md        # Agent behavioral instructions
└── README.md        # This file
```

## CLI Reference

### Creating Tasks

Create a new task for a project repository:

```
Create task for <repo-name>: <title>. <description>
```

**Example:**
```
Create task for joetey.com: Add dark mode toggle. Should be in the header using a sun/moon icon. Persist the preference to localStorage.
```

**What happens:**
1. Claude enters plan mode to have a planning conversation with you
2. Claude explores the target repository to understand existing patterns
3. You collaborate on the implementation approach
4. The plan becomes the spec file at `specs/task-{id}.md`
5. Task is registered in `tasks.json` with status "todo"

**Planning conversation covers:**
- Clarifying exact requirements
- UI/UX preferences
- Technology choices
- Integration with existing code
- Files to modify/create
- Success criteria

**Benefits of planning first:**
- Specs are clearer and more actionable
- Implementation approach is validated before work starts
- Reduces failed tasks from unclear requirements

### Listing Tasks

View all tasks:

```
List tasks
```

or

```
Show all tasks
```

**Output format:**
```
Tasks:
#1 [TODO] joetey.com - Add dark mode toggle
#2 [IN_PROGRESS] joetey.com - Add contact form (branch: feature/task-2)
#3 [COMPLETED] joetey.com - Fix mobile nav
#4 [FAILED] joetey.com - Add animations (error: dependency conflict)
```

### Viewing Task Details

Show full details for a specific task:

```
Show task <id>
```

**Example:**
```
Show task 1
```

Displays task metadata and the complete specification.

### Assigning Tasks

Execute a task by spawning a sub-agent:

```
Assign task <id>
```

**Example:**
```
Assign task 1
```

The system will:
1. Validate task exists and is in "todo" status
2. Update status to "in_progress"
3. Spawn a Claude sub-agent in the project repository
4. Sub-agent creates branch `feature/task-{id}` from main/master
5. Sub-agent implements the feature according to spec
6. Sub-agent commits and pushes the branch
7. Task status updated to "completed" (or "failed" if errors occur)
8. You're notified when complete

**Sequential execution:**
- Only one task can be "in_progress" at a time
- Attempting to assign while another is running will error
- This prevents merge conflicts and git state issues

### After Task Completion

When a task completes successfully:
1. Branch `feature/task-{id}` is pushed to the remote repository
2. Review the changes on GitHub or checkout the branch locally
3. Test the implementation
4. Merge to main when satisfied

For failed tasks:
1. Check error details in the task status
2. Fix manually or modify the spec and reassign

## Task Lifecycle

```
TODO → IN_PROGRESS → COMPLETED
                  → FAILED
```

- **TODO**: Task created, ready to be assigned
- **IN_PROGRESS**: Sub-agent is actively working on the task
- **COMPLETED**: Implementation finished and pushed to remote branch
- **FAILED**: Sub-agent encountered errors during implementation

## tasks.json Schema

```json
{
  "next_id": 2,
  "tasks": [
    {
      "id": 1,
      "repo": "joetey.com",
      "repo_path": "/Users/josephtey/Projects/joetey.com",
      "spec_file": "specs/task-1.md",
      "title": "Add dark mode toggle",
      "status": "todo",
      "branch": null,
      "created_at": "2026-01-31T10:30:00Z",
      "assigned_at": null,
      "completed_at": null
    }
  ]
}
```

## Supported Repositories

The dashboard can manage tasks for any git repository. Repositories are configured in `repos.json`.

**Adding new repositories:**
When you create a task for a new repo, the system will:
1. Check if the repo exists at `/Users/josephtey/Projects/{repo-name}`
2. If not found, prompt you for the full path
3. Automatically add it to `repos.json` for future use

**repos.json format:**
```json
{
  "repositories": [
    {
      "name": "joetey.com",
      "path": "/Users/josephtey/Projects/joetey.com",
      "description": "Personal website",
      "main_branch": "main"
    }
  ]
}
```

## Tips

- Keep specs focused on requirements, not implementation details
- Let the agent infer standard patterns (e.g., component structure, styling approach)
- Review branches before merging to catch any issues
- Failed tasks often indicate missing dependencies or unclear requirements
- One task at a time ensures clean git state and prevents conflicts

## Future Enhancements

Potential improvements:
- Parallel task execution using git worktrees
- Auto-retry for failed tasks
- Task dependencies and ordering
- Custom branch naming
- Integration with GitHub Issues/Projects
- Task templates for common feature types
