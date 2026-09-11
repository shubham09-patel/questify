import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IDailyQuest extends Document {
  userId: Types.ObjectId;
  date: string; // YYYY-MM-DD
  questKey: string;
  title: string;
  description: string;
  targetCount: number;
  currentCount: number;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  claimed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DailyQuestSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    date: {
      type: String,
      required: true,
      index: true,
    },
    questKey: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    targetCount: {
      type: Number,
      required: true,
      default: 1,
    },
    currentCount: {
      type: Number,
      default: 0,
    },
    xpReward: {
      type: Number,
      default: 50,
    },
    coinReward: {
      type: Number,
      default: 25,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    claimed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

DailyQuestSchema.index({ userId: 1, date: 1, questKey: 1 }, { unique: true });

export const DailyQuest = mongoose.model<IDailyQuest>('DailyQuest', DailyQuestSchema);
