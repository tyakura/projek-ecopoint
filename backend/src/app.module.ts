import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { ProgressModule } from './progress/progress.module';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { HealthModule } from './health/health.module';
import { StatsModule } from './stats/stats.module';
import { CollectionsModule } from './collections/collections.module';
import { ChallengesModule } from './challenges/challenges.module';
import { AchievementsModule } from './achievements/achievements.module';
import { RewardsModule } from './rewards/rewards.module';
import { LeaderboardModule } from './leaderboard/leaderboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', 'backend/.env'],
    }),
    DatabaseModule,
    ProgressModule,
    UsersModule,
    AuthModule,
    SeedModule,
    HealthModule,
    StatsModule,
    CollectionsModule,
    ChallengesModule,
    AchievementsModule,
    RewardsModule,
    LeaderboardModule,
  ],
})
export class AppModule {}
