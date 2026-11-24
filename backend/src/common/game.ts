import { randomBytes } from 'node:crypto';
import { UserRow } from './models';

export function newId(): string {
  return randomBytes(16).toString('hex');
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function calcPoints(amount: number, items: number): number {
  return Math.round(amount * 100) + items * 25;
}

export function levelTitle(xp: number): string {
  const titles: Array<[number, string]> = [
    [0, 'Eco Starter'],
    [500, 'Green Explorer'],
    [1500, 'Eco Warrior'],
    [3000, 'Earth Guardian'],
  ];
  let current = 'Eco Starter';
  for (const [threshold, title] of titles) {
    if (xp >= threshold) {
      current = title;
    }
  }
  return current;
}

export function publicUser(user: UserRow) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    username: user.username,
    avatar: user.avatar ?? null,
    points: user.points,
    xp: user.xp,
    level: user.level,
    level_title: levelTitle(user.xp),
    total_waste: user.total_waste,
    total_items: user.total_items,
    created_at: user.created_at,
  };
}
