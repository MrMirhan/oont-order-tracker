import { v4 as uuidv4 } from 'uuid';
import bcrypt from 'bcryptjs';
import { User, CreateUserRequest, UserRole } from '../types/User';

export class UserService {
  private users: Map<string, User> = new Map();
  private readonly saltRounds = 12;

  constructor() {
    this.initializeSampleUsers();
  }

  private async initializeSampleUsers(): Promise<void> {
    const sampleUsers: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'passwordHash'>[] = [
      {
        username: 'alice.smith',
        email: 'alice.smith@example.com',
        firstName: 'Alice',
        lastName: 'Smith',
        role: 'user'
      },
      {
        username: 'bob.johnson',
        email: 'bob.johnson@example.com',
        firstName: 'Bob',
        lastName: 'Johnson',
        role: 'user'
      },
      {
        username: 'charlie.brown',
        email: 'charlie.brown@example.com',
        firstName: 'Charlie',
        lastName: 'Brown',
        role: 'user'
      },
      {
        username: 'admin',
        email: 'admin@oont.com',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin'
      },
      {
        username: 'testuser',
        email: 'user@oont.com',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }
    ];

    const adminPasswordHash = await bcrypt.hash('admin123', this.saltRounds);
    const userPasswordHash = await bcrypt.hash('user123', this.saltRounds);
    const defaultPasswordHash = await bcrypt.hash('password123', this.saltRounds);

    for (const userData of sampleUsers) {
      const now = new Date();
      let passwordHash = defaultPasswordHash;
      
      if (userData.email === 'admin@oont.com') {
        passwordHash = adminPasswordHash;
      } else if (userData.email === 'user@oont.com') {
        passwordHash = userPasswordHash;
      }

      const user: User = {
        id: uuidv4(),
        ...userData,
        passwordHash,
        createdAt: now,
        updatedAt: now
      };
      this.users.set(user.id, user);
    }
  }

  async createUser(userData: CreateUserRequest): Promise<User> {
    const username = userData.email.split('@')[0].toLowerCase().trim();
    
    const existingUser = this.getUserByEmail(userData.email) || this.getUserByUsername(username);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    if (userData.password.length < 6) {
      throw new Error('Password must be at least 6 characters long');
    }

    const passwordHash = await bcrypt.hash(userData.password, this.saltRounds);

    const now = new Date();
    const user: User = {
      id: uuidv4(),
      username,
      email: userData.email.toLowerCase().trim(),
      firstName: userData.firstName.trim(),
      lastName: userData.lastName.trim(),
      passwordHash,
      role: 'user',
      createdAt: now,
      updatedAt: now
    };

    this.users.set(user.id, user);
    return user;
  }

  async authenticateUser(email: string, password: string): Promise<User | null> {
    const user = this.getUserByEmail(email);
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  getUserById(id: string): User | null {
    return this.users.get(id) || null;
  }

  getUserByEmail(email: string): User | null {
    const normalizedEmail = email.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.email === normalizedEmail) {
        return user;
      }
    }
    return null;
  }

  getUserByUsername(username: string): User | null {
    const normalizedUsername = username.toLowerCase().trim();
    for (const user of this.users.values()) {
      if (user.username === normalizedUsername) {
        return user;
      }
    }
    return null;
  }

  getAllUsers(): User[] {
    return Array.from(this.users.values()).sort((a, b) =>
      b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async updateUser(id: string, updates: Partial<Omit<User, 'id' | 'createdAt' | 'passwordHash'>>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    if (updates.email && updates.email !== user.email) {
      const existingUser = this.getUserByEmail(updates.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already in use by another user');
      }
    }

    if (updates.username && updates.username !== user.username) {
      const existingUser = this.getUserByUsername(updates.username);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Username already in use by another user');
      }
    }

    const updatedUser: User = {
      ...user,
      ...updates,
      id: user.id,
      createdAt: user.createdAt,
      passwordHash: user.passwordHash,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async updatePassword(id: string, currentPassword: string, newPassword: string): Promise<boolean> {
    const user = this.users.get(id);
    if (!user) {
      return false;
    }

    const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isCurrentPasswordValid) {
      return false;
    }

    if (newPassword.length < 8) {
      throw new Error('New password must be at least 8 characters long');
    }

    const newPasswordHash = await bcrypt.hash(newPassword, this.saltRounds);

    const updatedUser: User = {
      ...user,
      passwordHash: newPasswordHash,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return true;
  }

  updateUserRole(id: string, role: UserRole): User | null {
    const user = this.users.get(id);
    if (!user) {
      return null;
    }

    const updatedUser: User = {
      ...user,
      role,
      updatedAt: new Date()
    };

    this.users.set(id, updatedUser);
    return updatedUser;
  }

  deleteUser(id: string): boolean {
    return this.users.delete(id);
  }

  getUsersCount(): number {
    return this.users.size;
  }

  sanitizeUser(user: User): Omit<User, 'passwordHash'> {
    const { passwordHash, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  searchUsers(query: string): User[] {
    const normalizedQuery = query.toLowerCase().trim();
    return Array.from(this.users.values()).filter(user =>
      user.username.includes(normalizedQuery) ||
      user.email.includes(normalizedQuery)
    );
  }
}

export const userService = new UserService();