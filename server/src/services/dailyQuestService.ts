import { Types } from 'mongoose';
import { DailyQuest, IDailyQuest } from '../models/DailyQuest';
import { IMission } from '../models/Mission';
import { StreakService } from './streakService';

export class DailyQuestService {
  /**
   * Retrieves or initializes today's 3 daily quests for the player.
   */
  public static async getTodayQuests(userId: Types.ObjectId): Promise<IDailyQuest[]> {
    const today = StreakService.getTodayDateString();

    let quests = await DailyQuest.find({ userId, date: today });

    if (quests.length === 0) {
      // Create the default 3 daily challenges
      const templateQuests = [
        {
          userId,
          date: today,
          questKey: 'complete_3_missions',
          title: 'Daily Conquest',
          description: 'Complete 3 real-world missions today',
          targetCount: 3,
          currentCount: 0,
          xpReward: 80,
          coinReward: 40,
          completed: false,
          claimed: false,
        },
        {
          userId,
          date: today,
          questKey: 'complete_challenging',
          title: 'Trial of Might',
          description: 'Complete 1 Hard, Epic, or Legendary mission',
          targetCount: 1,
          currentCount: 0,
          xpReward: 65,
          coinReward: 35,
          completed: false,
          claimed: false,
        },
        {
          userId,
          date: today,
          questKey: 'complete_tech_knowledge',
          title: 'Scholar & Artisan',
          description: 'Complete a Tech, Knowledge, or Work mission',
          targetCount: 1,
          currentCount: 0,
          xpReward: 45,
          coinReward: 25,
          completed: false,
          claimed: false,
        },
      ];

      try {
        quests = await DailyQuest.insertMany(templateQuests);
      } catch (err) {
        // In case of race condition
        quests = await DailyQuest.find({ userId, date: today });
      }
    }

    return quests;
  }

  /**
   * Updates daily quest progress whenever a mission is completed.
   */
  public static async onMissionCompleted(
    userId: Types.ObjectId,
    mission: IMission
  ): Promise<IDailyQuest[]> {
    const today = StreakService.getTodayDateString();
    const quests = await this.getTodayQuests(userId);
    const updatedQuests: IDailyQuest[] = [];

    for (const quest of quests) {
      if (quest.completed) continue;

      let increment = 0;

      if (quest.questKey === 'complete_3_missions') {
        increment = 1;
      } else if (quest.questKey === 'complete_challenging') {
        if (['hard', 'epic', 'legendary'].includes(mission.difficulty)) {
          increment = 1;
        }
      } else if (quest.questKey === 'complete_tech_knowledge') {
        if (['tech', 'knowledge', 'work'].includes(mission.category)) {
          increment = 1;
        }
      }

      if (increment > 0) {
        quest.currentCount = Math.min(quest.targetCount, quest.currentCount + increment);
        if (quest.currentCount >= quest.targetCount) {
          quest.completed = true;
        }
        await quest.save();
        updatedQuests.push(quest);
      }
    }

    return updatedQuests;
  }
}
