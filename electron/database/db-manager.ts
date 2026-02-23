import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'
import { app } from 'electron'
import fs from 'fs/promises'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const DB_PATH = path.join(app.getPath('userData'), 'banana-clock.db')

let dbInstance: Database.Database | null = null

export function getDatabase(): Database.Database {
  if (!dbInstance) {
    throw new Error('Database not initialized. Call initDatabase() first.')
  }
  return dbInstance
}

export async function initDatabase(): Promise<void> {
  if (dbInstance) {
    return
  }

  try {
    // Ensure user data directory exists
    const userDataDir = app.getPath('userData')
    await fs.mkdir(userDataDir, { recursive: true })
    
    // Open database connection
    dbInstance = new Database(DB_PATH)
    
    // Enable foreign keys and WAL mode for better performance
    dbInstance.pragma('foreign_keys = ON')
    dbInstance.pragma('journal_mode = WAL')
    
    // Run migrations
    await initMigrations(dbInstance)
    
    console.log(`Database initialized at ${DB_PATH}`)
  } catch (error) {
    console.error('Failed to initialize database:', error)
    throw error
  }
}

export function closeDatabase(): void {
  if (dbInstance) {
    dbInstance.close()
    dbInstance = null
  }
}

// Helper function for transaction
export function transaction<T>(callback: (db: Database.Database) => T): T {
  const db = getDatabase()
  db.exec('BEGIN TRANSACTION')
  try {
    const result = callback(db)
    db.exec('COMMIT')
    return result
  } catch (error) {
    db.exec('ROLLBACK')
    throw error
  }
}