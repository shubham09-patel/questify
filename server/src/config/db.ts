import mongoose from 'mongoose';
import { config } from './env';

export const connectDB = async (): Promise<boolean> => {
  const uri = config.mongoUri;

  if (!uri || uri === 'YOUR_MONGODB_CONNECTION_STRING') {
    console.warn('\n=============================================================');
    console.warn('⚠️  [MongoDB] MONGODB_URI is not set or still has placeholder.');
    console.warn('   Please create a .env file with your valid MongoDB connection string:');
    console.warn('   MONGODB_URI=YOUR_MONGODB_CONNECTION_STRING');
    console.warn('   Once provided, Questify will automatically connect & initialize collections.');
    console.warn('=============================================================\n');
    return false;
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`✨ [MongoDB] Connected successfully: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.error(`❌ [MongoDB] Connection error: ${error.message}`);
    return false;
  }
};
