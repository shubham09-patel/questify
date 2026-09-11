import React from 'react';
import { motion } from 'framer-motion';
import { CharacterGender, IEquippedItems } from '../types';

interface CharacterRendererProps {
  character?: CharacterGender;
  equipped?: IEquippedItems;
  size?: number;
  animate?: boolean;
  showPedestal?: boolean;
  className?: string;
}

export const CharacterRenderer: React.FC<CharacterRendererProps> = ({
  character = 'male',
  equipped = {},
  size = 128,
  animate = true,
  showPedestal = false,
  className = '',
}) => {
  const gender = character === 'female' ? 'female' : 'male';

  // Helper to map item ID to public asset path
  const getItemAsset = (category: string, itemId?: string) => {
    if (!itemId) return null;
    return `/assets/items/${category}/${itemId}.svg`;
  };

  const bodyAsset = `/assets/characters/${gender}/body.svg`;
  const faceAsset = `/assets/characters/${gender}/face.svg`;
  const hairAsset = getItemAsset('hair', equipped.hair);
  const clothesAsset = getItemAsset('clothes', equipped.clothes);
  const armorAsset = getItemAsset('armor', equipped.armor);
  const shoesAsset = getItemAsset('shoes', equipped.shoes);
  const weaponAsset = getItemAsset('weapons', equipped.weapon);
  const headAsset = getItemAsset('head', equipped.head);

  return (
    <div
      className={`relative flex flex-col items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Optional RPG Pedestal under character */}
      {showPedestal && (
        <div
          className="absolute bottom-1 w-[80%] h-4 rounded-[50%] bg-gradient-to-r from-amber-600/30 via-amber-400/50 to-amber-600/30 blur-[2px] border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
          style={{ zIndex: 0 }}
        />
      )}

      {/* Layered Sprite Container */}
      <motion.div
        animate={
          animate
            ? {
                y: [0, -3, 0],
                transition: {
                  duration: 2.4,
                  repeat: Infinity,
                  ease: 'easeInOut',
                },
              }
            : {}
        }
        className="relative w-full h-full"
        style={{
          imageRendering: 'pixelated',
        }}
      >
        {/* Layer 1: Body */}
        <img
          src={bodyAsset}
          alt="Base Body"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Layer 2: Face */}
        <img
          src={faceAsset}
          alt="Face"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          style={{ imageRendering: 'pixelated' }}
        />

        {/* Layer 3: Hair (if no full helmet covering hair) */}
        {hairAsset && (!equipped.head || equipped.head === 'bandana_red') && (
          <img
            src={hairAsset}
            alt="Hair"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        )}

        {/* Layer 4: Clothes */}
        {clothesAsset && (
          <img
            src={clothesAsset}
            alt="Clothes"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        )}

        {/* Layer 5: Armor (layered over clothes) */}
        {armorAsset && (
          <img
            src={armorAsset}
            alt="Armor"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        )}

        {/* Layer 6: Shoes */}
        {shoesAsset && (
          <img
            src={shoesAsset}
            alt="Shoes"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        )}

        {/* Layer 7: Weapon */}
        {weaponAsset && (
          <motion.img
            src={weaponAsset}
            alt="Weapon"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
            animate={
              animate
                ? {
                    rotate: [0, 2, 0, -1, 0],
                    transition: {
                      duration: 3,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    },
                  }
                : {}
            }
          />
        )}

        {/* Layer 8: Head Gear / Crown / Helmet */}
        {headAsset && (
          <img
            src={headAsset}
            alt="Head Gear"
            className="absolute inset-0 w-full h-full object-contain pointer-events-none"
            style={{ imageRendering: 'pixelated' }}
          />
        )}
      </motion.div>
    </div>
  );
};
