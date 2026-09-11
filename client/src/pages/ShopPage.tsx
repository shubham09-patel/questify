import React, { useEffect, useState } from 'react';
import { ShoppingBag, Coins, Sparkles, Filter, CheckCircle } from 'lucide-react';
import { ItemCard } from '../components/ItemCard';
import { useGame } from '../context/GameContext';
import { itemsApi } from '../services/api';
import { Item } from '../types';

export const ShopPage: React.FC = () => {
  const { player, inventory, buyShopItem } = useGame();

  const [shopItems, setShopItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [purchaseMessage, setPurchaseMessage] = useState<string | null>(null);

  const fetchShopCatalog = async () => {
    setLoading(true);
    try {
      const res = await itemsApi.getItems();
      if (res.success) {
        setShopItems(res.items);
      }
    } catch (err) {
      // Handled
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShopCatalog();
  }, []);

  const handleBuy = async (itemId: string) => {
    try {
      const purchased = await buyShopItem(itemId);
      setPurchaseMessage(`🎉 Acquired ${purchased.name}! Added to your inventory.`);
      setTimeout(() => setPurchaseMessage(null), 4000);
    } catch (err: any) {
      alert(err?.response?.data?.error || err.message || 'Could not complete purchase.');
    }
  };

  const filteredItems = shopItems.filter((item) => {
    if (filterType === 'all') return true;
    return item.type === filterType;
  });

  return (
    <div className="space-y-6">
      {/* Merchant Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-100 uppercase tracking-wider font-serif flex items-center gap-2.5">
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            The Adventurer's Armory
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Spend your hard-earned gold coins on legendary weapons, armor, and regalia.
          </p>
        </div>

        {/* Player Treasury Counter */}
        <div className="flex items-center gap-2 bg-amber-950/60 border border-amber-500/40 px-4 py-2 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.25)]">
          <Coins className="w-5 h-5 text-amber-400 animate-pulse" />
          <span className="text-sm text-amber-200 font-bold">Your Gold:</span>
          <span className="text-lg font-black text-amber-400 font-mono">
            {(player?.coins || 0).toLocaleString()} Coins
          </span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {purchaseMessage && (
        <div className="p-3 bg-emerald-950/70 border border-emerald-500/60 rounded-xl text-emerald-300 text-xs font-bold flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]">
          <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          {purchaseMessage}
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-4 flex flex-wrap gap-4 items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Catalog Filter:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {['all', 'weapon', 'armor', 'clothes', 'head', 'hair', 'shoes'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold capitalize transition-all ${
                filterType === type
                  ? 'bg-amber-500 text-black shadow'
                  : 'bg-slate-950 text-slate-400 hover:text-slate-200'
              }`}
            >
              {type === 'all' ? 'All Items' : type}
            </button>
          ))}
        </div>
      </div>

      {/* Shop Grid */}
      {loading ? (
        <div className="py-20 text-center text-sm text-slate-500 animate-pulse">
          Browsing the merchant's wares...
        </div>
      ) : filteredItems.length === 0 ? (
        <div className="py-20 text-center border-2 border-dashed border-slate-800 rounded-2xl bg-slate-900/30">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h4 className="text-base font-bold text-slate-300">Merchant Stock Empty</h4>
          <p className="text-xs text-slate-500 mt-1">
            Run the seed script with your MongoDB connection to populate the full catalog!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {filteredItems.map((item) => {
            const isOwned = inventory.some((invItem) => invItem.itemId === item.itemId);

            return (
              <ItemCard
                key={item.itemId}
                item={item}
                isOwned={isOwned}
                onBuy={handleBuy}
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
