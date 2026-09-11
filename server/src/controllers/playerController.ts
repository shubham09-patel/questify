import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Player } from '../models/Player';
import { Item } from '../models/Item';
import { User } from '../models/User';
import { ProgressionService } from '../services/progressionService';

export class PlayerController {
  public static async getPlayer(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      let player = await Player.findOne({ userId });

      if (!player) {
        player = await Player.create({
          userId,
          character: 'male',
          level: 1,
          xp: 0,
          coins: 100,
          inventory: ['hair_short', 'tunic_novice', 'wooden_sword', 'boots_traveler'],
          equipped: {
            hair: 'hair_short',
            clothes: 'tunic_novice',
            weapon: 'wooden_sword',
            shoes: 'boots_traveler',
          },
        });
      }

      const nextLevelXp = ProgressionService.getXpRequiredForNextLevel(player.level);

      res.json({
        success: true,
        player,
        nextLevelXp,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async switchCharacter(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { character } = req.body;

      if (!['male', 'female'].includes(character)) {
        res.status(400).json({ success: false, error: 'Character must be male or female.' });
        return;
      }

      const player = await Player.findOne({ userId });
      if (!player) {
        res.status(404).json({ success: false, error: 'Player profile not found.' });
        return;
      }

      player.character = character;
      await player.save();

      res.json({
        success: true,
        message: `Hero switched to ${character}!`,
        player,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getInventory(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const player = await Player.findOne({ userId });

      if (!player) {
        res.status(404).json({ success: false, error: 'Player not found.' });
        return;
      }

      // Populate items based on the player's inventory itemIds
      const items = await Item.find({ itemId: { $in: player.inventory } });

      res.json({
        success: true,
        inventory: items,
        equipped: player.equipped,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async updateProfile(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { name } = req.body;

      if (!name || name.trim().length === 0) {
        res.status(400).json({ success: false, error: 'Name cannot be empty.' });
        return;
      }

      const user = await User.findByIdAndUpdate(
        userId,
        { name: name.trim() },
        { new: true }
      ).select('-passwordHash');

      res.json({
        success: true,
        message: 'Profile updated!',
        user,
      });
    } catch (error) {
      next(error);
    }
  }
}
