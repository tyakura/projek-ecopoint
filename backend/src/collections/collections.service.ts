import { BadRequestException, Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProgressService } from '../progress/progress.service';
import { calcPoints, newId, nowIso } from '../common/game';
import { CollectionRow } from '../common/models';
import { CreateCollectionDto } from './dto/create-collection.dto';

@Injectable()
export class CollectionsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly progress: ProgressService,
  ) {}

  private get db() {
    return this.database.db;
  }

  create(userId: string, body: CreateCollectionDto) {
    const amount = Number(body.amount);
    const itemsCount = Number(body.items_count);

    if (!(amount > 0) || !(itemsCount > 0)) {
      throw new BadRequestException('amount and items_count must be positive');
    }

    const points = calcPoints(amount, itemsCount);
    const collection: CollectionRow = {
      id: newId(),
      user_id: userId,
      waste_type: body.waste_type ?? '',
      amount,
      items_count: itemsCount,
      points_earned: points,
      created_at: nowIso(),
    };

    this.db
      .prepare(
        `INSERT INTO collections (id, user_id, waste_type, amount, items_count, points_earned, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        collection.id,
        collection.user_id,
        collection.waste_type,
        collection.amount,
        collection.items_count,
        collection.points_earned,
        collection.created_at,
      );

    this.progress.rebuildUser(userId);
    this.progress.checkAchievements(userId);

    return {
      collection,
      points,
      message: 'Great job! Keep collecting.',
    };
  }

  list(userId: string) {
    const collections = this.db
      .prepare(
        `SELECT id, user_id, waste_type, amount, items_count, points_earned, created_at
         FROM collections WHERE user_id = ? ORDER BY created_at DESC`,
      )
      .all(userId) as unknown as CollectionRow[];
    return { collections };
  }
}
