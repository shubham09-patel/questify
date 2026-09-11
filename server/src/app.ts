import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { config } from './config/env';
import { errorHandler } from './middleware/errorHandler';

// Route imports
import authRoutes from './routes/authRoutes';
import playerRoutes from './routes/playerRoutes';
import missionRoutes from './routes/missionRoutes';
import itemRoutes from './routes/itemRoutes';
import shopRoutes from './routes/shopRoutes';
import equipmentRoutes from './routes/equipmentRoutes';
import achievementRoutes from './routes/achievementRoutes';
import dailyQuestRoutes from './routes/dailyQuestRoutes';

export const createApp = (): Application => {
  const app = express();

  // CORS configuration
  app.use(
    cors({
      origin: [config.clientUrl, 'http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
    })
  );

  // Parsers
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  // Health check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'healthy',
      app: 'Questify API',
      timestamp: new Date().toISOString(),
      environment: config.nodeEnv,
    });
  });

  // API Route Mounts
  app.use('/api/auth', authRoutes);
  app.use('/api/player', playerRoutes);
  app.use('/api/missions', missionRoutes);
  app.use('/api/items', itemRoutes);
  app.use('/api/shop', shopRoutes);
  app.use('/api/equipment', equipmentRoutes);
  app.use('/api/achievements', achievementRoutes);
  app.use('/api/daily-quests', dailyQuestRoutes);

  // 404 handler for unknown routes
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      error: `Cannot ${req.method} ${req.originalUrl} - Route not found`,
    });
  });

  // Central Error Handler
  app.use(errorHandler);

  return app;
};
