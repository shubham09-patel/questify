import { IPlayer } from '../models/Player';

export class StreakService {
  /**
   * Helper to format Date as YYYY-MM-DD
   */
  public static getTodayDateString(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Get yesterday's date string in YYYY-MM-DD
   */
  public static getYesterdayDateString(): string {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return yesterday.toISOString().split('T')[0];
  }

  /**
   * Updates player's streak based on actual calendar days.
   * Returns whether the streak was incremented.
   */
  public static updateStreak(player: IPlayer): { streakIncreased: boolean; currentStreak: number } {
    const today = this.getTodayDateString();
    const yesterday = this.getYesterdayDateString();

    let streakIncreased = false;

    if (!player.lastActiveDate) {
      player.streak = 1;
      player.lastActiveDate = today;
      streakIncreased = true;
    } else if (player.lastActiveDate === today) {
      // Already active today, maintain streak
      streakIncreased = false;
    } else if (player.lastActiveDate === yesterday) {
      // Consecutive day!
      player.streak = (player.streak || 0) + 1;
      player.lastActiveDate = today;
      streakIncreased = true;
    } else {
      // Missed one or more days, reset to 1
      player.streak = 1;
      player.lastActiveDate = today;
      streakIncreased = false;
    }

    return {
      streakIncreased,
      currentStreak: player.streak,
    };
  }
}
