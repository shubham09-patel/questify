export type CharacterGender = 'male' | 'female';

export type MissionCategory = 'tech' | 'knowledge' | 'training' | 'daily' | 'work' | 'special';
export type MissionDifficulty = 'easy' | 'normal' | 'hard' | 'epic' | 'legendary';

export type ItemType =
  | 'hair'
  | 'head'
  | 'clothes'
  | 'armor'
  | 'pants'
  | 'shoes'
  | 'weapon'
  | 'accessory';

export type ItemRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export interface IEquippedItems {
  hair?: string;
  head?: string;
  clothes?: string;
  armor?: string;
  pants?: string;
  shoes?: string;
  weapon?: string;
  accessory?: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface Player {
  _id: string;
  userId: string;
  character: CharacterGender;
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string;
  inventory: string[];
  equipped: IEquippedItems;
  totalMissionsCompleted: number;
  createdAt: string;
  updatedAt: string;
}

export interface Mission {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  dueDate?: string | null;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Item {
  _id: string;
  itemId: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  characterCompatibility: 'male' | 'female' | 'both';
  price: number;
  unlockRequirement: {
    type: 'level' | 'coins' | 'achievement' | 'streak' | 'none';
    value?: any;
  };
  asset: string;
  description: string;
}

export interface Achievement {
  _id: string;
  achievementId: string;
  name: string;
  description: string;
  requirement: {
    type: string;
    target: number;
  };
  reward: {
    xp?: number;
    coins?: number;
    itemId?: string;
  };
  icon: string;
  progress?: number;
  completed?: boolean;
  completedAt?: string | null;
}

export interface DailyQuest {
  _id: string;
  userId: string;
  date: string;
  questKey: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  claimed: boolean;
}

export interface CompleteMissionResponse {
  success: boolean;
  message: string;
  rewards: {
    xpEarned: number;
    coinsEarned: number;
  };
  progression: {
    leveledUp: boolean;
    oldLevel: number;
    newLevel: number;
    bonusCoins: number;
    unlockedItems: Item[];
    currentXp: number;
    nextLevelXp: number;
    coins: number;
    streak: number;
    streakIncreased: boolean;
  };
  newlyUnlockedAchievements: Array<{
    achievement: Achievement;
    rewardEarned: {
      xp?: number;
      coins?: number;
      itemId?: string;
    };
  }>;
  updatedDailyQuests: DailyQuest[];
  mission: Mission;
}
