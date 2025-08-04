import { Request, Response, NextFunction } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { User, JWTPayload, UserRole } from '../types/User';
import { userService } from '../services/UserService';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-jwt-key';
const JWT_EXPIRES_IN: string = process.env.JWT_EXPIRES_IN || '24h';

export interface AuthenticatedRequest extends Request {
  user?: User;
}

export const authenticateToken = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Access token required',
        message: 'Please provide a valid authentication token'
      });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
    
    const user = await userService.getUserById(decoded.userId);
    if (!user) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'User associated with token not found'
      });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({
        success: false,
        error: 'Invalid token',
        message: 'The provided token is invalid or expired'
      });
      return;
    }

    res.status(500).json({
      success: false,
      error: 'Authentication error',
      message: 'Failed to authenticate token'
    });
  }
};

export const requireRole = (allowedRoles: UserRole[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'User must be authenticated to access this resource'
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        error: 'Insufficient permissions',
        message: `Access denied. Required role: ${allowedRoles.join(' or ')}`
      });
      return;
    }

    next();
  };
};

export const requireOwnership = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  if (!req.user) {
    res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'User must be authenticated to access this resource'
    });
    return;
  }

  if (req.user.role === 'admin') {
    next();
    return;
  }

  const requestedUserId = req.query.userId || req.body.userId;
  if (requestedUserId && requestedUserId !== req.user.username) {
    res.status(403).json({
      success: false,
      error: 'Access denied',
      message: 'You can only access your own data'
    });
    return;
  }

  next();
};

export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    userId: user.id,
    email: user.email,
    role: user.role
  };

  const options: SignOptions = {
    expiresIn: JWT_EXPIRES_IN as any
  };

  return jwt.sign(payload, JWT_SECRET, options);
};

export const extractToken = (req: Request): string | null => {
  const authHeader = req.headers.authorization;
  return authHeader && authHeader.split(' ')[1] || null;
};