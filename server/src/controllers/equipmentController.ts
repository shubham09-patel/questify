import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Player, IEquippedItems } from '../models/Player';
import { Item } from '../models/Item';

export class EquipmentController {
  public static async equip(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { itemId } = req.body;

      if (!itemId) {
        res.status(400).json({ success: false, error: 'itemId is required.' });
        return;
      }

      const player = await Player.findOne({ userId });
      if (!player) {
        res.status(404).json({ success: false, error: 'Player profile not found.' });
        return;
      }

      // Check ownership
      if (!player.inventory.includes(itemId)) {
        res.status(403).json({ success: false, error: 'You do not own this item.' });
        return;
      }

      const item = await Item.findOne({ itemId });
      if (!item) {
        res.status(404).json({ success: false, error: 'Item record not found.' });
        return;
      }

      // Check character compatibility
      if (
        item.characterCompatibility !== 'both' &&
        item.characterCompatibility !== player.character
      ) {
        res.status(400).json({
          success: false,
          error: `This item is not compatible with ${player.character} character model.`,
        });
        return;
      }

      const slot = item.type as keyof IEquippedItems;
      if (!player.equipped) {
        player.equipped = {};
      }

      player.equipped[slot] = item.itemId;
      player.markModified('equipped');
      await player.save();

      res.json({
        success: true,
        message: `Equipped ${item.name}!`,
        equipped: player.equipped,
        equippedItem: item,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async unequip(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const userId = req.user!.userId;
      const { slot } = req.body;

      const validSlots = [
        'hair',
        'head',
        'clothes',
        'armor',
        'pants',
        'shoes',
        'weapon',
        'accessory',
      ];

      if (!slot || !validSlots.includes(slot)) {
        res.status(400).json({ success: false, error: `Invalid slot. Must be one of: ${validSlots.join(', ')}` });
        return;
      }

      const player = await Player.findOne({ userId });
      if (!player) {
        res.status(404).json({ success: false, error: 'Player profile not found.' });
        return;
      }

      if (player.equipped) {
        player.equipped[slot as keyof IEquippedItems] = '';
        player.markModified('equipped');
        await player.save();
      }

      res.json({
        success: true,
        message: `Unequipped ${slot}.`,
        equipped: player.equipped,
      });
    } catch (error) {
      next(error);
    }
  }
}
