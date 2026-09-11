import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { DailyQuestService } from '../services/dailyQuestService';
import { DailyQuest } from '../models/DailyQuest';
import { Player } from '../models/Player';
import { ProgressionService } from '../services/progressionService';

export class DailyQuestController {
  public static async getDailyQuests(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const quests = await DailyQuestService.getTodayQuests(userId as any);

      res.json({
        success: true,
        count: quests.length,
        quests,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async claimReward(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { id } = req.params;

      const quest = await DailyQuest.findOne({ _id: id, userId });
      if (!quest) {
        res.status(404).json({ success: false, error: 'Daily quest not found.' });
        return;
      }

      if (!quest.completed) {
        res.status(400).json({ success: false, error: 'Quest is not yet completed!' });
        return;
      }

      if (quest.claimed) {
        res.status(400).json({ success: false, error: 'Reward already claimed!' });
        return;
      }

      quest.claimed = true;
      await quest.save();

      const player = await Player.findOne({ userId });
      if (!player) {
        res.status(404).json({ success: false, error: 'Player profile not found.' });
        return;
      }

      const progression = await ProgressionService.addXpAndCoins(
        player,
        quest.xpReward,
        quest.coinReward
      );

      await player.save();

      res.json({
        success: true,
        message: 'Daily Quest reward claimed!',
        reward: {
          xpEarned: quest.xpReward,
          coinsEarned: quest.coinReward,
        },
        progression,
        quest,
      });
    } catch (error) {
      next(error);
    }
  }
}
