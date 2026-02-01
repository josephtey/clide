import { readFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import path from 'path'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params
    const specPath = path.join(process.cwd(), '..', 'tasks', taskId, 'spec.md')

    try {
      const content = await readFile(specPath, 'utf-8')
      return new Response(content, {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    } catch (error) {
      // Spec file doesn't exist
      return new Response('No specification available', {
        headers: {
          'Content-Type': 'text/plain',
        },
      })
    }
  } catch (error) {
    console.error('Error reading spec file:', error)
    return NextResponse.json(
      { error: 'Failed to read spec file' },
      { status: 500 }
    )
  }
}
