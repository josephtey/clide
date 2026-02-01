import { z } from 'zod'

export const TaskSchema = z.object({
  id: z.number(),
  repo: z.string(),
  repo_path: z.string(),
  spec_file: z.string(),
  log_file: z.string(),
  title: z.string(),
  status: z.enum(['todo', 'in_progress', 'completed', 'failed']),
  branch: z.string().nullable(),
  agent_id: z.string().nullable(),
  worktree_path: z.string().nullable(),
  merge_status: z.enum(['waiting', 'merged', 'conflict']).nullable(),
  created_at: z.string(),
  assigned_at: z.string().nullable(),
  completed_at: z.string().nullable(),
  error: z.string().nullable(),
})

export const TasksFileSchema = z.object({
  config: z.object({
    max_parallel_tasks: z.number(),
  }),
  next_id: z.number(),
  tasks: z.array(TaskSchema),
})

export type Task = z.infer<typeof TaskSchema>
export type TasksFile = z.infer<typeof TasksFileSchema>
export type TaskStatus = Task['status']
