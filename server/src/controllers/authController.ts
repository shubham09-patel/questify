import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { Player } from '../models/Player';
import { config } from '../config/env';
import { AuthRequest } from '../middleware/authMiddleware';

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: config.isProduction,
  sameSite: (config.isProduction ? 'none' : 'lax') as 'none' | 'lax',
  maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
};

export class AuthController {
  public static async register(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password, name, character } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required.' });
        return;
      }

      if (password.length < 6) {
        res.status(400).json({
          success: false,
          error: 'Password must be at least 6 characters long.',
        });
        return;
      }

      const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
      if (existingUser) {
        res.status(409).json({ success: false, error: 'An account with this email already exists.' });
        return;
      }

      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      const user = await User.create({
        email: email.toLowerCase().trim(),
        passwordHash,
        name: name?.trim() || 'Hero of Questify',
      });

      // Initialize player with starter items and selected character
      const chosenCharacter = character === 'female' ? 'female' : 'male';
      const player = await Player.create({
        userId: user._id,
        character: chosenCharacter,
        level: 1,
        xp: 0,
        coins: 150, // Starter coins
        streak: 1,
        lastActiveDate: new Date().toISOString().split('T')[0],
        inventory: [
          'hair_short',
          'hair_long',
          'tunic_novice',
          'boots_traveler',
          'wooden_sword',
        ],
        equipped: {
          hair: chosenCharacter === 'female' ? 'hair_long' : 'hair_short',
          head: '',
          clothes: 'tunic_novice',
          armor: '',
          pants: '',
          shoes: 'boots_traveler',
          weapon: 'wooden_sword',
          accessory: '',
        },
      });

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        config.jwtSecret,
        { expiresIn: '30d' }
      );

      res.cookie('questify_token', token, COOKIE_OPTIONS);

      res.status(201).json({
        success: true,
        message: 'Account registered successfully!',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        player,
      });
    } catch (error) {
      next(error);
    }
  }

  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        res.status(400).json({ success: false, error: 'Email and password are required.' });
        return;
      }

      const user = await User.findOne({ email: email.toLowerCase().trim() });
      if (!user) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      const isMatch = await bcrypt.compare(password, user.passwordHash);
      if (!isMatch) {
        res.status(401).json({ success: false, error: 'Invalid email or password.' });
        return;
      }

      let player = await Player.findOne({ userId: user._id });
      if (!player) {
        // Create player profile if missing
        player = await Player.create({
          userId: user._id,
          character: 'male',
          level: 1,
          xp: 0,
          coins: 100,
          inventory: ['hair_short', 'tunic_novice', 'wooden_sword', 'boots_traveler'],
          equipped: {
            hair: 'hair_short',
            clothes: 'tunic_novice',
            weapon: 'wooden_sword',
            shoes: 'boots_traveler',
          },
        });
      }

      const token = jwt.sign(
        { userId: user._id.toString(), email: user.email },
        config.jwtSecret,
        { expiresIn: '30d' }
      );

      res.cookie('questify_token', token, COOKIE_OPTIONS);

      res.json({
        success: true,
        message: 'Welcome back, adventurer!',
        token,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        player,
      });
    } catch (error) {
      next(error);
    }
  }

  public static logout(req: Request, res: Response): void {
    res.clearCookie('questify_token');
    res.json({ success: true, message: 'Logged out successfully.' });
  }

  public static async me(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: 'Not authenticated.' });
        return;
      }

      const user = await User.findById(req.user.userId).select('-passwordHash');
      if (!user) {
        res.status(404).json({ success: false, error: 'User not found.' });
        return;
      }

      const player = await Player.findOne({ userId: user._id });

      res.json({
        success: true,
        user: {
          id: user._id,
          email: user.email,
          name: user.name,
        },
        player,
      });
    } catch (error) {
      next(error);
    }
  }
}
