import { IPlayer } from '../models/Player';
import { Item, IItem } from '../models/Item';

export interface LevelUpResult {
  leveledUp: boolean;
  oldLevel: number;
  newLevel: number;
  bonusCoins: number;
  unlockedItems: IItem[];
}

export class ProgressionService {
  /**
   * Calculates XP required to reach the next level from the current level.
   * e.g., Level 1 -> 100 XP, Level 2 -> 240 XP, Level 5 -> 750 XP, Level 8 -> 1350 XP
   */
  public static getXpRequiredForNextLevel(currentLevel: number): number {
    if (currentLevel < 1) currentLevel = 1;
    // Clean curve rounded to nearest 10
    const raw = 100 * Math.pow(currentLevel, 1.25);
    return Math.round(raw / 10) * 10;
  }

  /**
   * Awards XP and Coins to the player, calculates level-ups,
   * bonus rewards, and automatically discovers unlocked items.
   */
  public static async addXpAndCoins(
    player: IPlayer,
    xpEarned: number,
    coinsEarned: number
  ): Promise<LevelUpResult> {
    const oldLevel = player.level;
    player.coins = Math.max(0, player.coins + coinsEarned);
    player.xp = Math.max(0, player.xp + xpEarned);

    let requiredXp = this.getXpRequiredForNextLevel(player.level);
    let leveledUp = false;
    let totalBonusCoins = 0;

    // Handle single or multi-level ups
    while (player.xp >= requiredXp) {
      player.xp -= requiredXp;
      player.level += 1;
      leveledUp = true;
      const levelBonus = player.level * 25;
      player.coins += levelBonus;
      totalBonusCoins += levelBonus;
      requiredXp = this.getXpRequiredForNextLevel(player.level);
    }

    const newlyUnlockedItems: IItem[] = [];

    if (leveledUp) {
      // Find all items unlocked by reaching or exceeding this level
      const eligibleItems = await Item.find({
        'unlockRequirement.type': 'level',
        'unlockRequirement.value': { $lte: player.level },
      });

      for (const item of eligibleItems) {
        if (!player.inventory.includes(item.itemId)) {
          // If the item unlock is purely milestone granted (price == 0), auto-add to inventory
          if (item.price === 0) {
            player.inventory.push(item.itemId);
          }
          newlyUnlockedItems.push(item);
        }
      }
    }

    return {
      leveledUp,
      oldLevel,
      newLevel: player.level,
      bonusCoins: totalBonusCoins,
      unlockedItems: newlyUnlockedItems,
    };
  }
}
