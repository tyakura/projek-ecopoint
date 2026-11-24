import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { ProgressService } from '../progress/progress.service';
import { UsersService } from '../users/users.service';
import { newId, nowIso } from '../common/game';
import { ChallengeRow, UserChallengeRow } from '../common/models';

@Injectable()
export class ChallengesService {
  constructor(
    private readonly database: DatabaseService,
    private readonly progress: ProgressService,
    private readonly users: UsersService,
  ) {}

  private get db() {
    return this.database.db;
  }

  list(userId: string) {
    const rows = this.db
      .prepare(
        `SELECT id, title, description, target, xp_reward, type, deadline, created_at
         FROM challenges ORDER BY type ASC, created_at DESC`,
      )
      .all() as unknown as ChallengeRow[];

    const challenges = rows.map((challenge) =>
      this.mapChallenge(challenge, this.getUserChallenge(userId, challenge.id)),
    );
    return { challenges };
  }

  listMine(userId: string) {
    const { challenges } = this.list(userId);
    return {
      challenges: challenges.filter(
        (challenge) => challenge.progress > 0 || challenge.is_completed,
      ),
    };
  }

  progressFor(userId: string, challengeId: string) {
    const challenge = this.getChallenge(challengeId);
    if (!challenge) {
      throw new NotFoundException('challenge not found');
    }

    const existing = this.getUserChallenge(userId, challengeId);
    if (existing && existing.is_completed) {
      return { challenge: this.mapChallenge(challenge, existing) };
    }

    const progress = (existing?.progress ?? 0) + 1;
    let isCompleted = false;
    let completedAt: string | null = null;

    if (progress >= challenge.target) {
      isCompleted = true;
      completedAt = nowIso();

      const user = this.users.findById(userId);
      if (user) {
        const newXP = user.xp + challenge.xp_reward;
        const newPoints = user.points + challenge.xp_reward;
        const level = this.progress.levelForXp(newXP);
        this.db
          .prepare(
            'UPDATE users SET xp = ?, points = ?, level = ?, updated_at = ? WHERE id = ?',
          )
          .run(newXP, newPoints, level.level_number, completedAt, userId);
      }
    }

    this.upsertUserChallenge(
      userId,
      challengeId,
      progress,
      isCompleted,
      completedAt,
    );

    return {
      challenge: this.mapChallenge(challenge, {
        progress,
        is_completed: isCompleted ? 1 : 0,
        completed_at: completedAt,
      } as UserChallengeRow),
    };
  }

  private getChallenge(id: string): ChallengeRow | undefined {
    return this.db
      .prepare(
        `SELECT id, title, description, target, xp_reward, type, deadline, created_at
         FROM challenges WHERE id = ?`,
      )
      .get(id) as unknown as ChallengeRow | undefined;
  }

  private getUserChallenge(
    userId: string,
    challengeId: string,
  ): UserChallengeRow | undefined {
    return this.db
      .prepare(
        `SELECT id, user_id, challenge_id, progress, is_completed, completed_at
         FROM user_challenges WHERE user_id = ? AND challenge_id = ?`,
      )
      .get(userId, challengeId) as unknown as UserChallengeRow | undefined;
  }

  private upsertUserChallenge(
    userId: string,
    challengeId: string,
    progress: number,
    isCompleted: boolean,
    completedAt: string | null,
  ): void {
    const existing = this.db
      .prepare(
        'SELECT COUNT(*) AS count FROM user_challenges WHERE user_id = ? AND challenge_id = ?',
      )
      .get(userId, challengeId) as unknown as { count: number };

    if (existing.count === 0) {
      this.db
        .prepare(
          `INSERT INTO user_challenges (id, user_id, challenge_id, progress, is_completed, completed_at)
           VALUES (?, ?, ?, ?, ?, ?)`,
        )
        .run(
          newId(),
          userId,
          challengeId,
          progress,
          isCompleted ? 1 : 0,
          completedAt,
        );
      return;
    }

    this.db
      .prepare(
        `UPDATE user_challenges
         SET progress = ?, is_completed = ?, completed_at = ?
         WHERE user_id = ? AND challenge_id = ?`,
      )
      .run(progress, isCompleted ? 1 : 0, completedAt, userId, challengeId);
  }

  private mapChallenge(challenge: ChallengeRow, userChallenge?: UserChallengeRow) {
    return {
      id: challenge.id,
      title: challenge.title,
      description: challenge.description,
      target: challenge.target,
      xp_reward: challenge.xp_reward,
      type: challenge.type,
      deadline: challenge.deadline,
      created_at: challenge.created_at,
      progress: userChallenge?.progress ?? 0,
      is_completed: userChallenge ? Boolean(userChallenge.is_completed) : false,
      completed_at: userChallenge?.completed_at ?? null,
    };
  }
}
