import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Mission, MissionCategory, MissionDifficulty } from '../models/Mission';
import { Player } from '../models/Player';
import { RewardService } from '../services/rewardService';
import { ProgressionService } from '../services/progressionService';
import { StreakService } from '../services/streakService';
import { AchievementService } from '../services/achievementService';
import { DailyQuestService } from '../services/dailyQuestService';

export class MissionController {
  public static async getMissions(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { category, completed, difficulty } = req.query;

      const filter: any = { userId };
      if (category && category !== 'all') {
        filter.category = category;
      }
      if (difficulty && difficulty !== 'all') {
        filter.difficulty = difficulty;
      }
      if (completed !== undefined && completed !== 'all') {
        filter.completed = completed === 'true';
      }

      const missions = await Mission.find(filter).sort({ completed: 1, dueDate: 1, createdAt: -1 });

      res.json({
        success: true,
        count: missions.length,
        missions,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getMissionById(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const mission = await Mission.findOne({ _id: req.params.id, userId });

      if (!mission) {
        res.status(404).json({ success: false, error: 'Mission not found.' });
        return;
      }

      res.json({ success: true, mission });
    } catch (error) {
      next(error);
    }
  }

  public static async createMission(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { title, description, category, difficulty, dueDate } = req.body;

      if (!title || title.trim().length === 0) {
        res.status(400).json({ success: false, error: 'Mission title is required.' });
        return;
      }

      const validCategory: MissionCategory = [
        'tech',
        'knowledge',
        'training',
        'daily',
        'work',
        'special',
      ].includes(category)
        ? category
        : 'daily';

      const validDifficulty: MissionDifficulty = [
        'easy',
        'normal',
        'hard',
        'epic',
        'legendary',
      ].includes(difficulty)
        ? difficulty
        : 'normal';

      // Authoritative backend reward calculation
      const rewards = RewardService.calculateMissionRewards(validDifficulty, validCategory);

      const mission = await Mission.create({
        userId,
        title: title.trim(),
        description: description?.trim() || '',
        category: validCategory,
        difficulty: validDifficulty,
        xpReward: rewards.xpReward,
        coinReward: rewards.coinReward,
        dueDate: dueDate ? new Date(dueDate) : null,
        completed: false,
      });

      res.status(201).json({
        success: true,
        message: 'Mission forged in the quest log!',
        mission,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateMission(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { title, description, category, difficulty, dueDate } = req.body;

      const mission = await Mission.findOne({ _id: req.params.id, userId });
      if (!mission) {
        res.status(404).json({ success: false, error: 'Mission not found.' });
        return;
      }

      if (title !== undefined) mission.title = title.trim();
      if (description !== undefined) mission.description = description.trim();
      if (dueDate !== undefined) mission.dueDate = dueDate ? new Date(dueDate) : null;

      let categoryChanged = false;
      let difficultyChanged = false;

      if (category && ['tech', 'knowledge', 'training', 'daily', 'work', 'special'].includes(category)) {
        mission.category = category;
        categoryChanged = true;
      }

      if (difficulty && ['easy', 'normal', 'hard', 'epic', 'legendary'].includes(difficulty)) {
        mission.difficulty = difficulty;
        difficultyChanged = true;
      }

      // Recalculate reward if difficulty or category changed and mission not completed
      if ((categoryChanged || difficultyChanged) && !mission.completed) {
        const rewards = RewardService.calculateMissionRewards(mission.difficulty, mission.category);
        mission.xpReward = rewards.xpReward;
        mission.coinReward = rewards.coinReward;
      }

      await mission.save();

      res.json({
        success: true,
        message: 'Mission updated.',
        mission,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async deleteMission(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const mission = await Mission.findOneAndDelete({ _id: req.params.id, userId });

      if (!mission) {
        res.status(404).json({ success: false, error: 'Mission not found.' });
        return;
      }

      res.json({
        success: true,
        message: 'Mission removed from your quest log.',
      });
    } catch (error) {
      next(error);
    }
  }

  public static async completeMission(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const mission = await Mission.findOne({ _id: req.params.id, userId });

      if (!mission) {
        res.status(404).json({ success: false, error: 'Mission not found.' });
        return;
      }

      if (mission.completed) {
        res.status(400).json({ success: false, error: 'This mission is already completed.' });
        return;
      }

      // Mark mission completed
      mission.completed = true;
      mission.completedAt = new Date();
      await mission.save();

      const player = await Player.findOne({ userId });
      if (!player) {
        res.status(404).json({ success: false, error: 'Player profile not found.' });
        return;
      }

      // Increment player stats
      player.totalMissionsCompleted = (player.totalMissionsCompleted || 0) + 1;

      // Update streak
      const streakInfo = StreakService.updateStreak(player);

      // Award XP & Coins through authoritative progression service
      const progression = await ProgressionService.addXpAndCoins(
        player,
        mission.xpReward,
        mission.coinReward
      );

      await player.save();

      // Check achievements
      const newlyUnlockedAchievements = await AchievementService.checkAndProgressAchievements(
        player.userId,
        player
      );

      // Update daily quests
      const updatedDailyQuests = await DailyQuestService.onMissionCompleted(
        player.userId,
        mission
      );

      // Calculate XP requirement for current level
      const nextLevelXp = ProgressionService.getXpRequiredForNextLevel(player.level);

      res.json({
        success: true,
        message: '⚔️ Mission Accomplished! Rewards granted.',
        rewards: {
          xpEarned: mission.xpReward,
          coinsEarned: mission.coinReward,
        },
        progression: {
          leveledUp: progression.leveledUp,
          oldLevel: progression.oldLevel,
          newLevel: progression.newLevel,
          bonusCoins: progression.bonusCoins,
          unlockedItems: progression.unlockedItems,
          currentXp: player.xp,
          nextLevelXp,
          coins: player.coins,
          streak: player.streak,
          streakIncreased: streakInfo.streakIncreased,
        },
        newlyUnlockedAchievements,
        updatedDailyQuests,
        mission,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async uncompleteMission(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const mission = await Mission.findOne({ _id: req.params.id, userId });

      if (!mission) {
        res.status(404).json({ success: false, error: 'Mission not found.' });
        return;
      }

      if (!mission.completed) {
        res.status(400).json({ success: false, error: 'Mission is not currently completed.' });
        return;
      }

      mission.completed = false;
      mission.completedAt = null;
      await mission.save();

      res.json({
        success: true,
        message: 'Mission returned to active quest list.',
        mission,
      });
    } catch (error) {
      next(error);
    }
  }
}
