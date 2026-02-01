# Agent Dashboard - Web Interface

A real-time web interface for monitoring Claude agent tasks.

## Features

- **Kanban Board View** - Visualize all tasks across 4 states (To Do, In Progress, Completed, Failed)
- **Real-time Updates** - Live task status updates via Server-Sent Events (SSE)
- **Live Log Streaming** - Watch agent execution logs update in real-time
- **Agent Health Monitoring** - Color-coded status indicators for each task
- **Clean, Minimalistic UI** - Built with shadcn/ui and Tailwind CSS

## Setup

```bash
cd dashboard
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture

### Technology Stack
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **shadcn/ui** - High-quality UI components
- **Tailwind CSS** - Utility-first styling
- **Zod** - Runtime type validation
- **Chokidar** - File system watching for real-time updates

### API Routes
- `GET /api/tasks` - Fetch all tasks
- `GET /api/logs/[taskId]` - Fetch logs for a specific task
- `GET /api/logs/[taskId]/stream` - SSE stream for real-time log updates
- `GET /api/stream` - SSE stream for real-time task updates

### Components
- `KanbanBoard` - Main 4-column board layout
- `TaskCard` - Individual task card with metadata
- `LogViewer` - Slide-out panel for viewing task logs

## Development

The dashboard reads data from the parent `data/` directory:
- `data/tasks.json` - Task state database
- `tasks/{id}/agent.log` - Agent execution logs

All file changes are detected automatically and pushed to the UI via Server-Sent Events.
