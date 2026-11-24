import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { LeaderboardEntry } from '../common/models';

@Injectable()
export class LeaderboardService {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  get(rangeKey: string) {
    const rows = this.db
      .prepare(
        `SELECT u.id, u.name, u.username, u.total_waste, u.level
         FROM users u
         ORDER BY u.total_waste DESC
         LIMIT 20`,
      )
      .all() as unknown as Array<{
      id: string;
      name: string;
      username: string;
      total_waste: number;
      level: number;
    }>;

    const leaderboard: LeaderboardEntry[] = rows.map((entry, index) => ({
      rank: index + 1,
      user_id: entry.id,
      name: entry.name,
      username: entry.username,
      total_waste: entry.total_waste,
      level: entry.level,
    }));

    return { leaderboard, range: rangeKey };
  }
}
