'use client'

import { useState, useEffect } from 'react'
import { Task } from '@/lib/schemas'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { format, formatDistanceToNow } from 'date-fns'
import { Loader2, Copy, Check } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onClick: () => void
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  const [mounted, setMounted] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleCopyBranch = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (task.branch) {
      navigator.clipboard.writeText(task.branch)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getDuration = () => {
    if (!task.assigned_at) return null

    const startTime = new Date(task.assigned_at)
    const endTime = task.completed_at ? new Date(task.completed_at) : new Date()
    const diffMs = endTime.getTime() - startTime.getTime()

    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)

    if (hours > 0) {
      const remainingMinutes = minutes % 60
      return `${hours}h ${remainingMinutes}m`
    } else if (minutes > 0) {
      const remainingSeconds = seconds % 60
      return `${minutes}m ${remainingSeconds}s`
    } else {
      return `${seconds}s`
    }
  }

  return (
    <TooltipProvider>
      <Card
        className="cursor-pointer hover:shadow-lg transition-all hover:border-slate-300"
        onClick={onClick}
      >
        <CardHeader className="pb-3 space-y-2">
          {task.assigned_at && mounted && (
            <div className="text-xs text-muted-foreground">
              {format(new Date(task.assigned_at), 'MMM d, h:mm a')} • ran for {getDuration()}
            </div>
          )}
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {task.status === 'in_progress' && (
                <Loader2 className="h-4 w-4 animate-spin text-blue-600 flex-shrink-0" />
              )}
              <CardTitle className="text-sm font-semibold leading-tight">
                #{task.id} {task.title}
              </CardTitle>
            </div>
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
                <span className="font-mono flex-1 truncate">{task.branch}</span>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                      onClick={handleCopyBranch}
                    >
                      {copied ? (
                        <Check className="h-3 w-3 text-green-600" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{copied ? 'Copied!' : 'Copy branch name'}</p>
                  </TooltipContent>
                </Tooltip>
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
    </TooltipProvider>
  )
}
