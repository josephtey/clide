import { readFile } from 'fs/promises'
import { NextResponse } from 'next/server'
import { getReposPath } from '@/lib/file-paths'
import { ReposFileSchema } from '@/lib/schemas'

export async function GET() {
  try {
    const reposPath = getReposPath()
    const fileContent = await readFile(reposPath, 'utf-8')
    const data = JSON.parse(fileContent)

    // Validate with Zod
    const validated = ReposFileSchema.parse(data)

    return NextResponse.json(validated)
  } catch (error) {
    console.error('Error reading repos:', error)
    return NextResponse.json(
      { error: 'Failed to read repositories' },
      { status: 500 }
    )
  }
}
