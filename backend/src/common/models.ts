export interface UserRow {
  id: string;
  name: string;
  email: string;
  username: string;
  password_hash: string;
  avatar: string | null;
  points: number;
  xp: number;
  level: number;
  total_waste: number;
  total_items: number;
  created_at: string;
  updated_at: string;
}

export interface CollectionRow {
  id: string;
  user_id: string;
  waste_type: string;
  amount: number;
  items_count: number;
  points_earned: number;
  created_at: string;
}

export interface LevelRow {
  id: number;
  level_number: number;
  title: string;
  xp_required: number;
  badge_icon: string | null;
}

export interface ChallengeRow {
  id: string;
  title: string;
  description: string | null;
  target: number;
  xp_reward: number;
  type: string;
  deadline: string;
  created_at: string;
}

export interface UserChallengeRow {
  id: string;
  user_id: string;
  challenge_id: string;
  progress: number;
  is_completed: number;
  completed_at: string | null;
}

export interface AchievementRow {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  condition_type: string;
  condition_value: number;
  unlocked_at?: string | null;
}

export interface RewardRow {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  points_required: number;
  image: string | null;
  stock: number;
  is_active: number;
}

export interface RedemptionRow {
  id: string;
  user_id: string;
  reward_id: string;
  points_used: number;
  status: string;
  created_at: string;
  reward_name?: string | null;
}

export interface LeaderboardEntry {
  rank: number;
  user_id: string;
  name: string;
  username: string;
  total_waste: number;
  level: number;
}

export interface Stats {
  waste_collected: number;
  active_users: number;
  collections: number;
  rewards_claimed: number;
}
