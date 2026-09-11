# ⚔️ Questify — Gamified RPG Task Manager

> **Turn everyday tasks into epic RPG quests, earn XP and Gold, level up your hero, unlock layered pixel-art gear, and forge an unbreakable streak.**

---

## 🌟 Overview

**Questify** replaces lifeless, boring Todo checklists with an immersive retro RPG experience. Instead of simply checking off *"Complete DSA problem"*, you **⚔️ DEFEAT THE ALGORITHM**.

Completing real-life missions grants you:
- **XP**: Advances your hero level along an RPG progression curve.
- **Gold Coins**: Currency to spend at **The Adventurer's Armory (Shop)**.
- **Layered Pixel-Art Customization**: Assembles Male or Female heroes dynamically from layers (Body, Face, Hair, Clothes, Armor, Weapon, Shoes, Helmets).
- **Streaks**: Daily activity counter protected by real date calculations.
- **Daily Quests & Achievements**: Bonus bounties and milestones with exclusive loot.

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with **TypeScript**
- **Vite** for ultra-fast bundling and HMR
- **Tailwind CSS** with dark fantasy RPG theme extensions
- **Framer Motion** for smooth level-up animations, mission complete celebrations, and character animations
- **Lucide React** for crisp RPG icons
- **Canvas Confetti** for glorious level-up fireworks
- **Custom Web Audio Synthesizer**: Procedural 8-bit retro sound effects (fanfare, coin pings, equip clanks) with zero external audio assets

### Backend
- **Node.js** & **Express.js** with **TypeScript**
- **Mongoose** (MongoDB ODM)
- **JWT** (JSON Web Tokens) with **HTTP-Only Cookies**
- **bcryptjs** for secure password hashing
- Modular Service Architecture: `ProgressionService`, `StreakService`, `DailyQuestService`, `AchievementService`, `RewardService`

### Database
- **MongoDB** (Automatic collection initialization upon connecting)

---

## 🚀 Quick Start Guide

Follow these steps to set up and run Questify on your machine:

### Step 1: Install Dependencies
Run the install command from the root directory:
```bash
# Installs root, server, and client dependencies
npm run install:all
```
*(Or navigate into `server/` and `client/` separately and run `npm install`)*

---

### Step 2: Configure Your MongoDB Connection String
1. Create a MongoDB database (e.g. on [MongoDB Atlas](https://www.mongodb.com/atlas) or via local MongoDB).
2. Copy `.env.example` in the `server/` folder to `.env`:
   ```bash
   cp server/.env.example server/.env
   ```
3. Open `server/.env` and paste your connection string after `MONGODB_URI=`:
   ```env
   PORT=5001
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/questify?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_here
   CLIENT_URL=http://localhost:5173
   NODE_ENV=development
   ```

> **Note**: `.env` is ignored by Git and will never be committed.

---

### Step 3: Seed Starter Items & Achievements
Once your `MONGODB_URI` is configured, run the automated seed script to populate starter items, weapons, armor, hairstyles, and achievements:
```bash
npm run seed
```
This will automatically seed:
- 16+ RPG items (Swords, Staves, Daggers, Iron Plates, Dragonscale Mail, Robes, Crowns, Boots) across 6 rarities (Common to Mythic).
- 11 Core Achievements (First Blood, Battle-Hardened, Unstoppable Momentum, God of Productivity, etc.).

---

### Step 4: Run the Application
Launch both backend and frontend concurrently:
```bash
npm run dev
```

- **Frontend Client**: [http://localhost:5173](http://localhost:5173)
- **Backend API**: [http://localhost:5001/api](http://localhost:5001/api)

---

## 🧙 Character & Layered Pixel-Art Architecture

Characters are assembled dynamically from independent vector layers rendered on top of each other. This eliminates the need for monolithic spritesheets and allows infinite outfit combinations.

Assets are organized under `client/public/assets/`:
```
client/public/assets/
├── characters/
│   ├── male/
│   │   ├── body.svg
│   │   └── face.svg
│   └── female/
│       ├── body.svg
│       └── face.svg
└── items/
    ├── hair/        # hair_short.svg, hair_spiky.svg, hair_long.svg, hair_braids.svg
    ├── clothes/     # tunic_novice.svg, robe_apprentice.svg, jerkin_rogue.svg
    ├── armor/       # iron_plate.svg, dragon_armor.svg, golden_plate.svg
    ├── weapons/     # wooden_sword.svg, iron_sword.svg, shadow_blade.svg, mage_staff.svg, excalibur.svg
    ├── head/        # bandana_red.svg, knight_helm.svg, golden_crown.svg
    └── shoes/       # boots_traveler.svg, greaves_steel.svg, boots_winged.svg
```

### Customizing or Replacing Art
Each item in the database references its asset file via the `asset` field (e.g. `/assets/items/weapons/iron_sword.svg`).
To replace any placeholder with your own pixel art, simply drop in your PNG, SVG, or GIF files into the respective folder using the same dimensions (64x64 grid).

---

## 📡 REST API Reference

### Authentication
- `POST /api/auth/register` — Register a new hero (with gender selection)
- `POST /api/auth/login` — Sign in and receive secure HTTP-only cookie
- `POST /api/auth/logout` — Clear session cookie
- `GET /api/auth/me` — Retrieve current authenticated session

### Player Progression
- `GET /api/player` — Get player level, XP, coins, streak, and next level requirement
- `PATCH /api/player/character` — Switch hero model between `male` and `female`
- `GET /api/player/inventory` — Get all owned items with full metadata
- `PATCH /api/player/profile` — Update player display name

### Missions (Todos)
- `GET /api/missions` — Filter by category, difficulty, or completion status
- `POST /api/missions` — Create a new mission (rewards calculated server-side)
- `GET /api/missions/:id` — Get mission details
- `PATCH /api/missions/:id` — Edit mission
- `DELETE /api/missions/:id` — Delete mission
- `POST /api/missions/:id/complete` — Conquers mission, awards XP & coins, triggers streak update, level-up calculation, daily quest check, and achievement unlocks
- `POST /api/missions/:id/uncomplete` — Reopen mission

### Armory (Shop) & Inventory
- `GET /api/items` — Catalog of all items in the game
- `POST /api/shop/:itemId/buy` — Purchase item with coins (server validates coins, level requirements, duplicate ownership)
- `POST /api/equipment/equip` — Equip item to character slot
- `POST /api/equipment/unequip` — Unequip item from slot

### Achievements & Daily Quests
- `GET /api/achievements` — List all achievements with current player progress
- `GET /api/daily-quests` — Retrieve today's 3 daily quests
- `POST /api/daily-quests/:id/claim` — Claim rewards for a completed daily quest

---

## 🔒 Security Principles
- **No Client-Trusted Rewards**: The client never calculates XP, coins, or shop prices; all game mathematics are evaluated authoritatively on the server.
- **HTTP-Only Cookies**: Authentication JWT tokens are stored in secure cookies preventing XSS token theft.
- **Zero Hardcoded Secrets**: All configuration runs through environment variables with zero database credentials in client bundles.
