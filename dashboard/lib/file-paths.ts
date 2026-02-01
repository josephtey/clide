import path from 'path'

export const DATA_DIR = path.join(process.cwd(), '..', 'data')
export const TASKS_DIR = path.join(process.cwd(), '..', 'tasks')

export const getTasksPath = () => path.join(DATA_DIR, 'tasks.json')
export const getReposPath = () => path.join(DATA_DIR, 'repos.json')
export const getLogPath = (taskId: number) =>
  path.join(TASKS_DIR, String(taskId), 'agent.log')
