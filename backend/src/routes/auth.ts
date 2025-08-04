import { Router, Request, Response } from 'express';
import { userService } from '../services/UserService';
import { generateToken, authenticateToken, AuthenticatedRequest } from '../middleware/auth';
import { CreateUserRequest, LoginRequest } from '../types/User';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName }: CreateUserRequest = req.body;

    if (!username || !email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields',
        message: 'Username, email, password, first name, and last name are required'
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
        message: 'Please provide a valid email address'
      });
    }

    const usernameRegex = /^[a-zA-Z0-9._-]+$/;
    if (!usernameRegex.test(username) || username.length < 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid username',
        message: 'Username must be at least 3 characters and contain only letters, numbers, dots, underscores, and hyphens'
      });
    }

    const user = await userService.createUser({ username, email, password, firstName, lastName });
    const token = generateToken(user);
    const sanitizedUser = userService.sanitizeUser(user);

    res.status(201).json({
      success: true,
      data: {
        user: sanitizedUser,
        token,
        expiresIn: '24h'
      },
      message: 'User registered successfully'
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Registration failed';
    res.status(400).json({
      success: false,
      error: 'Registration failed',
      message
    });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password }: LoginRequest = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    const user = await userService.authenticateUser(email, password);
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
        message: 'Email or password is incorrect'
      });
    }

    const token = generateToken(user);
    const sanitizedUser = userService.sanitizeUser(user);

    res.status(200).json({
      success: true,
      data: {
        user: sanitizedUser,
        token,
        expiresIn: '24h'
      },
      message: 'Login successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Authentication failed',
      message: 'An error occurred during authentication'
    });
  }
});

router.get('/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required',
        message: 'User not found in request'
      });
    }

    const sanitizedUser = userService.sanitizeUser(req.user);
    
    res.status(200).json({
      success: true,
      data: sanitizedUser,
      message: 'User profile retrieved successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Profile retrieval failed',
      message: 'An error occurred while retrieving user profile'
    });
  }
});

router.post('/logout', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Logout successful. Please remove the token from client storage.'
  });
});

export default router;