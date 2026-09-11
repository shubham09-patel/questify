import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Achievement } from '../models/Achievement';
import { UserAchievement } from '../models/UserAchievement';
import { Player } from '../models/Player';

export class AchievementController {
  public static async getAchievements(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const [allAchievements, userAchievements, player] = await Promise.all([
        Achievement.find({}).sort({ 'requirement.target': 1 }),
        UserAchievement.find({ userId }),
        Player.findOne({ userId }),
      ]);

      const userAchMap = new Map<string, any>();
      for (const ua of userAchievements) {
        userAchMap.set(ua.achievementId, ua);
      }

      const results = allAchievements.map((ach) => {
        const ua = userAchMap.get(ach.achievementId);
        let currentProgress = ua?.progress || 0;

        // Fallback calculate live progress if not recorded
        if (!ua && player) {
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
          }
        }

        return {
          ...ach.toObject(),
          progress: Math.min(ach.requirement.target, currentProgress),
          completed: ua ? ua.completed : currentProgress >= ach.requirement.target,
          completedAt: ua?.completedAt || null,
        };
      });

      res.json({
        success: true,
        count: results.length,
        achievements: results,
      });
    } catch (error) {
      next(error);
    }
  }
}
