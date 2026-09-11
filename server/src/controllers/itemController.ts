import { Request, Response, NextFunction } from 'express';
import { Item } from '../models/Item';

export class ItemController {
  public static async getItems(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { type, rarity, character } = req.query;

      const filter: any = {};
      if (type && type !== 'all') {
        filter.type = type;
      }
      if (rarity && rarity !== 'all') {
        filter.rarity = rarity;
      }
      if (character && character !== 'both') {
        filter.characterCompatibility = { $in: [character, 'both'] };
      }

      const items = await Item.find(filter).sort({ price: 1, rarity: 1 });

      res.json({
        success: true,
        count: items.length,
        items,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async getItemById(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const id = String(req.params.id);
      const isObjectId = /^[0-9a-fA-F]{24}$/.test(id);
      const item = await Item.findOne({
        $or: [{ itemId: id }, { _id: isObjectId ? id : null }],
      });

      if (!item) {
        res.status(404).json({ success: false, error: 'Item not found.' });
        return;
      }

      res.json({ success: true, item });
    } catch (error) {
      next(error);
    }
  }
}
