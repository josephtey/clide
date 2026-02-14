# Student Context Management

Clide operates as a research lab with three student agents: Grace, Woody, and Rio. Each student accumulates context, learnings, and decision history as they work on tasks. This persistent memory allows students to build intuition and maintain continuity across projects.

## Student Profiles

Each student has a context file in `data/students/{name}.json`:

```json
{
  "name": "Grace",
  "role": "Product Builder",
  "focus": "Building a shared context layer for teams",
  "repo": null,
  "context": {
    "decisions": [],
    "learnings": [],
    "project_state": "Current project status",
    "last_updated": "timestamp",
    "conversations": []
  },
  "task_history": []
}
```

## Student-Task Assignment

**Mapping students to repositories:**

- **Grace**: No specific repo yet (working on context MCP product concept)
- **Woody**: `beyond-agents` repository
- **Rio**: `joetey.com` repository (floating, helps with various projects)

When assigning a task, determine which student should own it based on the repository.

## Context Accumulation Workflow

### During Task Execution

In the sub-agent prompt, include instructions to document:
- Key architectural decisions made
- Technical learnings and insights
- Tradeoffs considered
- Patterns discovered or established

### After Task Completion

1. Read the agent log from `tasks/{id}/agent.log`
2. Extract decisions, learnings, and insights
3. Update the appropriate student's context file in `data/students/{name}.json`:
   - Add to `decisions` array: `{task_id, decision, rationale, timestamp}`
   - Add to `learnings` array: `{task_id, learning, context, timestamp}`
   - Update `project_state` to reflect current understanding
   - Add task to `task_history`: `{task_id, title, completed_at, outcome}`
   - Set `last_updated` to current timestamp

### Context Structure

```json
{
  "decisions": [
    {
      "task_id": 1,
      "decision": "Chose Tailwind over styled-components for styling",
      "rationale": "Project already uses Tailwind extensively; consistency matters",
      "timestamp": "2026-02-01T10:30:00Z"
    }
  ],
  "learnings": [
    {
      "task_id": 1,
      "learning": "Server actions in Next.js 14 require 'use server' directive",
      "context": "Encountered bug when implementing form submission",
      "timestamp": "2026-02-01T10:45:00Z"
    }
  ],
  "project_state": "Built out initial dashboard UI. Next: implement real-time updates via SSE",
  "task_history": [
    {
      "task_id": 1,
      "title": "Add real-time task updates to dashboard",
      "completed_at": "2026-02-01T11:00:00Z",
      "outcome": "success"
    }
  ]
}
```

## Providing Context to Future Tasks

When assigning a new task to a student:

1. Read the student's context file from `data/students/{name}.json`
2. Include relevant context in the sub-agent prompt:

```
STUDENT CONTEXT:
You are {student_name}, a {role} working on {focus}.

Your accumulated knowledge:
- Previous decisions: {summary of relevant decisions}
- Key learnings: {summary of relevant learnings}
- Current project state: {project_state}

IMPORTANT: Use this context to inform your approach. You are developing taste and preferences through experience:
- Apply patterns and approaches that worked well in previous tasks
- Avoid approaches that the PI didn't like or that caused issues
- Make design decisions consistent with established preferences
- When facing similar situations, default to previously successful solutions
- Build on your accumulated understanding of what the PI values (minimalism, performance, simplicity, etc.)

Your accumulated context represents your growing intuition about this codebase and the PI's preferences. Trust it and apply it.
```

## Taste and Preference Accumulation

Students should actively build up taste preferences through their work. This happens in two ways:

### 1. During Task Execution
When the sub-agent makes architectural or design decisions, they should reference similar past decisions and follow established patterns.

### 2. After Refinements
When the PI requests changes (especially via refinements), these represent explicit feedback about taste:
- If PI says "remove this intro" → they prefer minimalism
- If PI says "use this color instead" → they have color preferences
- If PI says "this is too complex" → they value simplicity

Extract these preferences and add them to the student's context:
```json
{
  "task_id": X,
  "learning": "PI prefers ultra-minimal UIs without unnecessary introductory text",
  "context": "Asked to remove stream page intro/header for cleaner aesthetic",
  "timestamp": "..."
}
```

**Key principle**: Every refinement request is a teaching moment. Students should remember not just what was built, but what the PI liked and didn't like about it.

## Extracting Context from Agent Logs

After task completion, parse the agent log to extract:

- **Decisions**: Look for architectural choices, technology selections, design patterns
- **Learnings**: Technical discoveries, gotchas, best practices
- **Project state**: What was built, what's next

Use AI to analyze the log and extract structured context. Be thorough - this builds the student's long-term memory.
