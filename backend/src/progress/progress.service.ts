import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { newId, nowIso } from '../common/game';
import { AchievementRow, LevelRow } from '../common/models';

@Injectable()
export class ProgressService {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  levelForXp(xp: number): LevelRow {
    const rows = this.db
      .prepare(
        'SELECT id, level_number, title, xp_required, badge_icon FROM levels ORDER BY xp_required ASC',
      )
      .all() as unknown as LevelRow[];

    let current: LevelRow = {
      id: 0,
      level_number: 1,
      title: 'Eco Starter',
      xp_required: 0,
      badge_icon: '🌱',
    };

    for (const row of rows) {
      if (xp >= row.xp_required) {
        current = row;
      }
    }
    return current;
  }

  rebuildUser(userId: string): void {
    const totals = this.db
      .prepare(
        `SELECT
           COALESCE(SUM(amount), 0) AS total_waste,
           COALESCE(SUM(items_count), 0) AS total_items,
           COALESCE(SUM(points_earned), 0) AS total_points
         FROM collections WHERE user_id = ?`,
      )
      .get(userId) as unknown as {
      total_waste: number;
      total_items: number;
      total_points: number;
    };

    const level = this.levelForXp(totals.total_points);

    this.db
      .prepare(
        `UPDATE users
         SET points = ?, xp = ?, level = ?, total_waste = ?, total_items = ?, updated_at = ?
         WHERE id = ?`,
      )
      .run(
        totals.total_points,
        totals.total_points,
        level.level_number,
        totals.total_waste,
        totals.total_items,
        nowIso(),
        userId,
      );
  }

  checkAchievements(userId: string): void {
    const user = this.db
      .prepare('SELECT xp, total_waste, total_items FROM users WHERE id = ?')
      .get(userId) as unknown as
      | { xp: number; total_waste: number; total_items: number }
      | undefined;
    if (!user) return;

    const achievements = this.db
      .prepare(
        'SELECT id, name, description, icon, condition_type, condition_value FROM achievements',
      )
      .all() as unknown as AchievementRow[];

    for (const achievement of achievements) {
      let satisfied = false;
      if (achievement.condition_type === 'total_items') {
        satisfied = user.total_items >= achievement.condition_value;
      } else if (achievement.condition_type === 'total_waste') {
        satisfied = user.total_waste >= achievement.condition_value;
      }
      if (!satisfied) continue;

      const existing = this.db
        .prepare(
          'SELECT COUNT(*) AS count FROM user_achievements WHERE user_id = ? AND achievement_id = ?',
        )
        .get(userId, achievement.id) as unknown as { count: number };
      if (existing.count > 0) continue;

      this.db
        .prepare(
          'INSERT INTO user_achievements (id, user_id, achievement_id, unlocked_at) VALUES (?, ?, ?, ?)',
        )
        .run(newId(), userId, achievement.id, nowIso());
    }
  }
}
