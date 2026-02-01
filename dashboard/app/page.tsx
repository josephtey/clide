'use client'

import { useEffect, useState } from 'react'
import { Task, TasksFile } from '@/lib/schemas'
import { KanbanBoard } from '@/components/kanban-board'
import { LogViewer } from '@/components/log-viewer'

export default function Dashboard() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [config, setConfig] = useState({ max_parallel_tasks: 3 })

  // Subscribe to real-time updates
  useEffect(() => {
    const eventSource = new EventSource('/api/stream')

    eventSource.onmessage = (event) => {
      const data: TasksFile = JSON.parse(event.data)
      setTasks(data.tasks)
      setConfig(data.config)
    }

    eventSource.onerror = () => {
      console.error('SSE connection error')
      // Try to reconnect after a delay
      setTimeout(() => {
        eventSource.close()
      }, 1000)
    }

    return () => eventSource.close()
  }, [])

  const groupedTasks = {
    todo: tasks.filter(t => t.status === 'todo'),
    in_progress: tasks.filter(t => t.status === 'in_progress'),
    completed: tasks.filter(t => t.status === 'completed'),
    failed: tasks.filter(t => t.status === 'failed'),
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container mx-auto p-6">
        <header className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Agent Dashboard</h1>
          <p className="text-muted-foreground">
            {tasks.length} total tasks • {groupedTasks.in_progress.length} running •{' '}
            {config.max_parallel_tasks - groupedTasks.in_progress.length} slots available
          </p>
        </header>

        <KanbanBoard
          tasks={groupedTasks}
          onTaskClick={setSelectedTask}
        />

        {selectedTask && (
          <LogViewer
            task={selectedTask}
            open={!!selectedTask}
            onClose={() => setSelectedTask(null)}
          />
        )}
      </div>
    </div>
  )
}
