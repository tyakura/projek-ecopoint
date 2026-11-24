import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { hashSync } from 'bcryptjs';
import { DatabaseService } from '../database/database.service';
import { ProgressService } from '../progress/progress.service';
import { calcPoints, newId, nowIso } from '../common/game';

interface Sample {
  wasteType: string;
  amount: number;
  items: number;
  daysAgoMs: number;
}

interface DemoUser {
  name: string;
  email: string;
  username: string;
  password: string;
  samples: Sample[];
}

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger('SeedService');

  constructor(
    private readonly database: DatabaseService,
    private readonly progress: ProgressService,
  ) {}

  private get db() {
    return this.database.db;
  }

  onModuleInit(): void {
    this.seed();
  }

  private seed(): void {
    const now = nowIso();
    this.seedLevels();
    this.seedChallenges(now);
    this.seedAchievements();
    this.seedRewards();
    this.seedDemoUsers(now);
    this.rebuildAllUsers();
    this.logger.log('Database seeded.');
  }

  private seedLevels(): void {
    const levels = [
      { levelNumber: 1, title: 'Eco Starter', xpRequired: 0, badgeIcon: '🌱' },
      { levelNumber: 2, title: 'Green Explorer', xpRequired: 500, badgeIcon: '🍃' },
      { levelNumber: 3, title: 'Eco Warrior', xpRequired: 1500, badgeIcon: '♻️' },
      { levelNumber: 4, title: 'Earth Guardian', xpRequired: 3000, badgeIcon: '🌎' },
    ];

    for (const level of levels) {
      const existing = this.db
        .prepare('SELECT COUNT(*) AS count FROM levels WHERE level_number = ?')
        .get(level.levelNumber) as unknown as { count: number };
      if (existing.count === 0) {
        this.db
          .prepare(
            'INSERT INTO levels (level_number, title, xp_required, badge_icon) VALUES (?, ?, ?, ?)',
          )
          .run(level.levelNumber, level.title, level.xpRequired, level.badgeIcon);
      }
    }
  }

  private seedChallenges(now: string): void {
    const challenges = [
      {
        title: 'Collect 10 recyclable items',
        description: 'Collect any recyclable items to complete this weekly challenge.',
        target: 10,
        xpReward: 500,
        type: 'weekly',
        deadline: new Date(Date.now() + 72 * HOUR).toISOString(),
      },
      {
        title: 'Collect 3 plastic bottles',
        description: 'Bring in 3 plastic bottles for recycling.',
        target: 3,
        xpReward: 100,
        type: 'daily',
        deadline: new Date(Date.now() + 24 * HOUR).toISOString(),
      },
      {
        title: 'Recycle 1 KG of waste',
        description: 'Submit at least 1 KG of waste in a single collection.',
        target: 1,
        xpReward: 250,
        type: 'weekly',
        deadline: new Date(Date.now() + 48 * HOUR).toISOString(),
      },
    ];

    for (const challenge of challenges) {
      const existing = this.db
        .prepare('SELECT COUNT(*) AS count FROM challenges WHERE title = ?')
        .get(challenge.title) as unknown as { count: number };
      if (existing.count === 0) {
        this.db
          .prepare(
            `INSERT INTO challenges (id, title, description, target, xp_reward, type, deadline, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            newId(),
            challenge.title,
            challenge.description,
            challenge.target,
            challenge.xpReward,
            challenge.type,
            challenge.deadline,
            now,
          );
      }
    }
  }

  private seedAchievements(): void {
    const achievements = [
      {
        name: 'First Collection',
        description: 'Submit your very first waste collection.',
        icon: '♻️',
        conditionType: 'total_items',
        conditionValue: 1,
      },
      {
        name: 'Green Starter',
        description: 'Collect 5 items in total.',
        icon: '🌱',
        conditionType: 'total_items',
        conditionValue: 5,
      },
      {
        name: 'Earth Saver',
        description: 'Collect 10 KG of waste in total.',
        icon: '🌎',
        conditionType: 'total_waste',
        conditionValue: 10,
      },
      {
        name: 'Eco Legend',
        description: 'Collect 100 items in total.',
        icon: '🏆',
        conditionType: 'total_items',
        conditionValue: 100,
      },
    ];

    for (const achievement of achievements) {
      const existing = this.db
        .prepare('SELECT COUNT(*) AS count FROM achievements WHERE name = ?')
        .get(achievement.name) as unknown as { count: number };
      if (existing.count === 0) {
        this.db
          .prepare(
            `INSERT INTO achievements (id, name, description, icon, condition_type, condition_value)
             VALUES (?, ?, ?, ?, ?, ?)`,
          )
          .run(
            newId(),
            achievement.name,
            achievement.description,
            achievement.icon,
            achievement.conditionType,
            achievement.conditionValue,
          );
      }
    }
  }

  private seedRewards(): void {
    const rewards = [
      {
        name: 'Rp10.000 Cash Reward',
        description: 'Redeem 10 thousand rupiah cash.',
        category: 'cash',
        pointsRequired: 1000,
        image: '💰',
        stock: 100,
      },
      {
        name: 'Discount Voucher',
        description: '20% discount voucher for our partner stores.',
        category: 'voucher',
        pointsRequired: 1500,
        image: '🎟️',
        stock: 50,
      },
      {
        name: 'Environmental Donation',
        description: 'We plant a tree in your name.',
        category: 'donation',
        pointsRequired: 3000,
        image: '🌱',
        stock: 1000,
      },
      {
        name: 'Eco Merchandise — T-Shirt',
        description: 'Exclusive EcoPoint recycled-fiber t-shirt.',
        category: 'merchandise',
        pointsRequired: 5000,
        image: '👕',
        stock: 25,
      },
    ];

    for (const reward of rewards) {
      const existing = this.db
        .prepare('SELECT COUNT(*) AS count FROM rewards WHERE name = ?')
        .get(reward.name) as unknown as { count: number };
      if (existing.count === 0) {
        this.db
          .prepare(
            `INSERT INTO rewards (id, name, description, category, points_required, image, stock, is_active)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            newId(),
            reward.name,
            reward.description,
            reward.category,
            reward.pointsRequired,
            reward.image,
            reward.stock,
            1,
          );
      }
    }
  }

  private seedDemoUsers(now: string): void {
    const demoUsers: DemoUser[] = [
      {
        name: 'Alex Yanuar',
        email: 'alex@ecopoint.io',
        username: 'alex',
        password: 'demo123456',
        samples: [
          { wasteType: 'plastic_bottle', amount: 2.5, items: 20, daysAgoMs: 2 * HOUR },
          { wasteType: 'plastic_bag', amount: 3.0, items: 15, daysAgoMs: 24 * HOUR },
          { wasteType: 'recyclable', amount: 6.9, items: 52, daysAgoMs: 10 * DAY },
        ],
      },
      {
        name: 'Sarah Putri',
        email: 'sarah@ecopoint.io',
        username: 'sarah',
        password: 'demo123456',
        samples: [
          { wasteType: 'plastic_bottle', amount: 4.0, items: 30, daysAgoMs: 5 * HOUR },
          { wasteType: 'recyclable', amount: 5.0, items: 40, daysAgoMs: 5 * DAY },
        ],
      },
      {
        name: 'Daniel Wijaya',
        email: 'daniel@ecopoint.io',
        username: 'daniel',
        password: 'demo123456',
        samples: [
          { wasteType: 'plastic_bottle', amount: 3.2, items: 25, daysAgoMs: 3 * DAY },
        ],
      },
      {
        name: 'Kevin Tan',
        email: 'kevin@ecopoint.io',
        username: 'kevin',
        password: 'demo123456',
        samples: [
          { wasteType: 'plastic_bag', amount: 2.1, items: 18, daysAgoMs: 12 * DAY },
        ],
      },
    ];

    for (const demo of demoUsers) {
      const existing = this.db
        .prepare('SELECT COUNT(*) AS count FROM users WHERE email = ?')
        .get(demo.email) as unknown as { count: number };
      if (existing.count > 0) continue;

      const passwordHash = hashSync(demo.password, 10);
      this.db
        .prepare(
          `INSERT INTO users (id, name, email, username, password_hash, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
        )
        .run(newId(), demo.name, demo.email, demo.username, passwordHash, now, now);

      const created = this.db
        .prepare('SELECT id FROM users WHERE email = ?')
        .get(demo.email) as unknown as { id: string };

      for (const sample of demo.samples) {
        const points = calcPoints(sample.amount, sample.items);
        const createdAt = new Date(Date.now() - sample.daysAgoMs).toISOString();
        this.db
          .prepare(
            `INSERT INTO collections (id, user_id, waste_type, amount, items_count, points_earned, created_at)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
          )
          .run(
            newId(),
            created.id,
            sample.wasteType,
            sample.amount,
            sample.items,
            points,
            createdAt,
          );
      }
    }
  }

  private rebuildAllUsers(): void {
    const users = this.db.prepare('SELECT id FROM users').all() as unknown as Array<{
      id: string;
    }>;
    for (const user of users) {
      this.progress.rebuildUser(user.id);
      this.progress.checkAchievements(user.id);
    }
  }
}
