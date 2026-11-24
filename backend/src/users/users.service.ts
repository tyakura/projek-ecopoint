import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { nowIso } from '../common/game';
import { UserRow } from '../common/models';

const USER_COLUMNS = `id, name, email, username, password_hash, avatar, points, xp, level,
  total_waste, total_items, created_at, updated_at`;

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  private get db() {
    return this.database.db;
  }

  findById(id: string): UserRow | undefined {
    return this.db
      .prepare(`SELECT ${USER_COLUMNS} FROM users WHERE id = ?`)
      .get(id) as unknown as UserRow | undefined;
  }

  findByEmail(email: string): UserRow | undefined {
    return this.db
      .prepare(`SELECT ${USER_COLUMNS} FROM users WHERE email = ?`)
      .get(email) as unknown as UserRow | undefined;
  }

  findByUsername(username: string): UserRow | undefined {
    return this.db
      .prepare(`SELECT ${USER_COLUMNS} FROM users WHERE username = ?`)
      .get(username) as unknown as UserRow | undefined;
  }

  create(user: UserRow): void {
    this.db
      .prepare(
        `INSERT INTO users (id, name, email, username, password_hash, created_at, updated_at)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
      )
      .run(
        user.id,
        user.name,
        user.email,
        user.username,
        user.password_hash,
        user.created_at,
        user.updated_at,
      );
  }

  update(id: string, name: string, avatar: string): void {
    this.db
      .prepare('UPDATE users SET name = ?, avatar = ?, updated_at = ? WHERE id = ?')
      .run(name, avatar, nowIso(), id);
  }
}
