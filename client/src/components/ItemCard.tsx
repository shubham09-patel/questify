import React, { useState } from 'react';
import { ShieldCheck, Coins, Lock, Check } from 'lucide-react';
import { Item } from '../types';
import { RarityBadge } from './RarityBadge';

interface ItemCardProps {
  item: Item;
  isEquipped?: boolean;
  isOwned?: boolean;
  onEquip?: (itemId: string) => Promise<void>;
  onUnequip?: (slot: string) => Promise<void>;
  onBuy?: (itemId: string) => Promise<void>;
  playerCoins?: number;
  playerLevel?: number;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  isEquipped = false,
  isOwned = false,
  onEquip,
  onUnequip,
  onBuy,
  playerCoins = 0,
  playerLevel = 1,
}) => {
  const [loading, setLoading] = useState(false);

  const isLevelLocked =
    item.unlockRequirement?.type === 'level' &&
    typeof item.unlockRequirement.value === 'number' &&
    playerLevel < item.unlockRequirement.value;

  const canAfford = playerCoins >= item.price;

  const handleAction = async () => {
    setLoading(true);
    try {
      if (isEquipped && onUnequip) {
        await onUnequip(item.type);
      } else if (isOwned && onEquip) {
        await onEquip(item.itemId);
      } else if (!isOwned && onBuy) {
        await onBuy(item.itemId);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`relative flex flex-col justify-between bg-slate-900/90 border rounded-xl p-3.5 transition-all duration-200 ${
        isEquipped
          ? 'border-amber-400/80 shadow-[0_0_15px_rgba(245,158,11,0.25)] ring-1 ring-amber-400/50'
          : 'border-slate-800 hover:border-slate-700 hover:shadow-md'
      }`}
    >
      {/* Top Bar: Rarity & Type */}
      <div className="flex items-center justify-between mb-2">
        <RarityBadge rarity={item.rarity} size="sm" />
        <span className="text-[10px] uppercase font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
          {item.type}
        </span>
      </div>

      {/* Item Image Display */}
      <div className="relative w-full h-24 my-2 flex items-center justify-center bg-slate-950/70 border border-slate-800/80 rounded-lg overflow-hidden group">
        <img
          src={item.asset}
          alt={item.name}
          className="w-16 h-16 object-contain filter drop-shadow-[0_0_8px_rgba(255,255,255,0.15)] group-hover:scale-110 transition-transform duration-200"
          style={{ imageRendering: 'pixelated' }}
        />
        {isEquipped && (
          <div className="absolute top-1.5 right-1.5 bg-amber-500 text-black rounded-full p-1 shadow">
            <Check className="w-3 h-3 stroke-[3]" />
          </div>
        )}
      </div>

      {/* Item Meta */}
      <div className="mb-3">
        <h4 className="text-xs font-bold text-slate-100 truncate">{item.name}</h4>
        <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">{item.description}</p>

        {/* Requirements info if level locked */}
        {isLevelLocked && (
          <div className="mt-1 flex items-center gap-1 text-[10px] text-rose-400 font-semibold">
            <Lock className="w-3 h-3" />
            Req. Level {item.unlockRequirement.value}
          </div>
        )}
      </div>

      {/* Action CTA */}
      <div>
        {isEquipped ? (
          <button
            onClick={handleAction}
            disabled={loading}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-slate-800 hover:bg-slate-700 text-amber-400 border border-amber-500/40 transition-colors flex items-center justify-center gap-1"
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            Equipped (Unequip)
          </button>
        ) : isOwned ? (
          <button
            onClick={handleAction}
            disabled={loading}
            className="w-full py-1.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-500 text-white transition-colors flex items-center justify-center gap-1 shadow-[0_0_10px_rgba(59,130,246,0.3)]"
          >
            Equip
          </button>
        ) : (
          <button
            onClick={handleAction}
            disabled={loading || isLevelLocked || !canAfford}
            className={`w-full py-1.5 px-3 rounded-lg text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all ${
              isLevelLocked || !canAfford
                ? 'bg-slate-800 text-slate-500 border border-slate-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black shadow-[0_0_10px_rgba(245,158,11,0.35)]'
            }`}
          >
            <Coins className="w-3.5 h-3.5" />
            {item.price} Coins
          </button>
        )}
      </div>
    </div>
  );
};
