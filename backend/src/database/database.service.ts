import { Injectable, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseSync } from 'node:sqlite';

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  readonly db: DatabaseSync;

  constructor(config: ConfigService) {
    const dbPath = config.get<string>('DB_PATH') || 'ecopoint.db';
    this.db = new DatabaseSync(dbPath);
    this.db.exec('PRAGMA foreign_keys = ON');
    this.migrate();
  }

  private migrate(): void {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        username TEXT NOT NULL UNIQUE,
        password_hash TEXT NOT NULL,
        avatar TEXT,
        points INTEGER NOT NULL DEFAULT 0,
        xp INTEGER NOT NULL DEFAULT 0,
        level INTEGER NOT NULL DEFAULT 1,
        total_waste REAL NOT NULL DEFAULT 0,
        total_items INTEGER NOT NULL DEFAULT 0,
        created_at TEXT NOT NULL,
        updated_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS collections (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        waste_type TEXT NOT NULL,
        amount REAL NOT NULL,
        items_count INTEGER NOT NULL DEFAULT 0,
        points_earned INTEGER NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS levels (
        id INTEGER PRIMARY KEY,
        level_number INTEGER NOT NULL UNIQUE,
        title TEXT NOT NULL,
        xp_required INTEGER NOT NULL,
        badge_icon TEXT
      );

      CREATE TABLE IF NOT EXISTS challenges (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        target INTEGER NOT NULL,
        xp_reward INTEGER NOT NULL,
        type TEXT NOT NULL,
        deadline TEXT NOT NULL,
        created_at TEXT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_challenges (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        challenge_id TEXT NOT NULL REFERENCES challenges(id),
        progress INTEGER NOT NULL DEFAULT 0,
        is_completed BOOLEAN NOT NULL DEFAULT 0,
        completed_at TEXT,
        UNIQUE(user_id, challenge_id)
      );

      CREATE TABLE IF NOT EXISTS achievements (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        icon TEXT,
        condition_type TEXT NOT NULL,
        condition_value INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS user_achievements (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        achievement_id TEXT NOT NULL REFERENCES achievements(id),
        unlocked_at TEXT NOT NULL,
        UNIQUE(user_id, achievement_id)
      );

      CREATE TABLE IF NOT EXISTS rewards (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT,
        category TEXT,
        points_required INTEGER NOT NULL,
        image TEXT,
        stock INTEGER NOT NULL DEFAULT 0,
        is_active BOOLEAN NOT NULL DEFAULT 1
      );

      CREATE TABLE IF NOT EXISTS redemptions (
        id TEXT PRIMARY KEY,
        user_id TEXT NOT NULL REFERENCES users(id),
        reward_id TEXT NOT NULL REFERENCES rewards(id),
        points_used INTEGER NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        created_at TEXT NOT NULL
      );
    `);
  }

  onApplicationShutdown(): void {
    try {
      this.db.close();
    } catch {
      // already closed
    }
  }
}
