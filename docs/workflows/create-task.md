# Create Task Workflow

## User Input Patterns
- "Create task for `<repo-name>`: `<title>`. `<description>`"
- "Add task for `<repo-name>`: `<title>`. `<description>`"
- "New task for `<repo-name>`: `<title>`. `<description>`"

## Workflow Steps

### 1. Enter Plan Mode
- Use the `EnterPlanMode` tool to start a planning session
- This allows you to have a conversation with the user to clarify requirements

### 2. Planning Phase (in plan mode)
- Explore the target repository to understand existing patterns
- Ask clarifying questions about:
  - Exact requirements and edge cases
  - UI/UX preferences
  - Technology choices (if applicable)
  - Integration points with existing code
  - Testing expectations
- Use `Read`, `Glob`, `Grep` tools to understand the codebase
- Draft the implementation plan collaboratively with user

### 3. Create Spec File
- The plan mode document becomes the spec file
- Create directory `tasks/{id}/` (get next_id from data/tasks.json first)
- Write the plan to `tasks/{id}/spec.md`
- Include:
  - Task title and ID
  - Repository information
  - Detailed requirements from planning conversation
  - Implementation approach agreed upon with user
  - Files to modify/create
  - Success criteria
- Use `ExitPlanMode` when the spec is complete

### 4. Register Task
- Read `data/tasks.json` to get the next task ID
- Resolve repository path from `data/repos.json` (ask user if unknown)
- Update `data/tasks.json`:
  - Add new task object with status "todo"
  - Increment `next_id`
  - Set `created_at` timestamp
  - Reference the spec file created in plan mode
- Confirm task creation with ID and spec file path

## Validation Rules
- Repository name must be provided
- Title must be non-empty
- Spec file must be created through plan mode first
- Repository path must exist (or be confirmed by user)

## Spec File Format

```markdown
# Task #{id}: {title}

**Repository:** {repo}
**Status:** TODO
**Created:** {timestamp}

## Requirements

{detailed requirements from planning conversation}

## Implementation Approach

{approach agreed upon with user, including:}

- Files to modify: path/to/file1.ts, path/to/file2.tsx
- New files to create: path/to/newfile.ts
- Key implementation steps
- Technology/library choices

## Implementation Details

{specific details discovered during codebase exploration:}

- Existing patterns to follow
- Components/functions to integrate with
- Styling approach (CSS modules, Tailwind, etc.)
- State management approach

## Success Criteria

- Feature works as described
- No breaking changes to existing functionality
- Code follows repository conventions
- All tests pass (if applicable)
- {any additional criteria from planning}
```

## Important Notes
- **ALWAYS use plan mode** for task creation - never generate specs without user input
- The planning conversation ensures specs are clear and actionable
- User approves the plan before the task is registered
