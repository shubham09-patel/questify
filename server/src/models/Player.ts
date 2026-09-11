import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IEquippedItems {
  hair?: string;
  head?: string;
  clothes?: string;
  armor?: string;
  pants?: string;
  shoes?: string;
  weapon?: string;
  accessory?: string;
}

export interface IPlayer extends Document {
  userId: Types.ObjectId;
  character: 'male' | 'female';
  level: number;
  xp: number;
  coins: number;
  streak: number;
  lastActiveDate: string; // YYYY-MM-DD
  inventory: string[]; // array of itemIds
  equipped: IEquippedItems;
  totalMissionsCompleted: number;
  createdAt: Date;
  updatedAt: Date;
}

const PlayerSchema: Schema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
      index: true,
    },
    character: {
      type: String,
      enum: ['male', 'female'],
      default: 'male',
    },
    level: {
      type: Number,
      default: 1,
      min: 1,
    },
    xp: {
      type: Number,
      default: 0,
      min: 0,
    },
    coins: {
      type: Number,
      default: 100, // Starter coins
      min: 0,
    },
    streak: {
      type: Number,
      default: 1,
      min: 0,
    },
    lastActiveDate: {
      type: String,
      default: () => new Date().toISOString().split('T')[0],
    },
    inventory: {
      type: [String],
      default: [
        'hair_short',
        'tunic_novice',
        'boots_traveler',
        'wooden_sword',
      ],
    },
    equipped: {
      hair: { type: String, default: 'hair_short' },
      head: { type: String, default: '' },
      clothes: { type: String, default: 'tunic_novice' },
      armor: { type: String, default: '' },
      pants: { type: String, default: '' },
      shoes: { type: String, default: 'boots_traveler' },
      weapon: { type: String, default: 'wooden_sword' },
      accessory: { type: String, default: '' },
    },
    totalMissionsCompleted: {
      type: Number,
      default: 0,
      min: 0,
    },
  },
  {
    timestamps: true,
  }
);

export const Player = mongoose.model<IPlayer>('Player', PlayerSchema);
