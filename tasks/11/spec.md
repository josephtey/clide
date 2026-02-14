# Task #11: Set Up Rosalind Agent SDK and CLI

**Repository:** rosalind
**Status:** TODO
**Created:** 2026-02-13T00:00:00Z

## Context

Rosalind is a new project focused on combining LLM agents with biological foundation models (bio FMs) for protein design and biological discovery. Currently, the repository contains only a comprehensive README outlining the vision - there is no code yet.

This task establishes the foundational infrastructure: a Python-based agent SDK using the Anthropic SDK, with an interactive CLI for testing and development. The SDK will use a decorator-based approach for tool definition (to be populated in future tasks), and the CLI will provide an interactive chat loop for conversing with the agent.

## Requirements

### Technology Stack
- **Language**: Python 3.11+
- **Agent SDK**: Anthropic Python SDK (`anthropic`)
- **CLI Framework**: Typer (modern, type-safe CLI framework)
- **Project Management**: pyproject.toml (modern Python packaging)

### Project Structure

```
rosalind/
├── pyproject.toml              # Project metadata and dependencies
├── README.md                   # Existing vision document
├── .env.example                # Example environment variables
├── .gitignore                  # Git ignore patterns
├── src/
│   └── rosalind/
│       ├── __init__.py         # Package initialization
│       ├── agent.py            # Core agent class and logic
│       ├── tools.py            # Tool decorator and registry
│       ├── cli.py              # Typer CLI implementation
│       └── config.py           # Configuration management
└── tests/
    └── __init__.py             # Test package
```

## Implementation Approach

### Core Components

#### 1. Tool System (`src/rosalind/tools.py`)

**Purpose**: Provide a decorator-based system for defining tools that the agent can use.

**Design**:
- `@tool` decorator to mark functions as agent tools
- Automatic extraction of function signature, docstring, and type hints
- Convert Python function to Anthropic tool schema format
- Tool registry to track all registered tools

**Example usage (for future tasks)**:
```python
from rosalind.tools import tool

@tool
def predict_protein_structure(sequence: str) -> dict:
    """Predict the 3D structure of a protein from its sequence.

    Args:
        sequence: Amino acid sequence (single-letter codes)

    Returns:
        Predicted structure data including coordinates and confidence
    """
    # Implementation will be added in future tasks
    pass
```

**Key functions**:
- `tool(func)` - decorator that registers a function as a tool
- `get_tool_definitions()` - returns list of all tools in Anthropic schema format
- `execute_tool(name, arguments)` - executes a tool by name with given args

#### 2. Agent Class (`src/rosalind/agent.py`)

**Purpose**: Wrapper around Anthropic SDK that manages the agent conversation loop and tool calling.

**Design**:
- Initialize with API key and model configuration
- Maintain conversation history (messages list)
- Implement tool calling loop:
  1. Send user message + available tools to Claude
  2. If Claude wants to use a tool, execute it
  3. Send tool result back to Claude
  4. Repeat until Claude produces a final text response
- Handle errors and edge cases gracefully

**Key class**:
```python
class RosalindAgent:
    def __init__(self, api_key: str, model: str = "claude-sonnet-4-5-20250929"):
        self.client = anthropic.Anthropic(api_key=api_key)
        self.model = model
        self.conversation_history = []

    def chat(self, user_message: str) -> str:
        """Send a message and get agent response (with tool calling loop)."""
        # Implementation details...

    def reset(self):
        """Clear conversation history."""
        self.conversation_history = []
```

#### 3. Configuration (`src/rosalind/config.py`)

**Purpose**: Manage API keys and agent configuration.

**Design**:
- Load API key from environment variable `ANTHROPIC_API_KEY`
- Provide default model configuration
- Support custom model/temperature overrides

**Key functions**:
- `get_api_key()` - retrieves API key from env
- `get_default_config()` - returns default agent configuration

#### 4. CLI (`src/rosalind/cli.py`)

**Purpose**: Interactive command-line interface for chatting with the agent.

**Design**:
- Use Typer for CLI framework
- Interactive chat loop (REPL-style)
- Display agent responses with nice formatting
- Handle Ctrl+C gracefully
- Commands:
  - `rosalind chat` - start interactive chat session (default command)
  - `rosalind reset` - clear conversation history
  - `exit` or `quit` within chat to exit

**Key features**:
- Show welcome message with instructions
- Display "You: " and "Agent: " prefixes for clarity
- Show tool usage when agent calls tools (for transparency)
- Color-coded output for better UX (optional, using rich library)

#### 5. Dependencies (`pyproject.toml`)

**Core dependencies**:
- `anthropic` - Anthropic Python SDK
- `typer[all]` - CLI framework with all features
- `python-dotenv` - Load .env files for API keys
- `rich` (optional) - Pretty terminal output

**Dev dependencies**:
- `pytest` - Testing framework
- `black` - Code formatting
- `ruff` - Fast Python linter

#### 6. Environment Setup

**`.env.example`**:
```
ANTHROPIC_API_KEY=sk-ant-...
ROSALIND_MODEL=claude-sonnet-4-5-20250929
```

**`.gitignore`**:
- `.env`
- `__pycache__/`
- `*.pyc`
- `.pytest_cache/`
- `dist/`, `build/`, `*.egg-info/`

## Implementation Details

### Implementation Steps

1. **Set up Python project structure**
   - Create `pyproject.toml` with project metadata
   - Set up `src/rosalind/` package structure
   - Create `__init__.py` files
   - Add `.env.example` and `.gitignore`

2. **Implement tool system** (`src/rosalind/tools.py`)
   - Create `@tool` decorator
   - Implement tool registry (global list/dict)
   - Add function to convert Python function to Anthropic tool schema
   - Add `get_tool_definitions()` to retrieve all tools
   - Add `execute_tool()` to dispatch tool calls

3. **Implement agent class** (`src/rosalind/agent.py`)
   - Create `RosalindAgent` class
   - Implement `chat()` method with tool calling loop
   - Handle tool use blocks from Claude
   - Manage conversation history
   - Add error handling and logging

4. **Implement configuration** (`src/rosalind/config.py`)
   - Load API key from environment
   - Provide default model config
   - Add validation and helpful error messages

5. **Implement CLI** (`src/rosalind/cli.py`)
   - Create Typer app
   - Implement interactive chat loop
   - Add welcome message and instructions
   - Handle exit commands
   - Add basic formatting for messages

6. **Set up package entry point**
   - Configure `pyproject.toml` to create `rosalind` command
   - Point to CLI main function

7. **Add README updates**
   - Add "Getting Started" section
   - Installation instructions
   - Usage examples
   - API key setup guide

### Critical Files

- **New files to create**:
  - `pyproject.toml` - Project configuration
  - `.env.example` - Example environment variables
  - `.gitignore` - Git ignore patterns
  - `src/rosalind/__init__.py` - Package init
  - `src/rosalind/agent.py` - Agent implementation
  - `src/rosalind/tools.py` - Tool decorator and registry
  - `src/rosalind/cli.py` - CLI interface
  - `src/rosalind/config.py` - Configuration management
  - `tests/__init__.py` - Test package

- **Files to update**:
  - `README.md` - Add getting started section

### Tool Definition Example

For future reference, here's how tools will be defined once this SDK is set up:

```python
# In future task: src/rosalind/bio_tools.py
from rosalind.tools import tool

@tool
def predict_structure(sequence: str) -> dict:
    """Predict protein structure from sequence using ESM-2."""
    # Implementation will be added later
    pass

@tool
def optimize_sequence(target: str, constraints: list[str]) -> str:
    """Optimize protein sequence for target property."""
    # Implementation will be added later
    pass
```

The SDK will automatically discover and register these tools for the agent.

## Success Criteria

After implementation, verify the setup works:

1. **Install the package**:
   ```bash
   ssh chimera-gpu-agent 'cd /home/joetey/rosalind && pip install -e .'
   ```

2. **Set API key**:
   ```bash
   ssh chimera-gpu-agent 'cd /home/joetey/rosalind && echo "ANTHROPIC_API_KEY=sk-ant-..." > .env'
   ```

3. **Run interactive chat**:
   ```bash
   ssh chimera-gpu-agent 'cd /home/joetey/rosalind && rosalind chat'
   ```

4. **Test agent responds**:
   - Type: "Hello! Can you help me understand protein structures?"
   - Agent should respond naturally
   - Type: "exit" to quit

5. **Verify tool system is ready** (no tools yet, but registry should work):
   - In Python REPL:
     ```python
     from rosalind.tools import get_tool_definitions
     print(get_tool_definitions())  # Should return empty list
     ```

6. **Success criteria**:
   - CLI launches without errors
   - Agent responds to messages
   - Conversation history is maintained
   - Tool registry is functional (even if empty)
   - Exit commands work properly
   - Code follows Python best practices

## Future Extensions

This foundation enables:
- Adding bio FM tool integrations (ESM-2, ProGen2, etc.)
- Implementing multi-step agent workflows
- Adding result caching and optimization
- Building web interface on top of agent SDK
- Creating specialized agents for different bio tasks

## Remote Repository Instructions

**IMPORTANT - REMOTE REPOSITORY:**
This repository is located on a remote GPU cluster. All operations must be executed via SSH.

**SSH Host:** chimera-gpu-agent
**Repository Path:** /home/joetey/rosalind

**ALL Bash commands must use this pattern:**
```bash
ssh chimera-gpu-agent 'cd /home/joetey/rosalind && YOUR_COMMAND_HERE'
```

**Examples:**
- Check status: `ssh chimera-gpu-agent 'cd /home/joetey/rosalind && git status'`
- Run tests: `ssh chimera-gpu-agent 'cd /home/joetey/rosalind && pytest tests/'`
- Install deps: `ssh chimera-gpu-agent 'cd /home/joetey/rosalind && pip install -e .'`

**For file operations:**
- Read: `ssh chimera-gpu-agent 'cat /home/joetey/rosalind/file.py'`
- Write: `ssh chimera-gpu-agent 'cat > /home/joetey/rosalind/file.py' <<'EOF'
  [content]
  EOF`

**CRITICAL:** Never execute commands locally for this repository. Always use SSH.
You have full access to the cluster's GPU resources for training, testing, etc.
