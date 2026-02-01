import { readFile } from 'fs/promises'
import { watch } from 'chokidar'
import { getTasksPath } from '@/lib/file-paths'
import { TasksFileSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  const encoder = new TextEncoder()
  const tasksPath = getTasksPath()

  const stream = new ReadableStream({
    async start(controller) {
      const sendTasks = async () => {
        try {
          const fileContent = await readFile(tasksPath, 'utf-8')
          const data = JSON.parse(fileContent)
          const validated = TasksFileSchema.parse(data)
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(validated)}\n\n`))
        } catch (error) {
          console.error('Error reading tasks:', error)
        }
      }

      // Send initial data
      await sendTasks()

      // Watch for changes
      const watcher = watch(tasksPath, {
        persistent: true,
        ignoreInitial: true,
      })

      watcher.on('change', sendTasks)

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
