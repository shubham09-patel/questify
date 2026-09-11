import React from 'react';
import { ItemRarity } from '../types';

interface RarityBadgeProps {
  rarity: ItemRarity;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const RARITY_CONFIG: Record<
  ItemRarity,
  { label: string; bg: string; text: string; border: string; glow: string }
> = {
  common: {
    label: 'Common',
    bg: 'bg-slate-800/80',
    text: 'text-slate-300',
    border: 'border-slate-600/60',
    glow: '',
  },
  uncommon: {
    label: 'Uncommon',
    bg: 'bg-emerald-950/70',
    text: 'text-emerald-400',
    border: 'border-emerald-600/70',
    glow: 'shadow-[0_0_8px_rgba(16,185,129,0.3)]',
  },
  rare: {
    label: 'Rare',
    bg: 'bg-blue-950/70',
    text: 'text-blue-400',
    border: 'border-blue-600/70',
    glow: 'shadow-[0_0_10px_rgba(59,130,246,0.35)]',
  },
  epic: {
    label: 'Epic',
    bg: 'bg-purple-950/70',
    text: 'text-purple-400',
    border: 'border-purple-500/80',
    glow: 'shadow-[0_0_12px_rgba(168,85,247,0.45)]',
  },
  legendary: {
    label: 'Legendary',
    bg: 'bg-amber-950/70',
    text: 'text-amber-400',
    border: 'border-amber-500/90',
    glow: 'shadow-[0_0_15px_rgba(245,158,11,0.5)]',
  },
  mythic: {
    label: 'Mythic',
    bg: 'bg-rose-950/80',
    text: 'text-rose-400',
    border: 'border-rose-500',
    glow: 'shadow-[0_0_18px_rgba(244,63,94,0.6)]',
  },
};

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = 'sm',
  className = '',
}) => {
  const conf = RARITY_CONFIG[rarity] || RARITY_CONFIG.common;

  const sizeClasses = {
    sm: 'text-[10px] px-2 py-0.5 font-semibold',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  return (
    <span
      className={`inline-flex items-center uppercase tracking-wider rounded border ${conf.bg} ${conf.text} ${conf.border} ${conf.glow} ${sizeClasses[size]} ${className}`}
    >
      {conf.label}
    </span>
  );
};
