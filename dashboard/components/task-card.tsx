'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/lib/schemas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])
  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'bg-slate-100 text-slate-700 hover:bg-slate-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      case 'completed':
        return 'bg-green-100 text-green-700 hover:bg-green-200'
      case 'failed':
        return 'bg-red-100 text-red-700 hover:bg-red-200'
    }
  }

  const getStatusLabel = (status: Task['status']) => {
    switch (status) {
      case 'todo':
        return 'TO DO'
      case 'in_progress':
        return 'IN PROGRESS'
      case 'completed':
        return 'COMPLETED'
      case 'failed':
        return 'FAILED'
    }
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-lg transition-all hover:border-slate-300"
      onClick={onClick}
    >
      <CardHeader className="pb-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-semibold leading-tight">
            #{task.id} {task.title}
          </CardTitle>
          <Badge className={getStatusColor(task.status)}>
            {getStatusLabel(task.status)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <span className="font-medium">Repo:</span>
            <span>{task.repo}</span>
          </div>

          {task.branch && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Branch:</span>
              <span className="font-mono">{task.branch}</span>
            </div>
          )}

          <div className="flex items-center gap-1">
            <span className="font-medium">Created:</span>
            <span>{mounted ? format(new Date(task.created_at), 'MMM d, h:mm a') : task.created_at}</span>
          </div>

          {task.assigned_at && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Assigned:</span>
              <span>{mounted ? format(new Date(task.assigned_at), 'MMM d, h:mm a') : task.assigned_at}</span>
            </div>
          )}

          {task.completed_at && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Completed:</span>
              <span>{mounted ? format(new Date(task.completed_at), 'MMM d, h:mm a') : task.completed_at}</span>
            </div>
          )}

          {task.agent_id && (
            <div className="flex items-center gap-1">
              <span className="font-medium">Agent:</span>
              <span className="font-mono">{task.agent_id}</span>
            </div>
          )}

          {task.error && (
            <div className="mt-2 p-2 bg-red-50 rounded text-red-700">
              <span className="font-medium">Error:</span> {task.error}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
