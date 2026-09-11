import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { User, Shield, Sparkles, RefreshCw, X, Check } from 'lucide-react';
import { CharacterRenderer } from '../components/CharacterRenderer';
import { RarityBadge } from '../components/RarityBadge';
import { useGame } from '../context/GameContext';
import { useAuth } from '../context/AuthContext';
import { playerApi } from '../services/api';
import { CharacterGender, Item, ItemType } from '../types';

export const CharacterPage: React.FC = () => {
  const { user } = useAuth();
  const { player, equipped, inventory, equipItem, unequipSlot, refreshPlayer } = useGame();

  const [switchingGender, setSwitchingGender] = useState(false);
  const [activeSlot, setActiveSlot] = useState<ItemType | 'all'>('all');

  const handleGenderSwitch = async (newGender: CharacterGender) => {
    if (!player || player.character === newGender) return;
    setSwitchingGender(true);
    try {
      await playerApi.switchCharacter(newGender);
      await refreshPlayer();
    } finally {
      setSwitchingGender(false);
    }
  };

  const slots: Array<{ id: ItemType; label: string; icon: string }> = [
    { id: 'hair', label: 'Hairstyle', icon: '💇' },
    { id: 'head', label: 'Head Gear', icon: '👑' },
    { id: 'clothes', label: 'Clothes', icon: '🥋' },
    { id: 'armor', label: 'Armor', icon: '🛡️' },
    { id: 'weapon', label: 'Weapon', icon: '⚔️' },
    { id: 'shoes', label: 'Footwear', icon: '👢' },
  ];

  // Filter inventory items compatible with current character and selected slot
  const filteredInventory = inventory.filter((item) => {
    const isCompatible =
      item.characterCompatibility === 'both' || item.characterCompatibility === player?.character;
    const matchesSlot = activeSlot === 'all' || item.type === activeSlot;
    return isCompatible && matchesSlot;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wider font-serif flex items-center gap-2.5">
          <User className="w-6 h-6 text-amber-400" />
          Hero Customization
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Customize your layered pixel-art avatar and equip vanquishing gear.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (5 cols): Character Showcase & Gender Switcher */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-gradient-to-b from-slate-900/90 via-[#101828] to-slate-950 border-2 border-slate-800 rounded-2xl p-6 text-center shadow-xl relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* Character Renderer Big Preview */}
            <div className="py-6 flex items-center justify-center">
              <CharacterRenderer
                character={player?.character || 'male'}
                equipped={equipped}
                size={180}
                animate={true}
                showPedestal={true}
              />
            </div>

            {/* Hero Name & Title */}
            <h3 className="text-xl font-black text-slate-100 font-serif">
              {user?.name || 'Hero of Questify'}
            </h3>
            <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
              Level {player?.level || 1}{' '}
              {player?.character === 'female' ? 'Sorceress Champion' : 'Paladin Knight'}
            </p>

            {/* Switch Character Model (Male / Female) */}
            <div className="mt-6 pt-4 border-t border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2.5">
                Base Hero Model
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleGenderSwitch('male')}
                  disabled={switchingGender || player?.character === 'male'}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    player?.character === 'male'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>Male</span>
                  {player?.character === 'male' && <Check className="w-3.5 h-3.5" />}
                </button>

                <button
                  type="button"
                  onClick={() => handleGenderSwitch('female')}
                  disabled={switchingGender || player?.character === 'female'}
                  className={`py-2 px-3 rounded-xl border text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                    player?.character === 'female'
                      ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span>Female</span>
                  {player?.character === 'female' && <Check className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>

          {/* Current Equipped Slots Card */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center gap-1.5">
              <Shield className="w-4 h-4 text-blue-400" />
              Equipped Armor & Relics
            </h4>

            <div className="grid grid-cols-2 gap-2">
              {slots.map((s) => {
                const itemId = equipped[s.id];
                const item = inventory.find((i) => i.itemId === itemId);

                return (
                  <div
                    key={s.id}
                    className="p-2.5 bg-slate-950/80 border border-slate-800 rounded-xl flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="text-base">{s.icon}</span>
                      <div className="min-w-0">
                        <span className="text-[10px] text-slate-400 font-bold uppercase block">
                          {s.label}
                        </span>
                        <span className="text-xs font-semibold text-slate-200 truncate block max-w-[90px]">
                          {item ? item.name : 'None'}
                        </span>
                      </div>
                    </div>

                    {item && (
                      <button
                        onClick={() => unequipSlot(s.id)}
                        className="p-1 rounded text-slate-500 hover:text-rose-400 hover:bg-rose-950/40"
                        title="Unequip"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column (7 cols): Wardrobe / Equipment Selector */}
        <div className="lg:col-span-7 space-y-4">
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-base font-bold text-slate-100 uppercase tracking-wider font-serif">
                  Wardrobe & Armory
                </h4>
                <p className="text-xs text-slate-400">Click any owned item to equip instantly.</p>
              </div>

              <span className="text-xs font-mono font-bold text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-lg">
                {filteredInventory.length} Items Available
              </span>
            </div>

            {/* Slot Filter Pills */}
            <div className="flex flex-wrap gap-1.5 mb-5 pb-3 border-b border-slate-800">
              <button
                onClick={() => setActiveSlot('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeSlot === 'all'
                    ? 'bg-amber-500 text-black shadow'
                    : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                }`}
              >
                All Gear
              </button>
              {slots.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setActiveSlot(s.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    activeSlot === s.id
                      ? 'bg-amber-500 text-black shadow'
                      : 'bg-slate-950 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <span>{s.icon}</span>
                  <span>{s.label}</span>
                </button>
              ))}
            </div>

            {/* Items Grid */}
            {filteredInventory.length === 0 ? (
              <div className="py-16 text-center border border-dashed border-slate-800 rounded-xl">
                <Sparkles className="w-8 h-8 text-slate-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">No items in this category yet.</p>
                <p className="text-[11px] text-slate-500 mt-1">
                  Visit the Shop or conquer missions to unlock more gear!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {filteredInventory.map((item) => {
                  const isEquipped = equipped[item.type] === item.itemId;

                  return (
                    <div
                      key={item.itemId}
                      className={`relative p-3 rounded-xl border flex flex-col justify-between transition-all ${
                        isEquipped
                          ? 'bg-amber-500/10 border-amber-400 ring-1 ring-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.2)]'
                          : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <RarityBadge rarity={item.rarity} size="sm" />
                        <span className="text-[10px] text-slate-500 uppercase font-mono">
                          {item.type}
                        </span>
                      </div>

                      <div className="my-2 h-16 flex items-center justify-center">
                        <img
                          src={item.asset}
                          alt={item.name}
                          className="w-12 h-12 object-contain"
                          style={{ imageRendering: 'pixelated' }}
                        />
                      </div>

                      <div>
                        <h5 className="text-xs font-bold text-slate-100 truncate mb-2">
                          {item.name}
                        </h5>

                        {isEquipped ? (
                          <button
                            onClick={() => unequipSlot(item.type)}
                            className="w-full py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold uppercase transition-colors"
                          >
                            Unequip
                          </button>
                        ) : (
                          <button
                            onClick={() => equipItem(item.itemId)}
                            className="w-full py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase transition-colors shadow"
                          >
                            Equip
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
