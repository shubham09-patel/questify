import { Types } from 'mongoose';
import { IPlayer } from '../models/Player';
import { Achievement, IAchievement } from '../models/Achievement';
import { UserAchievement, IUserAchievement } from '../models/UserAchievement';

export interface UnlockedAchievementInfo {
  achievement: IAchievement;
  userAchievement: IUserAchievement;
  rewardEarned: {
    xp?: number;
    coins?: number;
    itemId?: string;
  };
}

export class AchievementService {
  /**
   * Evaluates all achievement criteria for a player and unlocks any newly earned ones.
   */
  public static async checkAndProgressAchievements(
    userId: Types.ObjectId,
    player: IPlayer
  ): Promise<UnlockedAchievementInfo[]> {
    const allAchievements = await Achievement.find({});
    const unlockedList: UnlockedAchievementInfo[] = [];

    for (const ach of allAchievements) {
      // Find or create UserAchievement record
      let userAch = await UserAchievement.findOne({
        userId,
        achievementId: ach.achievementId,
      });

      if (!userAch) {
        userAch = new UserAchievement({
          userId,
          achievementId: ach.achievementId,
          progress: 0,
          completed: false,
          claimedReward: false,
        });
      }

      if (userAch.completed) {
        continue;
      }

      // Calculate progress depending on requirement type
      let currentProgress = 0;
      switch (ach.requirement.type) {
        case 'missions_completed':
          currentProgress = player.totalMissionsCompleted || 0;
          break;
        case 'level':
          currentProgress = player.level || 1;
          break;
        case 'streak':
          currentProgress = player.streak || 0;
          break;
        case 'items_owned':
          currentProgress = player.inventory?.length || 0;
          break;
        case 'coins_earned':
          currentProgress = player.coins || 0;
          break;
        default:
          currentProgress = 0;
      }

      userAch.progress = currentProgress;

      if (currentProgress >= ach.requirement.target) {
        userAch.completed = true;
        userAch.completedAt = new Date();
        userAch.claimedReward = true;

        // Apply reward to player
        if (ach.reward.coins) {
          player.coins = (player.coins || 0) + ach.reward.coins;
        }
        if (ach.reward.xp) {
          player.xp = (player.xp || 0) + ach.reward.xp;
        }
        if (ach.reward.itemId && !player.inventory.includes(ach.reward.itemId)) {
          player.inventory.push(ach.reward.itemId);
        }

        unlockedList.push({
          achievement: ach,
          userAchievement: userAch,
          rewardEarned: ach.reward,
        });
      }

      await userAch.save();
    }

    return unlockedList;
  }
}
