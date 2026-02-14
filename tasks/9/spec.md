# Task #9: Setup Rosalind README

**Repository:** rosalind
**Status:** TODO
**Created:** 2026-02-12T00:00:00Z

## Context

The rosalind repository is a new project exploring the intersection of AI agents and biological foundation models, specifically focused on protein design/engineering and biological discovery workflows. Currently, the repo only contains a minimal README with just the title "# rosalind".

This task will establish the project vision and research direction by creating a comprehensive README that:
1. Articulates the vision for agent-assisted biological workflows
2. Documents research on gLM2 (genomic language models) and their interplay with agents
3. Explores specific use cases in protein design and biological discovery

**Why this matters**: Establishing a clear vision document will guide future development and research directions for integrating LLM agents with bio foundation models.

## Current State

**Repository**: rosalind
- Current README: Only contains `# rosalind`
- Git history: Single commit ("first commit")
- No other files present

## Implementation Plan

### 1. Structure the README

Create a project vision document with the following sections:

**Header**
- Project name and tagline
- Brief description of the vision (agents + bio FMs)

**Vision Section**
- Core thesis: Why combine agents with biological foundation models?
- Target workflows: protein design/engineering, biological discovery
- Potential impact and applications

**Bio FM Tools: gLM2 Research**
- Overview of gLM2 (genomic language models)
- Capabilities and applications
- Current limitations and opportunities for agent augmentation

**Agent-FM Interplay**
- How agents can enhance bio FM workflows:
  - Iterative design loops (generate → predict → refine)
  - Hypothesis generation and testing
  - Literature integration and knowledge synthesis
  - Experiment planning and parameter optimization
- Specific workflow examples:
  - Protein engineering: agent-guided sequence optimization using FM predictions
  - Biological discovery: multi-step reasoning over FM outputs + literature

**Future Directions**
- Research questions to explore
- Potential integrations and tools to build
- Open challenges

### 2. File to Modify

- **`README.md`** (repository root)

### 3. Implementation Steps

1. Read current README.md to understand existing content
2. Write new comprehensive README.md with the structure outlined above

### 4. Content Guidelines

- **Tone**: Vision-oriented but grounded in concrete use cases
- **Length**: Comprehensive but scannable (~200-400 lines)
- **Technical depth**: High-level vision with enough technical detail to be actionable
- **Citations**: Include references to relevant papers/tools where appropriate
- **Forward-looking**: Emphasize potential and open questions, not just current state

### 5. Verification

- Verify README contains all required sections
- Ensure markdown formatting is correct
- Confirm content is comprehensive but scannable

## Critical Files

- `README.md` (repository root - only file to modify)

## Success Criteria

- Comprehensive README with clear vision for agents + bio FMs
- Includes research on gLM2 and agent-FM interplay
- Specific use cases and workflow examples documented
- Future research directions outlined
- Changes committed and pushed to main branch
- No breaking changes to existing setup
