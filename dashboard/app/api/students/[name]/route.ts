import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> }
) {
  try {
    const { name } = await params
    const filePath = path.join(process.cwd(), '..', 'data', 'students', `${name}.json`)

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 })
    }

    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'))
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to read student data' }, { status: 500 })
  }
}
