import mongoose, { Schema, Document } from 'mongoose';

export interface IAchievementRequirement {
  type: 'missions_completed' | 'level' | 'streak' | 'items_owned' | 'coins_earned';
  target: number;
}

export interface IAchievementReward {
  xp?: number;
  coins?: number;
  itemId?: string;
}

export interface IAchievement extends Document {
  achievementId: string;
  name: string;
  description: string;
  requirement: IAchievementRequirement;
  reward: IAchievementReward;
  icon: string;
  createdAt: Date;
}

const AchievementSchema: Schema = new Schema(
  {
    achievementId: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirement: {
      type: {
        type: String,
        required: true,
      },
      target: {
        type: Number,
        required: true,
      },
    },
    reward: {
      xp: { type: Number, default: 0 },
      coins: { type: Number, default: 0 },
      itemId: { type: String, default: null },
    },
    icon: {
      type: String,
      default: '🏆',
    },
  },
  {
    timestamps: true,
  }
);

export const Achievement = mongoose.model<IAchievement>('Achievement', AchievementSchema);
