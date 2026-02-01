'use client'

import { useEffect, useState, useRef } from 'react'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Copy, Terminal } from 'lucide-react'
import { Task } from '@/lib/schemas'

interface LogViewerProps {
  task: Task
  open: boolean
  onClose: () => void
}

export function LogViewer({ task, open, onClose }: LogViewerProps) {
  const [logs, setLogs] = useState<string>('')
  const [spec, setSpec] = useState<string>('')
  const [copied, setCopied] = useState(false)
  const [activeTab, setActiveTab] = useState<'spec' | 'logs'>('spec')
  const [viewMode, setViewMode] = useState<'conversation' | 'raw'>('conversation')
  const scrollRef = useRef<HTMLDivElement>(null)

  // Fetch spec file
  useEffect(() => {
    if (!open) return

    fetch(`/api/tasks/${task.id}/spec`)
      .then(res => res.text())
      .then(setSpec)
      .catch(() => setSpec(''))
  }, [task.id, open])

  const copyToClipboard = () => {
    const content = activeTab === 'spec' ? spec : logs
    navigator.clipboard.writeText(content)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const renderMarkdown = (text: string) => {
    // Simple markdown-like formatting
    if (!text || typeof text !== 'string') return null

    return text
      .split('\n')
      .map((line, i) => {
        // Headers
        if (line.startsWith('# ')) {
          return <h1 key={i} className="text-lg font-bold mb-2 mt-4">{line.slice(2)}</h1>
        }
        if (line.startsWith('## ')) {
          return <h2 key={i} className="text-base font-bold mb-2 mt-3">{line.slice(3)}</h2>
        }
        if (line.startsWith('### ')) {
          return <h3 key={i} className="text-sm font-bold mb-1 mt-2">{line.slice(4)}</h3>
        }

        // Lists
        if (line.match(/^[\s]*[-*]\s/)) {
          return <li key={i} className="ml-4 list-disc">{line.replace(/^[\s]*[-*]\s/, '')}</li>
        }
        if (line.match(/^[\s]*\d+\.\s/)) {
          return <li key={i} className="ml-4 list-decimal">{line.replace(/^[\s]*\d+\.\s/, '')}</li>
        }

        // Code blocks
        if (line.startsWith('```')) {
          return null // Skip code fence markers
        }
        if (line.startsWith('    ') || line.startsWith('\t')) {
          return <code key={i} className="block bg-slate-800 px-2 py-1 rounded font-mono text-xs mb-1">{line}</code>
        }

        // Inline formatting
        let formatted = line
          .replace(/\*\*(.+?)\*\*/g, '<strong class="font-semibold">$1</strong>')
          .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
          .replace(/`(.+?)`/g, '<code class="bg-slate-800 px-1 rounded font-mono text-xs">$1</code>')

        if (line.trim() === '') {
          return <br key={i} />
        }

        return <p key={i} className="mb-1" dangerouslySetInnerHTML={{ __html: formatted }} />
      })
  }

  const parseConversationView = () => {
    if (!logs) return null

    const lines = logs.split('\n').filter(line => line.trim())
    const entries: any[] = []

    lines.forEach((line) => {
      try {
        const entry = JSON.parse(line)
        entries.push(entry)
      } catch {
        // Skip malformed lines
      }
    })

    if (entries.length === 0) {
      return <div className="text-slate-400 italic text-center py-8">No log entries yet...</div>
    }

    return entries.map((entry, idx) => {
      const messageType = entry.type || 'log'
      const isUser = entry.message?.role === 'user'
      const isAssistant = entry.message?.role === 'assistant'

      // Extract message content
      let messageContent = ''
      if (entry.message) {
        if (typeof entry.message === 'string') {
          messageContent = entry.message
        } else if (entry.message.content) {
          messageContent = entry.message.content
        }
      }

      return (
        <div key={idx} className="mb-4 pb-4 border-b border-slate-800 last:border-0 last:mb-0">
          {/* Header with metadata */}
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide ${
                isUser ? 'bg-blue-500/20 text-blue-300' :
                isAssistant ? 'bg-purple-500/20 text-purple-300' :
                'bg-slate-700 text-slate-400'
              }`}>
                {entry.message?.role || messageType}
              </span>

              {entry.agentId && (
                <span className="text-[10px] font-mono text-slate-500">
                  agent: {entry.agentId.slice(0, 7)}
                </span>
              )}

              {entry.sessionId && (
                <span className="text-[10px] font-mono text-slate-600">
                  session: {entry.sessionId.slice(0, 8)}
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-[10px] text-slate-600">
              {entry.cwd && (
                <span className="font-mono">{entry.cwd.split('/').pop()}</span>
              )}
              {entry.gitBranch && (
                <span className="font-mono">git:{entry.gitBranch}</span>
              )}
            </div>
          </div>

          {/* Message content */}
          {messageContent && (
            <div className="text-sm leading-relaxed text-slate-200 pl-1">
              {renderMarkdown(messageContent)}
            </div>
          )}
        </div>
      )
    })
  }

  const parseRawView = () => {
    if (!logs) return null
    return (
      <pre className="text-xs text-slate-300 whitespace-pre-wrap leading-relaxed">
        {logs}
      </pre>
    )
  }

  useEffect(() => {
    if (!open) return

    const eventSource = new EventSource(`/api/logs/${task.id}/stream`)

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data)
      setLogs(data.content)

      // Auto-scroll to bottom
      setTimeout(() => {
        if (scrollRef.current) {
          scrollRef.current.scrollTop = scrollRef.current.scrollHeight
        }
      }, 100)
    }

    eventSource.onerror = () => {
      console.error('SSE connection error')
      eventSource.close()
    }

    return () => {
      eventSource.close()
    }
  }, [task.id, open])

  const getStatusVariant = (status: Task['status']) => {
    if (status === 'in_progress') return 'default'
    if (status === 'completed') return 'secondary'
    if (status === 'failed') return 'destructive'
    return 'outline'
  }

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-[900px] sm:max-w-[900px]">
        <SheetHeader className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Terminal className="h-5 w-5 text-muted-foreground" />
              <SheetTitle>Task #{task.id} - {task.title}</SheetTitle>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={getStatusVariant(task.status)}>
                {task.status.replace('_', ' ').toUpperCase()}
              </Badge>
              {activeTab === 'logs' && (
                <div className="flex items-center gap-1 border rounded-md">
                  <Button
                    variant={viewMode === 'conversation' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('conversation')}
                    className="h-8 rounded-r-none"
                  >
                    Conversation
                  </Button>
                  <Button
                    variant={viewMode === 'raw' ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('raw')}
                    className="h-8 rounded-l-none"
                  >
                    Raw
                  </Button>
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={copyToClipboard}
                disabled={activeTab === 'spec' ? !spec : !logs}
              >
                <Copy className="h-3 w-3 mr-1" />
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
          </div>
          <SheetDescription className="text-left">
            {task.repo} • {task.branch || 'No branch'}
          </SheetDescription>

          {/* Tabs */}
          <div className="flex gap-1 border-b border-slate-700 pt-4">
            <Button
              variant={activeTab === 'spec' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('spec')}
              className="rounded-b-none"
            >
              Specification
            </Button>
            <Button
              variant={activeTab === 'logs' ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('logs')}
              className="rounded-b-none"
            >
              Agent Logs
            </Button>
          </div>
        </SheetHeader>

        <ScrollArea ref={scrollRef} className="h-[calc(100vh-200px)] mt-6">
          {activeTab === 'spec' ? (
            <div className="rounded-lg border border-slate-200 bg-white p-6">
              {spec ? (
                <div className="prose prose-sm max-w-none">
                  {renderMarkdown(spec)}
                </div>
              ) : (
                <div className="text-slate-400 italic text-center py-8">No specification available</div>
              )}
            </div>
          ) : (
            <div className="rounded-lg border border-slate-800 bg-slate-950 text-slate-50 p-6">
              {logs ? (
                viewMode === 'conversation' ? parseConversationView() : parseRawView()
              ) : (
                <div className="text-slate-400 italic text-center py-8">No logs yet...</div>
              )}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  )
}
