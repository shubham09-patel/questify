import mongoose, { Schema, Document } from 'mongoose';

export type ItemType =
  | 'hair'
  | 'head'
  | 'clothes'
  | 'armor'
  | 'pants'
  | 'shoes'
  | 'weapon'
  | 'accessory';

export type ItemRarity =
  | 'common'
  | 'uncommon'
  | 'rare'
  | 'epic'
  | 'legendary'
  | 'mythic';

export type CharacterCompatibility = 'male' | 'female' | 'both';

export interface IUnlockRequirement {
  type: 'level' | 'coins' | 'achievement' | 'streak' | 'none';
  value?: any;
}

export interface IItem extends Document {
  itemId: string;
  name: string;
  type: ItemType;
  rarity: ItemRarity;
  characterCompatibility: CharacterCompatibility;
  price: number;
  unlockRequirement: IUnlockRequirement;
  asset: string;
  description: string;
  createdAt: Date;
}

const ItemSchema: Schema = new Schema(
  {
    itemId: {
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
    type: {
      type: String,
      enum: ['hair', 'head', 'clothes', 'armor', 'pants', 'shoes', 'weapon', 'accessory'],
      required: true,
      index: true,
    },
    rarity: {
      type: String,
      enum: ['common', 'uncommon', 'rare', 'epic', 'legendary', 'mythic'],
      default: 'common',
      index: true,
    },
    characterCompatibility: {
      type: String,
      enum: ['male', 'female', 'both'],
      default: 'both',
    },
    price: {
      type: Number,
      default: 0,
      min: 0,
    },
    unlockRequirement: {
      type: {
        type: String,
        enum: ['level', 'coins', 'achievement', 'streak', 'none'],
        default: 'none',
      },
      value: {
        type: Schema.Types.Mixed,
        default: null,
      },
    },
    asset: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export const Item = mongoose.model<IItem>('Item', ItemSchema);
