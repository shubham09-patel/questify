import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    email: string;
  };
}

export const requireAuth = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  let token: string | undefined;

  // Check HTTP-only cookie first
  if (req.cookies && req.cookies.questify_token) {
    token = req.cookies.questify_token;
  }
  // Fallback to Bearer token in header
  else if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer ')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Authentication required. Please log in.',
    });
    return;
  }

  try {
    const decoded = jwt.verify(token, config.jwtSecret) as {
      userId: string;
      email: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: 'Invalid or expired session. Please log in again.',
    });
  }
};
