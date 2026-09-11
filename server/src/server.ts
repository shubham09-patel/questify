import { createApp } from './app';
import { connectDB } from './config/db';
import { config } from './config/env';

const startServer = async () => {
  const app = createApp();

  // Attempt database connection
  await connectDB();

  app.listen(config.port, () => {
    console.log(`\n======================================================`);
    console.log(`⚔️  QUESTIFY RPG SERVER ACTIVE ON PORT ${config.port}`);
    console.log(`🌐 API Base: http://localhost:${config.port}/api`);
    console.log(`🛡️  Client Origin: ${config.clientUrl}`);
    console.log(`======================================================\n`);
  });
};

startServer().catch((err) => {
  console.error('Fatal Server Startup Error:', err);
  process.exit(1);
});
