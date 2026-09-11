import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Player } from '../models/Player';
import { Item } from '../models/Item';

export class ShopController {
  public static async buyItem(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { itemId } = req.params;

      const player = await Player.findOne({ userId });
      if (!player) {
        res.status(404).json({ success: false, error: 'Player profile not found.' });
        return;
      }

      // Retrieve authoritative item information from MongoDB
      const item = await Item.findOne({ itemId });
      if (!item) {
        res.status(404).json({ success: false, error: 'Item not found in shop catalog.' });
        return;
      }

      // Check if user already owns this item
      if (player.inventory.includes(item.itemId)) {
        res.status(400).json({ success: false, error: 'You already own this item!' });
        return;
      }

      // Check character compatibility
      if (
        item.characterCompatibility !== 'both' &&
        item.characterCompatibility !== player.character
      ) {
        res.status(400).json({
          success: false,
          error: `This gear can only be equipped by ${item.characterCompatibility} characters.`,
        });
        return;
      }

      // Check level requirement
      if (
        item.unlockRequirement?.type === 'level' &&
        typeof item.unlockRequirement.value === 'number'
      ) {
        if (player.level < item.unlockRequirement.value) {
          res.status(400).json({
            success: false,
            error: `Requires Level ${item.unlockRequirement.value} to purchase. You are Level ${player.level}.`,
          });
          return;
        }
      }

      // Check streak requirement
      if (
        item.unlockRequirement?.type === 'streak' &&
        typeof item.unlockRequirement.value === 'number'
      ) {
        if (player.streak < item.unlockRequirement.value) {
          res.status(400).json({
            success: false,
            error: `Requires a ${item.unlockRequirement.value}-day streak to purchase. Your streak is ${player.streak}.`,
          });
          return;
        }
      }

      // Check coins
      if (player.coins < item.price) {
        res.status(400).json({
          success: false,
          error: `Insufficient coins! Need ${item.price} coins, but you have ${player.coins}. Complete more missions!`,
        });
        return;
      }

      // Deduct coins and append item to inventory
      player.coins -= item.price;
      player.inventory.push(item.itemId);
      await player.save();

      res.json({
        success: true,
        message: `Successfully purchased ${item.name}!`,
        purchasedItem: item,
        coins: player.coins,
        inventory: player.inventory,
      });
    } catch (error) {
      next(error);
    }
  }
}
