import Database from 'better-sqlite3'
import { DailyStat, TagStat, HistoryRecord } from '../../../src/types/stats'

export class StatsModel {
  constructor(private db: Database.Database) {}

  getDailyStats(days: number = 7): DailyStat[] {
    const stmt = this.db.prepare(`
      SELECT 
        date,
        COALESCE(focus_count, 0) as focus_count,
        COALESCE(total_minutes, 0) as total_minutes
      FROM daily_stats
      WHERE date >= DATE('now', ?)
      ORDER BY date ASC
    `)
    
    const rows = stmt.all(`-${days} days`) as any[]
    
    // Fill missing dates with zeros
    const result: DailyStat[] = []
    const today = new Date()
    
    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]
      
      const existing = rows.find(row => row.date === dateStr)
      result.push({
        date: dateStr.slice(5), // MM-DD format
        focusCount: existing?.focus_count || 0,
        totalMinutes: existing?.total_minutes || 0,
      })
    }
    
    return result
  }

  getTagStats(): TagStat[] {
    const stmt = this.db.prepare(`
      SELECT 
        tag,
        SUM(accumulated_minutes) as total_minutes
      FROM tasks
      WHERE accumulated_minutes > 0
      GROUP BY tag
    `)
    
    const rows = stmt.all() as any[]
    const total = rows.reduce((sum, row) => sum + row.total_minutes, 0)
    
    return rows.map(row => ({
      tag: row.tag as 'work' | 'study' | 'sport' | 'leisure',
      totalMinutes: row.total_minutes,
      percentage: total > 0 ? Math.round((row.total_minutes / total) * 100) : 0,
    }))
  }

  getHistoryRecords(limit: number = 20): HistoryRecord[] {
    const stmt = this.db.prepare(`
      SELECT 
        t.id,
        t.name as task_name,
        t.tag,
        t.accumulated_minutes,
        MAX(f.end_time) as completed_at
      FROM tasks t
      LEFT JOIN focus_sessions f ON t.id = f.task_id
      WHERE t.status = 'completed'
        AND f.is_valid = 1
        AND f.end_time IS NOT NULL
      GROUP BY t.id
      ORDER BY completed_at DESC
      LIMIT ?
    `)
    
    const rows = stmt.all(limit) as any[]
    
    return rows.map(row => ({
      id: row.id,
      taskName: row.task_name,
      tag: row.tag as 'work' | 'study' | 'sport' | 'leisure',
      totalMinutes: row.accumulated_minutes,
      completedAt: new Date(row.completed_at),
    }))
  }

  updateDailyStats(date: string): void {
    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO daily_stats (date, focus_count, total_minutes)
      SELECT 
        ? as date,
        COUNT(DISTINCT f.id) as focus_count,
        COALESCE(SUM(f.duration_minutes), 0) as total_minutes
      FROM focus_sessions f
      WHERE DATE(f.start_time) = ?
        AND f.is_valid = 1
    `)
    
    stmt.run(date, date)
  }
}