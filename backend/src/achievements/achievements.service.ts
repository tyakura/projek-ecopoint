import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';

@Injectable()
export class AchievementsService {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  list(userId: string) {
    const rows = this.db
      .prepare(
        `SELECT a.id, a.name, a.description, a.icon, a.condition_type, a.condition_value,
                ua.unlocked_at
         FROM achievements a
         LEFT JOIN user_achievements ua
           ON a.id = ua.achievement_id AND ua.user_id = ?
         ORDER BY a.condition_value ASC`,
      )
      .all(userId) as unknown as Array<{
      id: string;
      name: string;
      description: string | null;
      icon: string | null;
      condition_type: string;
      condition_value: number;
      unlocked_at: string | null;
    }>;

    return {
      achievements: rows.map((achievement) => ({
        id: achievement.id,
        name: achievement.name,
        description: achievement.description,
        icon: achievement.icon,
        condition_type: achievement.condition_type,
        condition_value: achievement.condition_value,
        unlocked_at: achievement.unlocked_at ?? null,
      })),
    };
  }
}
