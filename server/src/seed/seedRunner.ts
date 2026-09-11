import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Item } from '../models/Item';
import { Achievement } from '../models/Achievement';
import { SEED_ITEMS, SEED_ACHIEVEMENTS } from './seedData';

async function runSeed() {
  console.log('🌱 Starting Questify database seed...');

  const connected = await connectDB();
  if (!connected) {
    console.error('❌ Could not connect to MongoDB. Please configure MONGODB_URI first.');
    process.exit(1);
  }

  try {
    // 1. Seed Items (upsert by itemId)
    console.log(`🗡️  Seeding ${SEED_ITEMS.length} RPG items...`);
    for (const itemData of SEED_ITEMS) {
      await Item.findOneAndUpdate(
        { itemId: itemData.itemId },
        { $set: itemData },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Items seeded successfully!');

    // 2. Seed Achievements (upsert by achievementId)
    console.log(`🏆 Seeding ${SEED_ACHIEVEMENTS.length} achievements...`);
    for (const achData of SEED_ACHIEVEMENTS) {
      await Achievement.findOneAndUpdate(
        { achievementId: achData.achievementId },
        { $set: achData },
        { upsert: true, new: true }
      );
    }
    console.log('✅ Achievements seeded successfully!');

    console.log('\n🎉 Database seeding finished! All collections and starter data are ready.');
  } catch (error: any) {
    console.error('❌ Error during seeding:', error.message);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

runSeed();
