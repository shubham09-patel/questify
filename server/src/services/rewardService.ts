import { MissionDifficulty, MissionCategory } from '../models/Mission';

export interface MissionRewards {
  xpReward: number;
  coinReward: number;
}

const DIFFICULTY_REWARDS: Record<MissionDifficulty, { xp: number; coins: number }> = {
  easy: { xp: 20, coins: 10 },
  normal: { xp: 45, coins: 25 },
  hard: { xp: 85, coins: 45 },
  epic: { xp: 180, coins: 90 },
  legendary: { xp: 400, coins: 200 },
};

export class RewardService {
  /**
   * Authoritative server-side reward calculation based on difficulty and category.
   * Client values are never trusted.
   */
  public static calculateMissionRewards(
    difficulty: MissionDifficulty,
    category: MissionCategory
  ): MissionRewards {
    const base = DIFFICULTY_REWARDS[difficulty] || DIFFICULTY_REWARDS.normal;
    let multiplier = 1.0;

    // Category modifiers or special flavor
    if (category === 'special') {
      multiplier = 1.25;
    }

    return {
      xpReward: Math.round(base.xp * multiplier),
      coinReward: Math.round(base.coins * multiplier),
    };
  }
}
