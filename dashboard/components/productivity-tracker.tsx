'use client'

import { Task } from '@/lib/schemas'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Calendar } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useState } from 'react'

interface ProductivityTrackerProps {
  tasks: Task[]
}

export function ProductivityTracker({ tasks }: ProductivityTrackerProps) {
  const [showDiary, setShowDiary] = useState(false)

  // Filter completed tasks only
  const completedTasks = tasks.filter(t => t.status === 'completed' && t.completed_at)

  // Group tasks by date
  const tasksByDate = completedTasks.reduce((acc, task) => {
    if (!task.completed_at) return acc
    const date = new Date(task.completed_at).toISOString().split('T')[0]
    if (!acc[date]) acc[date] = []
    acc[date].push(task)
    return acc
  }, {} as Record<string, Task[]>)

  // Calculate stats
  const totalCompleted = completedTasks.length

  // Get last 12 weeks of data
  const getContributionData = () => {
    const weeks = []
    const today = new Date()
    const startDate = new Date(today)
    startDate.setDate(today.getDate() - (12 * 7)) // 12 weeks ago

    for (let weekOffset = 0; weekOffset < 12; weekOffset++) {
      const week = []
      for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
        const date = new Date(startDate)
        date.setDate(startDate.getDate() + (weekOffset * 7) + dayOffset)
        const dateStr = date.toISOString().split('T')[0]
        const count = tasksByDate[dateStr]?.length || 0
        const isPast = date <= today
        week.push({
          date: dateStr,
          count,
          displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          isPast
        })
      }
      weeks.push(week)
    }
    return weeks
  }

  const contributionData = getContributionData()

  // Get color intensity based on count
  const getColorClass = (count: number) => {
    if (count === 0) return 'bg-slate-100 dark:bg-slate-800'
    if (count === 1) return 'bg-green-200 dark:bg-green-900/40'
    if (count === 2) return 'bg-green-400 dark:bg-green-700/60'
    if (count === 3) return 'bg-green-500 dark:bg-green-600/80'
    return 'bg-green-600 dark:bg-green-500'
  }

  // Get daily diary entries (last 30 days)
  const getDailyDiary = () => {
    const entries = []
    const today = new Date()

    for (let i = 0; i < 30; i++) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      const dayTasks = tasksByDate[dateStr] || []

      if (dayTasks.length > 0) {
        entries.push({
          date: dateStr,
          displayDate: date.toLocaleDateString('en-US', {
            weekday: 'long',
            month: 'long',
            day: 'numeric',
            year: 'numeric'
          }),
          tasks: dayTasks,
          count: dayTasks.length
        })
      }
    }

    return entries
  }

  const diaryEntries = getDailyDiary()

  return (
    <div className="bg-card rounded-lg border border-slate-200 dark:border-slate-700 p-3">
      <div className="flex items-center gap-4">
        {/* Title */}
        <h3 className="text-sm font-semibold whitespace-nowrap">Productivity</h3>

        {/* Contribution Graph */}
        <div className="flex gap-1">
          {contributionData.map((week, weekIdx) => (
            <div key={weekIdx} className="flex flex-col gap-0.5">
              {week.map((day, dayIdx) => (
                <TooltipProvider key={dayIdx}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <div
                        className={`w-2.5 h-2.5 rounded-sm ${
                          day.isPast ? getColorClass(day.count) : 'bg-slate-50 dark:bg-slate-900'
                        } transition-colors cursor-pointer hover:ring-2 hover:ring-slate-400 dark:hover:ring-slate-500`}
                      />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p className="text-xs">
                        {day.count} {day.count === 1 ? 'task' : 'tasks'} on {day.displayDate}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-0.5">
            <div className="w-2 h-2 rounded-sm bg-slate-100 dark:bg-slate-800" />
            <div className="w-2 h-2 rounded-sm bg-green-200 dark:bg-green-900/40" />
            <div className="w-2 h-2 rounded-sm bg-green-400 dark:bg-green-700/60" />
            <div className="w-2 h-2 rounded-sm bg-green-500 dark:bg-green-600/80" />
            <div className="w-2 h-2 rounded-sm bg-green-600 dark:bg-green-500" />
          </div>
          <span>More</span>
        </div>

        {/* Spacer */}
        <div className="flex-1" />

        {/* Right side - Actions */}
        <div className="flex items-center gap-2">
          <Dialog open={showDiary} onOpenChange={setShowDiary}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2 h-8">
                <Calendar className="h-3.5 w-3.5" />
                <span className="text-xs">Diary</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[80vh]">
              <DialogHeader>
                <DialogTitle>Daily Work Diary</DialogTitle>
              </DialogHeader>
              <ScrollArea className="h-[60vh] pr-4">
                <div className="space-y-6">
                  {diaryEntries.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">
                      No completed tasks yet. Start shipping to build your diary!
                    </p>
                  ) : (
                    diaryEntries.map((entry, idx) => (
                      <div key={idx} className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-sm">{entry.displayDate}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {entry.count} {entry.count === 1 ? 'task' : 'tasks'}
                          </Badge>
                        </div>
                        <div className="space-y-2 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                          {entry.tasks.map((task) => (
                            <div key={task.id} className="space-y-1">
                              <div className="flex items-start gap-2">
                                <Badge variant="outline" className="text-xs font-mono mt-0.5">
                                  #{task.id}
                                </Badge>
                                <div className="flex-1">
                                  <p className="text-sm font-medium">{task.title}</p>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Badge variant="secondary" className="text-xs">
                                      {task.repo}
                                    </Badge>
                                    {task.completed_at && (
                                      <span className="text-xs text-muted-foreground">
                                        Completed at {new Date(task.completed_at).toLocaleTimeString('en-US', {
                                          hour: 'numeric',
                                          minute: '2-digit',
                                          hour12: true
                                        })}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </DialogContent>
          </Dialog>
          <Badge variant="secondary" className="font-mono text-xs">
            {totalCompleted} shipped
          </Badge>
        </div>
      </div>
    </div>
  )
}
