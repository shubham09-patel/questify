import React, { createContext, useContext, useEffect, useState } from 'react';
import { CharacterGender, Player, User } from '../types';
import { authApi } from '../services/api';

interface AuthContextType {
  user: User | null;
  player: Player | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (data: {
    email: string;
    password: string;
    name?: string;
    character: CharacterGender;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setPlayer: React.Dispatch<React.SetStateAction<Player | null>>;
  refreshAuth: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const refreshAuth = async () => {
    try {
      const data = await authApi.getMe();
      if (data.success && data.user) {
        setUser(data.user);
        setPlayer(data.player);
      } else {
        setUser(null);
        setPlayer(null);
      }
    } catch (err) {
      setUser(null);
      setPlayer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshAuth();
  }, []);

  const login = async (credentials: { email: string; password: string }) => {
    const data = await authApi.login(credentials);
    setUser(data.user);
    setPlayer(data.player);
  };

  const register = async (data: {
    email: string;
    password: string;
    name?: string;
    character: CharacterGender;
  }) => {
    const res = await authApi.register(data);
    setUser(res.user);
    setPlayer(res.player);
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
      setPlayer(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        player,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        setPlayer,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
};
