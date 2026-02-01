import { readFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { getTasksPath } from '@/lib/file-paths'
import { TasksFileSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const tasksPath = getTasksPath()
    const fileContent = await readFile(tasksPath, 'utf-8')
    const data = JSON.parse(fileContent)

    // Validate with Zod
    const validated = TasksFileSchema.parse(data)

    return NextResponse.json(validated)
  } catch (error) {
    console.error('Error reading tasks:', error)
    return NextResponse.json(
      { error: 'Failed to read tasks' },
      { status: 500 }
    )
  }
}
