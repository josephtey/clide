import { readFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { getLogPath } from '@/lib/file-paths'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params
    const logPath = getLogPath(parseInt(taskId))

    try {
      const content = await readFile(logPath, 'utf-8')
      return new Response(content, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    } catch (error) {
      // Log file doesn't exist yet
      return new Response('No logs yet...', {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }
  } catch (error) {
    console.error('Error reading log file:', error)
    return NextResponse.json(
      { error: 'Failed to read log file' },
      { status: 500 }
    )
  }
}
