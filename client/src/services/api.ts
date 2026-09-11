import axios from 'axios';
import {
  CharacterGender,
  CompleteMissionResponse,
  DailyQuest,
  Item,
  Mission,
  Player,
  User,
} from '../types';

const rawApiUrl = (import.meta.env.VITE_API_URL as string | undefined)?.trim();
const API_BASE = rawApiUrl
  ? (rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/+$/, '')}/api`)
  : '/api';

export const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor to attach token if stored in localStorage
api.interceptors.request.use((reqConfig) => {
  const token = localStorage.getItem('questify_jwt_token');
  if (token && reqConfig.headers) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

export const authApi = {
  register: async (data: {
    email: string;
    password: string;
    name?: string;
    character: CharacterGender;
  }) => {
    const res = await api.post<{ success: boolean; token: string; user: User; player: Player }>(
      '/auth/register',
      data
    );
    if (res.data.token) {
      localStorage.setItem('questify_jwt_token', res.data.token);
    }
    return res.data;
  },

  login: async (data: { email: string; password: string }) => {
    const res = await api.post<{ success: boolean; token: string; user: User; player: Player }>(
      '/auth/login',
      data
    );
    if (res.data.token) {
      localStorage.setItem('questify_jwt_token', res.data.token);
    }
    return res.data;
  },

  logout: async () => {
    localStorage.removeItem('questify_jwt_token');
    return api.post('/auth/logout');
  },

  getMe: async () => {
    const res = await api.get<{ success: boolean; user: User; player: Player }>('/auth/me');
    return res.data;
  },
};

export const playerApi = {
  getPlayer: async () => {
    const res = await api.get<{ success: boolean; player: Player; nextLevelXp: number }>('/player');
    return res.data;
  },

  switchCharacter: async (character: CharacterGender) => {
    const res = await api.patch<{ success: boolean; message: string; player: Player }>(
      '/player/character',
      { character }
    );
    return res.data;
  },

  getInventory: async () => {
    const res = await api.get<{
      success: boolean;
      inventory: Item[];
      equipped: Record<string, string>;
    }>('/player/inventory');
    return res.data;
  },

  updateProfile: async (name: string) => {
    const res = await api.patch<{ success: boolean; message: string; user: User }>(
      '/player/profile',
      { name }
    );
    return res.data;
  },
};

export const missionsApi = {
  getMissions: async (params?: { category?: string; difficulty?: string; completed?: string }) => {
    const res = await api.get<{ success: boolean; count: number; missions: Mission[] }>(
      '/missions',
      { params }
    );
    return res.data;
  },

  createMission: async (data: {
    title: string;
    description?: string;
    category: string;
    difficulty: string;
    dueDate?: string | null;
  }) => {
    const res = await api.post<{ success: boolean; message: string; mission: Mission }>(
      '/missions',
      data
    );
    return res.data;
  },

  updateMission: async (
    id: string,
    data: {
      title?: string;
      description?: string;
      category?: string;
      difficulty?: string;
      dueDate?: string | null;
    }
  ) => {
    const res = await api.patch<{ success: boolean; message: string; mission: Mission }>(
      `/missions/${id}`,
      data
    );
    return res.data;
  },

  deleteMission: async (id: string) => {
    const res = await api.delete<{ success: boolean; message: string }>(`/missions/${id}`);
    return res.data;
  },

  completeMission: async (id: string) => {
    const res = await api.post<CompleteMissionResponse>(`/missions/${id}/complete`);
    return res.data;
  },

  uncompleteMission: async (id: string) => {
    const res = await api.post<{ success: boolean; message: string; mission: Mission }>(
      `/missions/${id}/uncomplete`
    );
    return res.data;
  },
};

export const itemsApi = {
  getItems: async (params?: { type?: string; rarity?: string; character?: string }) => {
    const res = await api.get<{ success: boolean; count: number; items: Item[] }>('/items', {
      params,
    });
    return res.data;
  },

  getItemById: async (id: string) => {
    const res = await api.get<{ success: boolean; item: Item }>(`/items/${id}`);
    return res.data;
  },
};

export const shopApi = {
  buyItem: async (itemId: string) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      purchasedItem: Item;
      coins: number;
      inventory: string[];
    }>(`/shop/${itemId}/buy`);
    return res.data;
  },
};

export const equipmentApi = {
  equip: async (itemId: string) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      equipped: Record<string, string>;
      equippedItem: Item;
    }>('/equipment/equip', { itemId });
    return res.data;
  },

  unequip: async (slot: string) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      equipped: Record<string, string>;
    }>('/equipment/unequip', { slot });
    return res.data;
  },
};

export const achievementsApi = {
  getAchievements: async () => {
    const res = await api.get<{ success: boolean; count: number; achievements: any[] }>(
      '/achievements'
    );
    return res.data;
  },
};

export const dailyQuestsApi = {
  getDailyQuests: async () => {
    const res = await api.get<{ success: boolean; count: number; quests: DailyQuest[] }>(
      '/daily-quests'
    );
    return res.data;
  },

  claimReward: async (id: string) => {
    const res = await api.post<{
      success: boolean;
      message: string;
      reward: { xpEarned: number; coinsEarned: number };
      progression: any;
      quest: DailyQuest;
    }>(`/daily-quests/${id}/claim`);
    return res.data;
  },
};
