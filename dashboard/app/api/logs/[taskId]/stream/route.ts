import { readFile } from 'fs/promises'
import { watch } from 'chokidar'
import { getLogPath } from '@/lib/file-paths'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const { taskId } = await params
  const logPath = getLogPath(parseInt(taskId))

  const encoder = new TextEncoder()

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial log content
      try {
        const content = await readFile(logPath, 'utf-8')
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
      } catch {
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content: '' })}\n\n`))
      }

      // Watch for changes
      const watcher = watch(logPath, { persistent: true, ignoreInitial: true })

      watcher.on('change', async () => {
        try {
          const content = await readFile(logPath, 'utf-8')
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
        } catch (error) {
          console.error('Error reading log file:', error)
        }
      })

      watcher.on('add', async () => {
        try {
          const content = await readFile(logPath, 'utf-8')
          controller.enqueue(encoder.encode(`data: ${JSON.stringify({ content })}\n\n`))
        } catch (error) {
          console.error('Error reading log file:', error)
        }
      })

      // Cleanup on connection close
      request.signal.addEventListener('abort', () => {
        watcher.close()
      })
    }
  })

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    }
  })
}
