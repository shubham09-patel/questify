import React, { createContext, useContext, useEffect, useState } from 'react';
import { CompleteMissionResponse, Item, Player } from '../types';
import { equipmentApi, playerApi, shopApi } from '../services/api';
import { useAuth } from './AuthContext';
import { sound } from '../utils/soundService';

interface GameContextType {
  player: Player | null;
  nextLevelXp: number;
  inventory: Item[];
  equipped: Record<string, string>;
  levelUpData: {
    oldLevel: number;
    newLevel: number;
    bonusCoins: number;
    unlockedItems: Item[];
  } | null;
  dismissLevelUp: () => void;
  missionRewardToast: {
    xpEarned: number;
    coinsEarned: number;
    streakIncreased?: boolean;
    achievements?: any[];
  } | null;
  dismissRewardToast: () => void;
  refreshPlayer: () => Promise<void>;
  refreshInventory: () => Promise<void>;
  equipItem: (itemId: string) => Promise<void>;
  unequipSlot: (slot: string) => Promise<void>;
  buyShopItem: (itemId: string) => Promise<Item>;
  handleMissionReward: (res: CompleteMissionResponse) => void;
  isMuted: boolean;
  toggleSound: () => void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { player, setPlayer, isAuthenticated } = useAuth();
  const [nextLevelXp, setNextLevelXp] = useState<number>(100);
  const [inventory, setInventory] = useState<Item[]>([]);
  const [equipped, setEquipped] = useState<Record<string, string>>({});
  const [levelUpData, setLevelUpData] = useState<{
    oldLevel: number;
    newLevel: number;
    bonusCoins: number;
    unlockedItems: Item[];
  } | null>(null);
  const [missionRewardToast, setMissionRewardToast] = useState<{
    xpEarned: number;
    coinsEarned: number;
    streakIncreased?: boolean;
    achievements?: any[];
  } | null>(null);
  const [isMuted, setIsMuted] = useState<boolean>(sound.isMuted());

  const refreshPlayer = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await playerApi.getPlayer();
      if (data.success) {
        setPlayer(data.player);
        setNextLevelXp(data.nextLevelXp);
        setEquipped(data.player.equipped as any);
      }
    } catch (err) {
      // Ignored if offline
    }
  };

  const refreshInventory = async () => {
    if (!isAuthenticated) return;
    try {
      const data = await playerApi.getInventory();
      if (data.success) {
        setInventory(data.inventory);
        setEquipped(data.equipped);
      }
    } catch (err) {
      // Ignored
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      refreshPlayer();
      refreshInventory();
    }
  }, [isAuthenticated]);

  const toggleSound = () => {
    const muted = sound.toggleMute();
    setIsMuted(muted);
    if (!muted) {
      sound.playClick();
    }
  };

  const equipItem = async (itemId: string) => {
    const res = await equipmentApi.equip(itemId);
    if (res.success) {
      sound.playEquip();
      setEquipped(res.equipped);
      if (player) {
        setPlayer({ ...player, equipped: res.equipped as any });
      }
    }
  };

  const unequipSlot = async (slot: string) => {
    const res = await equipmentApi.unequip(slot);
    if (res.success) {
      sound.playClick();
      setEquipped(res.equipped);
      if (player) {
        setPlayer({ ...player, equipped: res.equipped as any });
      }
    }
  };

  const buyShopItem = async (itemId: string) => {
    const res = await shopApi.buyItem(itemId);
    if (res.success) {
      sound.playBuy();
      if (player) {
        setPlayer({
          ...player,
          coins: res.coins,
          inventory: res.inventory,
        });
      }
      await refreshInventory();
      return res.purchasedItem;
    }
    throw new Error('Purchase failed');
  };

  const handleMissionReward = (res: CompleteMissionResponse) => {
    sound.playMissionComplete();

    // Update player state
    if (player) {
      setPlayer({
        ...player,
        xp: res.progression.currentXp,
        level: res.progression.newLevel,
        coins: res.progression.coins,
        streak: res.progression.streak,
        totalMissionsCompleted: (player.totalMissionsCompleted || 0) + 1,
      });
      setNextLevelXp(res.progression.nextLevelXp);
    }

    // Trigger celebration toast
    setMissionRewardToast({
      xpEarned: res.rewards.xpEarned,
      coinsEarned: res.rewards.coinsEarned,
      streakIncreased: res.progression.streakIncreased,
      achievements: res.newlyUnlockedAchievements,
    });

    // If leveled up, trigger epic level up modal!
    if (res.progression.leveledUp) {
      setTimeout(() => {
        sound.playLevelUp();
        setLevelUpData({
          oldLevel: res.progression.oldLevel,
          newLevel: res.progression.newLevel,
          bonusCoins: res.progression.bonusCoins,
          unlockedItems: res.progression.unlockedItems || [],
        });
      }, 500);
    }
  };

  const dismissLevelUp = () => setLevelUpData(null);
  const dismissRewardToast = () => setMissionRewardToast(null);

  return (
    <GameContext.Provider
      value={{
        player,
        nextLevelXp,
        inventory,
        equipped,
        levelUpData,
        dismissLevelUp,
        missionRewardToast,
        dismissRewardToast,
        refreshPlayer,
        refreshInventory,
        equipItem,
        unequipSlot,
        buyShopItem,
        handleMissionReward,
        isMuted,
        toggleSound,
      }}
    >
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within a GameProvider');
  return ctx;
};
