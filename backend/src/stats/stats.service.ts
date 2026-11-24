import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { Stats } from '../common/models';

@Injectable()
export class StatsService {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  get(): Stats {
    const waste = this.db
      .prepare('SELECT COALESCE(SUM(amount), 0) AS total FROM collections')
      .get() as unknown as { total: number };
    const users = this.db
      .prepare('SELECT COUNT(*) AS count FROM users')
      .get() as unknown as { count: number };
    const collections = this.db
      .prepare('SELECT COUNT(*) AS count FROM collections')
      .get() as unknown as { count: number };
    const redemptions = this.db
      .prepare('SELECT COUNT(*) AS count FROM redemptions')
      .get() as unknown as { count: number };

    return {
      waste_collected: waste.total,
      active_users: users.count,
      collections: collections.count,
      rewards_claimed: redemptions.count,
    };
  }
}
