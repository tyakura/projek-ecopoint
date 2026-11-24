import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { UsersService } from '../users/users.service';
import { newId, nowIso } from '../common/game';
import { RedemptionRow, RewardRow } from '../common/models';

@Injectable()
export class RewardsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly users: UsersService,
  ) {}

  private get db() {
    return this.database.db;
  }

  listActive() {
    const rows = this.db
      .prepare(
        `SELECT id, name, description, category, points_required, image, stock, is_active
         FROM rewards WHERE is_active = 1 ORDER BY points_required ASC`,
      )
      .all() as unknown as RewardRow[];

    return {
      rewards: rows.map((reward) => ({
        id: reward.id,
        name: reward.name,
        description: reward.description,
        category: reward.category,
        points_required: reward.points_required,
        image: reward.image,
        stock: reward.stock,
        is_active: Boolean(reward.is_active),
      })),
    };
  }

  listRedemptions(userId: string) {
    const redemptions = this.db
      .prepare(
        `SELECT r.id, r.user_id, r.reward_id, r.points_used, r.status, r.created_at, w.name AS reward_name
         FROM redemptions r
         JOIN rewards w ON r.reward_id = w.id
         WHERE r.user_id = ?
         ORDER BY r.created_at DESC`,
      )
      .all(userId) as unknown as RedemptionRow[];

    return { redemptions };
  }

  redeem(userId: string, rewardId: string) {
    const user = this.users.findById(userId);
    if (!user) {
      throw new NotFoundException('user not found');
    }

    const reward = this.getReward(rewardId);
    if (!reward) {
      throw new NotFoundException('reward not found');
    }
    if (user.points < reward.points_required) {
      throw new BadRequestException('not enough points');
    }
    if (reward.stock <= 0) {
      throw new BadRequestException('reward out of stock');
    }

    const redemption: RedemptionRow = {
      id: newId(),
      user_id: userId,
      reward_id: rewardId,
      points_used: reward.points_required,
      status: 'completed',
      created_at: nowIso(),
      reward_name: '',
    };

    this.db
      .prepare(
        `INSERT INTO redemptions (id, user_id, reward_id, points_used, status, created_at)
         VALUES (?, ?, ?, ?, ?, ?)`,
      )
      .run(
        redemption.id,
        redemption.user_id,
        redemption.reward_id,
        redemption.points_used,
        redemption.status,
        redemption.created_at,
      );

    this.db
      .prepare('UPDATE rewards SET stock = stock - 1 WHERE id = ? AND stock > 0')
      .run(rewardId);

    this.db
      .prepare('UPDATE users SET points = points - ?, updated_at = ? WHERE id = ?')
      .run(reward.points_required, nowIso(), userId);

    return {
      message: 'Reward redeemed successfully!',
      redemption,
    };
  }

  private getReward(id: string): RewardRow | undefined {
    return this.db
      .prepare(
        `SELECT id, name, description, category, points_required, image, stock, is_active
         FROM rewards WHERE id = ?`,
      )
      .get(id) as unknown as RewardRow | undefined;
  }
}
