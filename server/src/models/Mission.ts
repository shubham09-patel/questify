import mongoose, { Schema, Document, Types } from 'mongoose';

export type MissionCategory = 'tech' | 'knowledge' | 'training' | 'daily' | 'work' | 'special';
export type MissionDifficulty = 'easy' | 'normal' | 'hard' | 'epic' | 'legendary';

export interface IMission extends Document {
  userId: Types.ObjectId;
  title: string;
  description?: string;
  category: MissionCategory;
  difficulty: MissionDifficulty;
  xpReward: number;
  coinReward: number;
  completed: boolean;
  dueDate?: Date | null;
  completedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const MissionSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    category: {
      type: String,
      enum: ['tech', 'knowledge', 'training', 'daily', 'work', 'special'],
      default: 'daily',
    },
    difficulty: {
      type: String,
      enum: ['easy', 'normal', 'hard', 'epic', 'legendary'],
      default: 'normal',
    },
    xpReward: {
      type: Number,
      required: true,
      min: 0,
    },
    coinReward: {
      type: Number,
      required: true,
      min: 0,
    },
    completed: {
      type: Boolean,
      default: false,
      index: true,
    },
    dueDate: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const Mission = mongoose.model<IMission>('Mission', MissionSchema);
