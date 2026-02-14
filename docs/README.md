# Clide Documentation

This directory contains detailed workflow documentation and reference materials for the Clide system.

## Structure

```
docs/
├── workflows/          # Step-by-step workflow guides
│   ├── create-task.md
│   ├── assign-task.md
│   ├── refine-task.md
│   ├── approve-task.md
│   ├── merge-queue.md
│   ├── chat-with-student.md
│   └── let-it-rip.md
└── reference/          # Reference documentation
    ├── testing-guide.md
    ├── student-context.md
    ├── remote-repos.md
    └── file-schemas.md
```

## Workflows

Each workflow document contains:
- User input patterns that trigger the workflow
- Step-by-step execution process
- Validation rules
- Error handling
- Examples

**Core workflows:**
- **[create-task.md](workflows/create-task.md)** - Planning and specification creation
- **[assign-task.md](workflows/assign-task.md)** - Task execution via sub-agents
- **[refine-task.md](workflows/refine-task.md)** - Iterative improvements in staging
- **[approve-task.md](workflows/approve-task.md)** - Completion and merge queueing
- **[merge-queue.md](workflows/merge-queue.md)** - Branch merging to main
- **[chat-with-student.md](workflows/chat-with-student.md)** - Direct student conversations
- **[let-it-rip.md](workflows/let-it-rip.md)** - Fast-track for simple tasks

## Reference Documentation

**[testing-guide.md](reference/testing-guide.md)**
- When and how to use Playwright testing
- Test script structure and examples
- Bug fix workflow with testing
- Integration with refinement process

**[student-context.md](reference/student-context.md)**
- Student profile structure
- Context accumulation workflow
- Taste and preference learning
- How to extract learnings from agent logs

**[remote-repos.md](reference/remote-repos.md)**
- Detecting remote repositories
- SSH command execution patterns
- File operations on remote machines
- Sub-agent instructions for remote work

**[file-schemas.md](reference/file-schemas.md)**
- Complete JSON schemas for all data files
- State transition diagrams
- Field descriptions and examples

## Prompts

The `prompts/` directory contains templates for sub-agent prompts:
- `task-assignment.template.md` - Standard task execution prompt
- `task-refinement.template.md` - Refinement iteration prompt
- `remote-repo-instructions.template.md` - Remote repository instructions

## Main Documentation

See [../CLAUDE.md](../CLAUDE.md) for the main system overview and quick reference.
