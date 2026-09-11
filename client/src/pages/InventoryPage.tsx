import React, { useState } from 'react';
import { Backpack, Filter } from 'lucide-react';
import { ItemCard } from '../components/ItemCard';
import { useGame } from '../context/GameContext';
import { ItemRarity, ItemType } from '../types';

export const InventoryPage: React.FC = () => {
  const { player, inventory, equipped, equipItem, unequipSlot } = useGame();

  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedRarity, setSelectedRarity] = useState<string>('all');

  const filteredItems = inventory.filter((item) => {
    const matchesType = selectedType === 'all' || item.type === selectedType;
    const matchesRarity = selectedRarity === 'all' || item.rarity === selectedRarity;
    return matchesType && matchesRarity;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wider font-serif flex items-center gap-2.5">
            <Backpack className="w-6 h-6 text-amber-400" />
            Hero's Inventory
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Browse and manage all weapons, clothing, and artifacts you have unlocked.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl shadow-sm">
            🎒 {inventory.length} Total Items
          </span>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Filter Vault:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Slots</option>
            <option value="weapon">Weapons</option>
            <option value="armor">Armor</option>
            <option value="clothes">Clothes</option>
            <option value="head">Head Gear</option>
            <option value="hair">Hairstyles</option>
            <option value="shoes">Shoes</option>
          </select>

          {/* Rarity Filter */}
          <select
            value={selectedRarity}
            onChange={(e) => setSelectedRarity(e.target.value)}
            className="bg-slate-950 border border-slate-800 focus:border-amber-500 rounded-xl px-3 py-1.5 text-xs text-slate-200 outline-none"
          >
            <option value="all">All Rarities</option>
            <option value="common">Common</option>
            <option value="uncommon">Uncommon</option>
            <option value="rare">Rare</option>
            <option value="epic">Epic</option>
            <option value="legendary">Legendary</option>
            <option value="mythic">Mythic</option>
          </select>
        </div>
      </div>

      {/* Inventory Grid */}
      {filteredItems.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <Backpack className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">No Gear Matches Your Filter</h4>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your filters or head to the Shop to unlock fresh gear!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isEquipped = equipped[item.type] === item.itemId;

            return (
              <ItemCard
                key={item.itemId}
                item={item}
                isEquipped={isEquipped}
                isOwned={true}
                onEquip={equipItem}
                onUnequip={unequipSlot}
                playerCoins={player?.coins || 0}
                playerLevel={player?.level || 1}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};
