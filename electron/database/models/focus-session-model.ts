import Database from 'better-sqlite3'
import { FocusSession } from '../../../src/types/timer'
import { v4 as uuidv4 } from 'uuid'

export class FocusSessionModel {
  constructor(private db: Database.Database) {}

  create(taskId: string): FocusSession {
    const id = uuidv4()
    const now = new Date().toISOString()
    
    const stmt = this.db.prepare(`
      INSERT INTO focus_sessions (id, task_id, start_time, is_valid, created_at)
      VALUES (?, ?, ?, ?, ?)
    `)
    
    stmt.run(id, taskId, now, 1, now)
    
    return this.getById(id)!
  }

  complete(id: string, durationMinutes: number, isValid: boolean = true): FocusSession | null {
    const existing = this.getById(id)
    if (!existing) return null

    const endTime = new Date().toISOString()
    const stmt = this.db.prepare(`
      UPDATE focus_sessions 
      SET end_time = ?,
          duration_minutes = ?,
          is_valid = ?
      WHERE id = ?
    `)
    
    stmt.run(endTime, durationMinutes, isValid ? 1 : 0, id)
    
    return this.getById(id)
  }

  getById(id: string): FocusSession | null {
    const stmt = this.db.prepare('SELECT * FROM focus_sessions WHERE id = ?')
    const row = stmt.get(id) as any
    
    if (!row) return null
    
    return this.mapRowToSession(row)
  }

  getByTaskId(taskId: string): FocusSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM focus_sessions 
      WHERE task_id = ? 
      ORDER BY start_time DESC
    `)
    const rows = stmt.all(taskId) as any[]
    
    return rows.map(row => this.mapRowToSession(row))
  }

  getTodaySessions(): FocusSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM focus_sessions 
      WHERE DATE(start_time) = DATE('now') 
      AND is_valid = 1
      ORDER BY start_time DESC
    `)
    const rows = stmt.all() as any[]
    
    return rows.map(row => this.mapRowToSession(row))
  }

  getSessionsByDateRange(startDate: string, endDate: string): FocusSession[] {
    const stmt = this.db.prepare(`
      SELECT * FROM focus_sessions 
      WHERE DATE(start_time) BETWEEN DATE(?) AND DATE(?)
      AND is_valid = 1
      ORDER BY start_time DESC
    `)
    const rows = stmt.all(startDate, endDate) as any[]
    
    return rows.map(row => this.mapRowToSession(row))
  }

  private mapRowToSession(row: any): FocusSession {
    return {
      id: row.id,
      taskId: row.task_id,
      startTime: new Date(row.start_time),
      endTime: row.end_time ? new Date(row.end_time) : null,
      durationMinutes: row.duration_minutes,
      isValid: row.is_valid === 1,
      createdAt: new Date(row.created_at),
    }
  }
}