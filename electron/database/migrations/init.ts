import Database from 'better-sqlite3'

export async function initMigrations(db: Database.Database): Promise<void> {
  // Create tables if they don't exist
  
  // Tasks table
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      tag TEXT NOT NULL CHECK (tag IN ('work', 'study', 'sport', 'leisure')),
      target_minutes INTEGER NOT NULL DEFAULT 0,
      accumulated_minutes INTEGER NOT NULL DEFAULT 0,
      status TEXT NOT NULL CHECK (status IN ('waiting', 'in_progress', 'completed')),
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Focus sessions table
  db.exec(`
    CREATE TABLE IF NOT EXISTS focus_sessions (
      id TEXT PRIMARY KEY,
      task_id TEXT NOT NULL,
      start_time DATETIME NOT NULL,
      end_time DATETIME,
      duration_minutes INTEGER NOT NULL DEFAULT 0,
      is_valid BOOLEAN NOT NULL DEFAULT 1,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (task_id) REFERENCES tasks (id) ON DELETE CASCADE
    )
  `)

  // Daily stats table
  db.exec(`
    CREATE TABLE IF NOT EXISTS daily_stats (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      date DATE NOT NULL UNIQUE,
      focus_count INTEGER NOT NULL DEFAULT 0,
      total_minutes INTEGER NOT NULL DEFAULT 0,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // App settings table
  db.exec(`
    CREATE TABLE IF NOT EXISTS app_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
    )
  `)

  // Create indexes for better performance
  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks (status)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_tasks_tag ON tasks (tag)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_focus_sessions_task_id ON focus_sessions (task_id)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_focus_sessions_start_time ON focus_sessions (start_time)')
  db.exec('CREATE INDEX IF NOT EXISTS idx_daily_stats_date ON daily_stats (date)')

  // Insert default settings if not exist
  const stmt = db.prepare(`
    INSERT OR IGNORE INTO app_settings (key, value) 
    VALUES (?, ?)
  `)
  
  stmt.run('timer_duration', '25')
  stmt.run('sound_enabled', 'true')
  stmt.run('auto_start_break', 'false')
  stmt.run('theme', 'light')
  
  console.log('Database migrations completed')
}