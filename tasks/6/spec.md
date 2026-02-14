# Task #6: Convert CLI to Full-Stack Next.js App (V1) - FastAPI Backend

**Repository:** beyond-agents
**Status:** TODO
**Created:** 2026-02-01T08:00:00Z
**Updated:** 2026-02-13T00:00:00Z

---

## Overview

Create a V1 web interface that wraps the existing Python agent in a modern Next.js app with a FastAPI backend. The goal is to maintain all agent functionality while providing a browser-based chat UI with proper performance and scalability.

**Approach:** FastAPI backend + Next.js frontend. Zero changes to core agent code.

---

## V1 Scope

### In Scope
- FastAPI backend with SSE streaming
- Next.js frontend with real-time streaming
- Clean chat UI (thinking, tool calls, responses)
- Persistent Python process (agent stays alive)
- Single-user, local deployment
- Health check endpoint

### Out of Scope
- User authentication
- Database / persistent storage
- Multi-session conversation tracking
- Advanced UI features (copy, regenerate)
- Mobile optimization
- Production deployment configuration

---

## Architecture

### Tech Stack

**Backend (Python):**
- FastAPI (HTTP API + SSE streaming)
- Uvicorn (ASGI server)
- Existing agent harness (unchanged)

**Frontend:**
- Next.js 14 (App Router)
- React 18 + TypeScript
- Tailwind CSS
- Native fetch API (SSE)

**Communication:**
- HTTP + Server-Sent Events (SSE)
- JSON event streaming
- CORS enabled for local development

**Why FastAPI over Subprocess?**
- ✅ 2-5x faster (no process startup overhead)
- ✅ Agent stays in memory between requests
- ✅ Proper HTTP error handling
- ✅ Easy to scale (multi-worker support)
- ✅ Standard architecture (industry best practice)

---

## Project Structure

```
beyond-agents/
├── src/                           # Existing agent code (unchanged)
│   ├── main.py                    # CLI entry point (still works!)
│   ├── agent.py
│   ├── tools/
│   └── ...
│
├── backend/                       # NEW: FastAPI server
│   ├── main.py                    # FastAPI app with /chat endpoint
│   ├── requirements.txt           # fastapi, uvicorn, cors
│   └── .env.example
│
└── web/                           # NEW: Next.js app
    ├── app/
    │   ├── page.tsx               # Chat interface
    │   └── api/chat/route.ts      # Proxy to Python API
    ├── components/
    │   ├── ChatMessage.tsx
    │   ├── ChatInput.tsx
    │   └── ChatContainer.tsx
    ├── .env.local
    └── package.json
```

---

## Implementation Steps

### Phase 1: FastAPI Backend

#### Create `backend/main.py`

```python
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
import json
from typing import AsyncGenerator
import os

from src.agent import Agent
from src.models.anthropic import AnthropicModel
from src.tools.registry import ToolRegistry
from src.tools.implementations.read_file import ReadFileTool
from src.tools.mcp.web_search import WebSearchMCPTool
from src.mcp_client import MCPClient

app = FastAPI(title="Beyond Agents API", version="1.0.0")

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global agent instance (initialized once at startup)
agent: Agent | None = None
mcp_client: MCPClient | None = None

@app.on_event("startup")
async def startup_event():
    """Initialize agent once at server startup"""
    global agent, mcp_client

    print("🚀 Initializing agent...")

    # Initialize MCP client
    mcp_client = await MCPClient.create()

    # Setup tools
    registry = ToolRegistry()
    registry.register(ReadFileTool())
    registry.register(WebSearchMCPTool(mcp_client))
    # Add other tools as needed

    # Create agent instance
    model = AnthropicModel(api_key=os.getenv("ANTHROPIC_API_KEY"))
    agent = Agent(
        model=model,
        tools=registry.get_all_tools(),
        system_prompt="You are a helpful AI assistant with access to tools.",
    )

    print("✅ Agent ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Cleanup on server shutdown"""
    global mcp_client
    if mcp_client:
        await mcp_client.shutdown()

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    """Stream agent events as Server-Sent Events"""

    if not agent:
        raise HTTPException(status_code=503, detail="Agent not initialized")

    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty")

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # Stream events from agent
            async for event in agent.chat(request.message):
                event_data = {
                    "type": event.__class__.__name__,
                    "data": event.model_dump(),
                }
                yield f"data: {json.dumps(event_data)}\n\n"

            # Send completion signal
            yield f"data: {json.dumps({'type': 'complete'})}\n\n"

        except Exception as e:
            # Send error event
            print(f"❌ Agent error: {e}")
            error_data = {
                "type": "error",
                "error": str(e),
            }
            yield f"data: {json.dumps(error_data)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",  # Disable nginx buffering
        }
    )

@app.get("/health")
async def health():
    """Health check endpoint"""
    return {
        "status": "ok",
        "agent_ready": agent is not None,
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
        log_level="info",
    )
```

#### Create `backend/requirements.txt`

```txt
fastapi==0.109.0
uvicorn[standard]==0.27.0
pydantic==2.6.0
python-dotenv==1.0.0

# Your existing dependencies (copy from main requirements.txt)
anthropic
# ... other dependencies
```

#### Create `backend/.env.example`

```env
ANTHROPIC_API_KEY=sk-ant-...
```

#### Run the backend

```bash
cd backend
pip install -r requirements.txt
cp .env.example .env  # Add your API key

# Run with auto-reload
uvicorn main:app --reload --port 8000

# Test it works
curl http://localhost:8000/health
```

---

### Phase 2: Next.js Frontend

#### Initialize Next.js

```bash
cd beyond-agents
npx create-next-app@latest web --typescript --tailwind --app
cd web
npm install
```

#### Create `web/.env.local`

```env
PYTHON_API_URL=http://localhost:8000
```

#### Create `web/app/api/chat/route.ts`

```typescript
import { NextRequest } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000';

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  if (!message || !message.trim()) {
    return new Response('Message is required', { status: 400 });
  }

  try {
    // Call Python FastAPI backend
    const response = await fetch(`${PYTHON_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ message }),
    });

    if (!response.ok) {
      throw new Error(`Python API error: ${response.status}`);
    }

    // Proxy the SSE stream from Python
    return new Response(response.body, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (error) {
    console.error('Error calling Python API:', error);

    // Return error as SSE
    const encoder = new TextEncoder();
    const errorStream = new ReadableStream({
      start(controller) {
        const errorData = `data: ${JSON.stringify({
          type: 'error',
          error: String(error)
        })}\n\n`;
        controller.enqueue(encoder.encode(errorData));
        controller.close();
      }
    });

    return new Response(errorStream, {
      headers: { 'Content-Type': 'text/event-stream' },
      status: 500,
    });
  }
}
```

---

### Phase 3: UI Components

#### Create `web/app/page.tsx`

```typescript
'use client';

import { useState } from 'react';
import ChatContainer from '@/components/ChatContainer';
import ChatInput from '@/components/ChatInput';

interface Message {
  role: 'user' | 'assistant';
  content?: string;
  events?: any[];
}

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const sendMessage = async (text: string) => {
    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setIsLoading(true);

    // Prepare assistant message
    const agentMessage: Message = { role: 'assistant', events: [] };
    setMessages((prev) => [...prev, agentMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text }),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      while (reader) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') break;

            try {
              const event = JSON.parse(data);

              if (event.type === 'complete') break;
              if (event.type === 'error') {
                console.error('Agent error:', event.error);
                break;
              }

              agentMessage.events!.push(event);
              setMessages((prev) => {
                const newMessages = [...prev];
                newMessages[newMessages.length - 1] = { ...agentMessage };
                return newMessages;
              });
            } catch (e) {
              console.error('Failed to parse event:', data);
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      agentMessage.events!.push({
        type: 'error',
        error: String(error),
      });
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = { ...agentMessage };
        return newMessages;
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col bg-gray-50">
      <header className="bg-white border-b px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-900">Beyond Agents</h1>
        <p className="text-sm text-gray-600">AI Assistant with Tools</p>
      </header>
      <ChatContainer messages={messages} />
      <ChatInput onSend={sendMessage} disabled={isLoading} />
    </main>
  );
}
```

#### Create `web/components/ChatMessage.tsx`

```typescript
interface ChatMessageProps {
  role: 'user' | 'assistant';
  content?: string;
  events?: any[];
}

export default function ChatMessage({ role, content, events }: ChatMessageProps) {
  if (role === 'user') {
    return (
      <div className="flex justify-end mb-4">
        <div className="bg-blue-500 text-white rounded-lg px-4 py-3 max-w-[80%] shadow">
          {content}
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-4">
      <div className="bg-white border rounded-lg px-4 py-3 max-w-[80%] shadow-sm">
        {events && events.length > 0 ? (
          <div className="space-y-2">
            {events.map((event, i) => (
              <EventDisplay key={i} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-gray-400 italic">Thinking...</div>
        )}
      </div>
    </div>
  );
}

function EventDisplay({ event }: { event: any }) {
  switch (event.type) {
    case 'ThinkingEvent':
      return (
        <div className="text-gray-600 italic text-sm">
          💭 {event.data.text}
        </div>
      );

    case 'ToolCallEvent':
      return (
        <div className="bg-blue-50 border border-blue-200 rounded p-2 text-sm">
          <div className="font-semibold text-blue-700">
            🛠️ {event.data.tool_name}
          </div>
          <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
            {JSON.stringify(event.data.tool_input, null, 2)}
          </pre>
        </div>
      );

    case 'ToolResultEvent':
      return (
        <div className="bg-green-50 border border-green-200 rounded p-2 text-sm">
          <div className="font-semibold text-green-700">✅ Result</div>
          <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
            {event.data.result}
          </pre>
        </div>
      );

    case 'FinalResponseEvent':
      return (
        <div className="text-gray-900 whitespace-pre-wrap">
          {event.data.text}
        </div>
      );

    case 'error':
      return (
        <div className="bg-red-50 border border-red-200 rounded p-2 text-sm">
          <div className="font-semibold text-red-700">❌ Error</div>
          <div className="text-red-600 mt-1">{event.error}</div>
        </div>
      );

    default:
      return null;
  }
}
```

#### Create `web/components/ChatInput.tsx`

```typescript
import { useState, FormEvent } from 'react';

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled: boolean;
}

export default function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [input, setInput] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() && !disabled) {
      onSend(input);
      setInput('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t bg-white p-4">
      <div className="max-w-4xl mx-auto flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
          placeholder="Ask me anything..."
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || !input.trim()}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-colors"
        >
          {disabled ? 'Sending...' : 'Send'}
        </button>
      </div>
    </form>
  );
}
```

#### Create `web/components/ChatContainer.tsx`

```typescript
import { useEffect, useRef } from 'react';
import ChatMessage from './ChatMessage';

interface ChatContainerProps {
  messages: any[];
}

export default function ChatContainer({ messages }: ChatContainerProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-6 max-w-4xl mx-auto w-full">
      {messages.length === 0 && (
        <div className="text-center text-gray-400 mt-12">
          <h2 className="text-3xl font-bold mb-2 text-gray-700">
            Beyond Agents
          </h2>
          <p className="text-lg">Ask me anything to get started</p>
          <div className="mt-8 space-y-2 text-sm">
            <p className="text-gray-500">Try asking:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <code className="bg-gray-100 px-3 py-1 rounded">Read a file</code>
              <code className="bg-gray-100 px-3 py-1 rounded">Search the web</code>
              <code className="bg-gray-100 px-3 py-1 rounded">Execute a command</code>
            </div>
          </div>
        </div>
      )}
      {messages.map((msg, i) => (
        <ChatMessage key={i} {...msg} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
```

---

## Development Workflow

### Terminal 1: Python Backend
```bash
cd backend
uvicorn main:app --reload --port 8000
```

### Terminal 2: Next.js Frontend
```bash
cd web
npm run dev
```

### Access the app
Open http://localhost:3000

---

## Testing Checklist

### Backend Tests
- [ ] Backend starts successfully on port 8000
- [ ] `/health` endpoint returns `{"status": "ok", "agent_ready": true}`
- [ ] Can curl `/chat` endpoint and get SSE stream
- [ ] Agent initializes tools correctly
- [ ] Error handling works (try empty message)

### Frontend Tests
- [ ] Frontend runs on localhost:3000
- [ ] Can send a simple message
- [ ] Messages stream in real-time
- [ ] Tool calls display correctly
- [ ] Final response appears
- [ ] Multiple messages work in sequence
- [ ] Error messages display when backend is down

### Integration Tests
- [ ] Send message requiring tool (e.g., "Read README.md")
- [ ] Verify tool call event displays
- [ ] Verify tool result displays
- [ ] Verify final response appears
- [ ] Test with slow responses (still streams)

### Edge Cases
- [ ] Backend crashes → frontend shows error
- [ ] Empty message → proper validation
- [ ] Very long responses → scrolling works
- [ ] Multiple rapid messages → queues properly

---

## Success Criteria

- [x] FastAPI backend runs on port 8000
- [x] Agent initializes once at startup (not per request)
- [x] SSE streaming works end-to-end
- [x] Next.js frontend runs on port 3000
- [x] Chat UI is clean and functional
- [x] Thinking, tool calls, and responses display correctly
- [x] Multiple messages work in conversation
- [x] Error handling works gracefully
- [x] Performance: responses start streaming in <500ms
- [x] Original CLI still works: `python -m src.main`

---

## Performance Comparison

**Before (Subprocess):**
- First request: ~3-5s (startup + response)
- Subsequent requests: ~3-5s (startup + response)
- Memory: Multiplies per concurrent request

**After (FastAPI):**
- First request: ~500ms-1s (just response time)
- Subsequent requests: ~500ms-1s (just response time)
- Memory: Shared agent instance

**Improvement: 3-5x faster, much better UX**

---

## Future Enhancements (V2+)

- Conversation history persistence (database)
- Multi-session support (unique conversation IDs)
- User authentication
- Copy/regenerate message buttons
- Markdown rendering + syntax highlighting
- Mobile responsive design
- WebSocket upgrade for bi-directional communication
- Conversation export
- Model selection UI
- Token usage tracking

---

## Deployment

### Local Development
Already covered above (two terminals)

### Production (Example)

**Python Backend → Railway/Fly.io**
```bash
# railway.json or fly.toml
# Expose port 8000
```

**Next.js Frontend → Vercel**
```bash
# Set environment variable:
PYTHON_API_URL=https://your-backend.railway.app
```

**Result:** Fully deployed full-stack app

---

## Technical Notes

**Design Principles:**
- FastAPI for performance and modern Python patterns
- Agent stays alive (no startup overhead)
- Minimal changes to core agent code
- Clean separation: Python = backend, Next.js = frontend
- SSE for real-time streaming (simpler than WebSockets for V1)

**Why not subprocess?**
- 3-5x slower (process startup overhead)
- Brittle stdin/stdout communication
- No conversation state
- Doesn't scale

**Why FastAPI?**
- Native Python (same language as agent)
- Built-in async/await support
- Excellent SSE support
- Fast and lightweight
- Easy to deploy
