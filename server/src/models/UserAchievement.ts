import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IUserAchievement extends Document {
  userId: Types.ObjectId;
  achievementId: string;
  progress: number;
  completed: boolean;
  completedAt: Date | null;
  claimedReward: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserAchievementSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    achievementId: {
      type: String,
      required: true,
      index: true,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    claimedReward: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

UserAchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true });

export const UserAchievement = mongoose.model<IUserAchievement>(
  'UserAchievement',
  UserAchievementSchema
);
