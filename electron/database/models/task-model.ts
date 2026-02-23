import Database from 'better-sqlite3'
import { Task, TaskStatus, TaskTag } from '../../../src/types/task'
import { v4 as uuidv4 } from 'uuid'

export class TaskModel {
  constructor(private db: Database.Database) {}

  create(taskData: {
    name: string
    tag: TaskTag
    targetMinutes?: number
  }): Task {
    const id = uuidv4()
    const now = new Date().toISOString()
    
    const stmt = this.db.prepare(`
      INSERT INTO tasks (id, name, tag, target_minutes, accumulated_minutes, status, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)
    
    stmt.run(
      id,
      taskData.name,
      taskData.tag,
      taskData.targetMinutes || 0,
      0,
      'waiting',
      now,
      now
    )
    
    return this.getById(id)!
  }

  update(id: string, updates: Partial<{
    name: string
    tag: TaskTag
    targetMinutes: number
    accumulatedMinutes: number
    status: TaskStatus
  }>): Task | null {
    const existing = this.getById(id)
    if (!existing) return null

    const updatedAt = new Date().toISOString()
    const stmt = this.db.prepare(`
      UPDATE tasks 
      SET name = COALESCE(?, name),
          tag = COALESCE(?, tag),
          target_minutes = COALESCE(?, target_minutes),
          accumulated_minutes = COALESCE(?, accumulated_minutes),
          status = COALESCE(?, status),
          updated_at = ?
      WHERE id = ?
    `)
    
    stmt.run(
      updates.name,
      updates.tag,
      updates.targetMinutes,
      updates.accumulatedMinutes,
      updates.status,
      updatedAt,
      id
    )
    
    return this.getById(id)
  }

  delete(id: string): boolean {
    const stmt = this.db.prepare('DELETE FROM tasks WHERE id = ?')
    const result = stmt.run(id)
    return result.changes > 0
  }

  getById(id: string): Task | null {
    const stmt = this.db.prepare('SELECT * FROM tasks WHERE id = ?')
    const row = stmt.get(id) as any
    
    if (!row) return null
    
    return this.mapRowToTask(row)
  }

  getAll(): Task[] {
    const stmt = this.db.prepare('SELECT * FROM tasks ORDER BY updated_at DESC')
    const rows = stmt.all() as any[]
    
    return rows.map(row => this.mapRowToTask(row))
  }

  getByStatus(status: TaskStatus): Task[] {
    const stmt = this.db.prepare('SELECT * FROM tasks WHERE status = ? ORDER BY updated_at DESC')
    const rows = stmt.all(status) as any[]
    
    return rows.map(row => this.mapRowToTask(row))
  }

  addAccumulatedMinutes(id: string, minutes: number): Task | null {
    const existing = this.getById(id)
    if (!existing) return null

    const newAccumulated = existing.accumulatedMinutes + minutes
    return this.update(id, { accumulatedMinutes: newAccumulated })
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      name: row.name,
      tag: row.tag as TaskTag,
      targetMinutes: row.target_minutes,
      accumulatedMinutes: row.accumulated_minutes,
      status: row.status as TaskStatus,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }
  }
}