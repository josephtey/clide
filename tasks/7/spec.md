# Task #7: Build Cortex Phase 1 MVP - Shared Context MCP Tool

**Repository:** cortex
**Student:** Grace (Product Builder, focus: shared context layer for teams)
**Status:** PLANNING
**Created:** 2026-02-01

---

## Product Vision (from Grace's Context)

**Target Users:** ARC Institute DNA language model researchers - close-knit research team working on related experiments

**Core Problem:** Research knowledge currently evaporates after experiments. Lab notebooks are done terribly, knowledge is everywhere and nowhere. Scientific institutions have massive organizational dysfunction around knowledge management.

**Solution:** Headless MCP tool that runs transparently alongside Claude Code, capturing experimental context through conversation streams (highly information-dense medium). Creates shared lab notebook for team without requiring special UI.

**Phase 1 Approach:** User-controlled selective capture (not automatic). Researchers explicitly mark moments worth saving to shared notebook. Reduces privacy concerns and ensures quality signal.

**Key Insights from Grace:**
- Claude Code conversations contain rich experimental context (every prompt, result, iteration)
- Shared context can "infiltrate" through universal Claude Code adoption
- Structure should emerge from usage patterns (start simple, evolve to knowledge graph)
- Privacy is less critical within focused research team
- ARC deployment is validation experiment for security, trust, behavioral patterns

---

## Repository Status

**Current State:** Fresh, empty repository
- Only README.md exists (title only)
- No code, dependencies, or configuration
- Clean slate for Phase 1 implementation

---

## System Architecture

### High-Level Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                      Research Team (ARC DNA LM)                  │
└─────────────────────────────────────────────────────────────────┘
                                  │
        ┌─────────────────────────┼─────────────────────────┐
        │                         │                         │
┌───────▼────────┐      ┌─────────▼────────┐      ┌────────▼───────┐
│  Researcher A  │      │  Researcher B    │      │  Researcher C  │
│  (Claude Code) │      │  (Claude Code)   │      │  (Claude Code) │
└───────┬────────┘      └─────────┬────────┘      └────────┬───────┘
        │                         │                         │
        │  MCP stdio              │  MCP stdio              │  MCP stdio
        │  protocol               │  protocol               │  protocol
        │                         │                         │
┌───────▼─────────────────────────▼─────────────────────────▼───────┐
│                        Cortex MCP Server                           │
│                       (runs per researcher)                        │
│  ┌──────────────────────────────────────────────────────────┐    │
│  │  MCP Protocol Layer                                       │    │
│  │  • save-context tool                                      │    │
│  │  • query-context tool                                     │    │
│  │  • list-recent-context tool                               │    │
│  └────────────────┬─────────────────────────────────────────┘    │
│                   │                                                │
│  ┌────────────────▼─────────────────────────────────────────┐    │
│  │  Business Logic Layer                                     │    │
│  │  • Context validation & ID generation                     │    │
│  │  • Text search across title/content/tags                  │    │
│  │  • Recent context filtering & pagination                  │    │
│  └────────────────┬─────────────────────────────────────────┘    │
│                   │                                                │
│  ┌────────────────▼─────────────────────────────────────────┐    │
│  │  Storage Layer (with file locking)                        │    │
│  │  • Append-only event log operations                       │    │
│  │  • Concurrent write handling                              │    │
│  │  • JSON read/write with atomic operations                 │    │
│  └────────────────┬─────────────────────────────────────────┘    │
└────────────────────┼──────────────────────────────────────────────┘
                     │
                     │  Shared storage
                     │  (network mount or local)
                     │
          ┌──────────▼──────────┐
          │  ~/.cortex/          │
          │  ├── config.json     │
          │  └── lab-notebook.json │
          └─────────────────────┘
                     │
          ┌──────────▼──────────────┐
          │  Event Log Structure    │
          │  [append-only array]    │
          │                         │
          │  • Context Moment 1     │
          │  • Context Moment 2     │
          │  • Context Moment 3     │
          │  • ...                  │
          └─────────────────────────┘
```

### Component Descriptions

**Cortex MCP Server:**
- Lightweight Node.js process running per researcher
- Communicates with Claude Code via stdio MCP protocol
- Stateless - all state in shared JSON file
- Handles concurrent access via file locking

**Shared Storage (~/.cortex/):**
- Network-mounted directory (for team access) or local with sync
- `config.json`: Team name, researcher identity, preferences
- `lab-notebook.json`: Append-only event log of context moments

**MCP Protocol Layer:**
- Exposes three tools to Claude Code
- Handles tool invocation and parameter validation
- Returns structured responses per MCP spec

**Business Logic Layer:**
- Context operations (save, query, list)
- Validation using Zod schemas
- Search implementation (text matching)
- ID generation (UUID v4)

**Storage Layer:**
- File I/O with atomic operations
- File locking for concurrent writes
- JSON parsing/serialization
- Directory creation on first run

---

## User Flow Diagrams

### Flow 1: First-Time Setup

```
┌─────────────┐
│ Researcher  │
│ installs    │
│ Cortex MCP  │
└──────┬──────┘
       │
       │ 1. npm install -g cortex-mcp
       │
       ▼
┌─────────────────────────┐
│ Add to Claude Code      │
│ config.json:            │
│ "mcpServers": {         │
│   "cortex": {...}       │
│ }                       │
└──────┬──────────────────┘
       │
       │ 2. Restart Claude Code
       │
       ▼
┌─────────────────────────┐
│ Cortex MCP starts       │
│ • Detects no ~/.cortex/ │
│ • Creates directory     │
│ • Initializes config    │
│ • Creates empty log     │
└──────┬──────────────────┘
       │
       │ 3. Sets researcher name
       │    (from system user or prompt)
       │
       ▼
┌─────────────────────────┐
│ Ready to use!           │
│ Tools available in      │
│ Claude Code             │
└─────────────────────────┘
```

### Flow 2: Saving Context During Experiment

```
┌──────────────────────────────────────────────────────────────┐
│  Researcher working in Claude Code                            │
│  Running DNA sequence experiments...                          │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Discovers insight
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Researcher: "Save this to the lab notebook:                  │
│   Successfully implemented attention masking for DNA          │
│   sequences. Key insight: treating codons as tokens           │
│   improves perplexity by 23%. Tags: attention, DNA"           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Claude recognizes save intent
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Claude Code invokes:                                         │
│  save-context({                                               │
│    title: "Attention masking for DNA sequences",              │
│    content: "Successfully implemented attention masking...",  │
│    tags: ["attention", "DNA", "tokenization"]                 │
│  })                                                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ MCP protocol (stdio)
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Cortex MCP Server:                                           │
│  1. Validates input (Zod schema)                              │
│  2. Generates UUID for context moment                         │
│  3. Creates ContextMoment object with metadata                │
│  4. Acquires file lock on lab-notebook.json                   │
│  5. Reads current log                                         │
│  6. Appends new moment                                        │
│  7. Writes atomically                                         │
│  8. Releases lock                                             │
│  9. Returns success                                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Success response
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Claude: "Saved to lab notebook with ID abc-123.              │
│   Your team can now query this context."                      │
└──────────────────────────────────────────────────────────────┘
                             │
                             │ Researcher continues work
                             │
                             ▼
```

### Flow 3: Querying Team Context

```
┌──────────────────────────────────────────────────────────────┐
│  Different researcher, later in the week                      │
│  Working on related experiment                                │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Needs team knowledge
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Researcher: "What have we learned about attention            │
│   mechanisms for DNA sequences?"                              │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Claude decides to query
                             │ shared lab notebook
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Claude Code invokes:                                         │
│  query-context({                                              │
│    query: "attention mechanisms DNA",                         │
│    tags: ["attention", "DNA"],                                │
│    limit: 10                                                  │
│  })                                                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ MCP protocol (stdio)
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Cortex MCP Server:                                           │
│  1. Validates query parameters                                │
│  2. Reads lab-notebook.json                                   │
│  3. Searches across title + content + tags                    │
│  4. Filters by tag if provided                                │
│  5. Ranks by relevance (simple text match)                    │
│  6. Returns top N results with metadata                       │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Returns array of ContextMoments
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Claude: "Found 3 relevant insights from your team:           │
│                                                               │
│   1. Grace (3 days ago): Attention masking for DNA            │
│      sequences - treating codons as tokens improves           │
│      perplexity by 23%                                        │
│                                                               │
│   2. Researcher B (1 week ago): Multi-head attention          │
│      struggles with long sequences over 10k base pairs        │
│                                                               │
│   3. Researcher C (2 weeks ago): Self-attention layers        │
│      effective for motif detection                            │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Researcher uses insights
                             │ to inform their approach
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Researcher continues experiment with team knowledge          │
└──────────────────────────────────────────────────────────────┘
```

### Flow 4: Browsing Recent Team Activity

```
┌──────────────────────────────────────────────────────────────┐
│  Researcher starts their day                                  │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Wants to see what team
                             │ has been working on
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Researcher: "Show me what the team has been working on       │
│   this week"                                                  │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Claude invokes list tool
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Claude Code invokes:                                         │
│  list-recent-context({                                        │
│    limit: 20                                                  │
│  })                                                           │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ MCP protocol (stdio)
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Cortex MCP Server:                                           │
│  1. Reads lab-notebook.json                                   │
│  2. Sorts moments by timestamp (newest first)                 │
│  3. Returns last N moments                                    │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Returns chronological list
                             │
                             ▼
┌──────────────────────────────────────────────────────────────┐
│  Claude: "Here's recent team activity:                        │
│                                                               │
│   Today:                                                      │
│   • Grace: Implemented attention masking for DNA              │
│   • Researcher B: Tested on long sequences                    │
│                                                               │
│   Yesterday:                                                  │
│   • Researcher C: Fixed gradient explosion issue              │
│   • Grace: Tuned learning rate schedule                       │
│                                                               │
│   3 days ago:                                                 │
│   • Researcher B: Explored different tokenization             │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             │ Researcher gets team awareness
                             │ and can follow up on relevant work
                             │
                             ▼
```

### Concurrency Handling

```
┌─────────────┐         ┌─────────────┐         ┌─────────────┐
│Researcher A │         │Researcher B │         │Researcher C │
│ saves       │         │ saves       │         │ queries     │
│ context     │         │ context     │         │ context     │
└──────┬──────┘         └──────┬──────┘         └──────┬──────┘
       │                       │                       │
       │ save-context          │ save-context          │ query-context
       │                       │                       │
       ▼                       ▼                       ▼
┌──────────────────────────────────────────────────────────────┐
│              Cortex MCP Server Instances                      │
│  (one per researcher)                                         │
└────────┬─────────────────────┬─────────────────────┬─────────┘
         │                     │                     │
         │ 1. Request lock     │ 2. Wait for lock    │ 3. Read only
         │                     │                     │    (no lock)
         ▼                     │                     ▼
┌─────────────────┐            │            ┌─────────────────┐
│ File Lock       │            │            │ Read             │
│ ACQUIRED        │            │            │ lab-notebook.json│
└────────┬────────┘            │            └─────────────────┘
         │                     │
         │ Write moment A      │
         │                     │
         ▼                     │
┌─────────────────┐            │
│ File Lock       │            │
│ RELEASED        │            │
└─────────────────┘            │
                               │
                               ▼
                      ┌─────────────────┐
                      │ File Lock       │
                      │ ACQUIRED        │
                      └────────┬────────┘
                               │
                               │ Write moment B
                               │
                               ▼
                      ┌─────────────────┐
                      │ File Lock       │
                      │ RELEASED        │
                      └─────────────────┘

Result: Both writes succeed, no conflicts. Queries happen concurrently.
```

---

## Technical Architecture

### Technology Stack

**Runtime:**
- Node.js + TypeScript (aligns with MCP ecosystem)
- @modelcontextprotocol/sdk for MCP server implementation

**Storage:**
- JSON file-based storage for Phase 1 (simple, portable)
- Event log structure: append-only captures
- File location: `~/.cortex/lab-notebook.json`

**Dependencies:**
- @modelcontextprotocol/sdk - MCP protocol
- zod - schema validation
- date-fns - timestamp handling
- winston - logging

**Configuration:**
- `~/.cortex/config.json` - team settings, researcher names, privacy preferences

### MCP Tool Interface

**Tool: `save-context`**
```typescript
{
  name: "save-context",
  description: "Save a moment from your Claude Code conversation to the shared lab notebook",
  inputSchema: {
    type: "object",
    properties: {
      title: { type: "string", description: "Short title for this context moment" },
      content: { type: "string", description: "The experimental context to capture" },
      tags: { type: "array", items: { type: "string" }, description: "Tags for categorization (optional)" },
      experiment_id: { type: "string", description: "Related experiment ID (optional)" }
    },
    required: ["title", "content"]
  }
}
```

**Tool: `query-context`**
```typescript
{
  name: "query-context",
  description: "Search the shared lab notebook for relevant experimental context",
  inputSchema: {
    type: "object",
    properties: {
      query: { type: "string", description: "Search query" },
      tags: { type: "array", items: { type: "string" }, description: "Filter by tags (optional)" },
      author: { type: "string", description: "Filter by researcher (optional)" },
      limit: { type: "number", description: "Max results (default: 10)" }
    },
    required: ["query"]
  }
}
```

**Tool: `list-recent-context`**
```typescript
{
  name: "list-recent-context",
  description: "List recent context moments from the team",
  inputSchema: {
    type: "object",
    properties: {
      limit: { type: "number", description: "Max results (default: 20)" },
      author: { type: "string", description: "Filter by researcher (optional)" }
    }
  }
}
```

### Event Log Data Structure

```typescript
interface ContextMoment {
  id: string;                    // UUID
  timestamp: string;             // ISO 8601
  author: string;                // Researcher name
  title: string;                 // Short descriptor
  content: string;               // The captured context
  tags: string[];                // User-defined tags
  experiment_id?: string;        // Optional link to experiment
  related_to?: string[];         // Related context moment IDs (Phase 3)
}

interface LabNotebook {
  team: string;                  // Team name (e.g., "ARC DNA LM")
  created_at: string;
  moments: ContextMoment[];
}
```

---

## Implementation Plan

### Phase 1: Core Infrastructure

**1. Project Setup**
- Initialize TypeScript project with tsconfig.json
- Install dependencies: @modelcontextprotocol/sdk, zod, date-fns, winston
- Set up build system (esbuild or tsc)
- Create package.json with proper scripts

**2. MCP Server Implementation**
- Create `src/server.ts` - main MCP server entry point
- Implement stdio transport for Claude Code integration
- Register three tools: save-context, query-context, list-recent-context
- Add proper error handling and logging

**3. Storage Layer**
- Create `src/storage.ts` - JSON file-based storage manager
- Implement append-only event log pattern
- Add read/write operations with file locking
- Create `~/.cortex/` directory on first run
- Initialize empty lab-notebook.json if doesn't exist

**4. Context Operations**
- Create `src/operations.ts` - business logic for context management
- Implement save operation: validate, generate ID, append to log
- Implement query operation: text search across title + content + tags
- Implement list operation: return recent moments with optional filters

**5. Configuration**
- Create `src/config.ts` - configuration management
- Support `~/.cortex/config.json` for team settings
- Default config includes: team name, researcher name (from system user)
- Allow customization of storage location

**6. Documentation**
- Update README.md with:
  - Product vision and target users
  - Installation instructions
  - Claude Code integration guide
  - Usage examples for each tool
  - Configuration options
  - Phase 1 scope and future roadmap

**7. Testing**
- Create `src/test.ts` - basic integration tests
- Test save-context creates valid moments
- Test query-context returns relevant results
- Test list-recent-context pagination
- Test concurrent writes (file locking)

---

## Files to Create

```
cortex/
├── package.json                    # Dependencies and scripts
├── tsconfig.json                   # TypeScript configuration
├── README.md                       # Documentation (update)
├── src/
│   ├── server.ts                   # MCP server entry point
│   ├── storage.ts                  # JSON file storage layer
│   ├── operations.ts               # Context save/query/list logic
│   ├── config.ts                   # Configuration management
│   ├── types.ts                    # TypeScript interfaces
│   └── test.ts                     # Integration tests
└── .gitignore                      # Ignore node_modules, dist, .cortex

User's home directory:
~/.cortex/
├── config.json                     # User/team configuration
└── lab-notebook.json               # Shared context storage
```

---

## Integration with Claude Code

**How Users Interact:**

1. **Setup:** Install cortex MCP server, add to Claude Code config
2. **During Work:** While experimenting in Claude Code, when researcher hits a valuable insight:
   ```
   User: "Save this to the lab notebook: Successfully implemented attention masking for DNA sequences. Key insight: treating codons as tokens improves perplexity by 23%."

   Claude: [Uses save-context tool] Saved to lab notebook with tags: attention, DNA, tokenization
   ```

3. **Retrieving Context:**
   ```
   User: "What have we learned about attention mechanisms?"

   Claude: [Uses query-context tool] Found 3 related moments from the team:
   - Grace (3 days ago): Attention masking for DNA sequences...
   - Researcher B (1 week ago): Multi-head attention struggles with long sequences...
   ```

**Configuration in Claude Code:**
Add to `~/.claude/config.json`:
```json
{
  "mcpServers": {
    "cortex": {
      "command": "node",
      "args": ["/path/to/cortex/dist/server.js"],
      "env": {}
    }
  }
}
```

---

## Success Criteria

**Phase 1 MVP is complete when:**

1. ✅ MCP server runs stably alongside Claude Code
2. ✅ Researchers can save context moments with title, content, tags
3. ✅ Query functionality returns relevant results from shared notebook
4. ✅ List functionality shows recent team activity
5. ✅ Storage persists correctly across sessions
6. ✅ Multiple researchers can contribute to same lab notebook
7. ✅ README documents installation and usage clearly
8. ✅ Basic tests validate core functionality

**Non-Goals for Phase 1:**
- ❌ Automatic context detection (Phase 2)
- ❌ Knowledge graph with smart linking (Phase 3)
- ❌ Web UI for browsing context
- ❌ Real-time notifications
- ❌ Advanced search (semantic similarity)
- ❌ Export/import functionality
- ❌ Multi-team support (future: multiple lab notebooks)

---

## Future Phases (Reference)

**Phase 2:** Intelligent auto-detection of valuable moments
- Heuristics for detecting experimental insights
- Prompt user to save high-value context
- Learn from user acceptance/rejection patterns

**Phase 3:** Emergent knowledge graph
- Detect similar experiments across researchers
- Identify contradictory results
- Link related hypotheses
- Surface patterns: "Three researchers ran similar experiments"

---

## Open Questions

1. **Team Configuration:** How do researchers identify themselves? System username, config file, or prompt on first use?
2. **Privacy Controls:** Should Phase 1 include any opt-out or selective sharing within team?
3. **Search Quality:** Is simple text matching sufficient for Phase 1, or should we include basic relevance scoring?
4. **Storage Limits:** Should we implement log rotation or archival for very large notebooks?

---

## Verification Plan

**After Implementation:**

1. **Local Testing:**
   - Run `npm run build` to compile TypeScript
   - Start MCP server: `node dist/server.js`
   - Test stdio communication manually
   - Run integration tests: `npm test`

2. **Claude Code Integration:**
   - Add cortex to Claude Code config
   - Restart Claude Code
   - Verify cortex tools appear in tool list
   - Test save-context: save a context moment
   - Test query-context: search for saved context
   - Test list-recent-context: view recent moments
   - Check `~/.cortex/lab-notebook.json` contains saved data

3. **Multi-User Simulation:**
   - Edit config.json to change researcher name
   - Save contexts as different researchers
   - Verify query returns all researchers' contexts
   - Verify list shows multi-user timeline

4. **Edge Cases:**
   - Test concurrent saves (multiple Claude instances)
   - Test empty query results
   - Test malformed inputs
   - Test storage file corruption recovery

---

## Implementation Notes for Grace

**Context from Previous Conversations:**
- You've identified ARC Institute as the perfect validation environment
- You understand this is about automating knowledge infrastructure, not research itself
- You know research institutions are poorly organized and this solves acute pain
- You've designed the three-phase rollout: selective capture → auto-detection → knowledge graph
- You recognize Claude Code conversations as information-dense capture medium

**Your Product Instincts:**
- Start simple, let structure emerge from usage
- Build trust first with user control
- Focus on real-world validation at ARC to learn about security, psychology, behavior
- Don't over-engineer Phase 1 - get it into researchers' hands

**Technical Approach:**
- Headless architecture (no UI coupling)
- Runs transparently via MCP
- Simple append-only event log
- Text-based search for Phase 1 (good enough)
- JSON storage (portable, inspectable)

**What Makes This Succeed:**
- Getting deployed at ARC quickly
- Real researchers using it daily
- Capturing genuine experimental insights
- Learning what actually gets saved vs. theory
- Understanding trust and privacy dynamics in practice
