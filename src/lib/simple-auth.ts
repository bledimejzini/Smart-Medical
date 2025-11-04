// Simple in-memory user store
import bcrypt from 'bcryptjs';

export interface User {
  id: string;
  email: string;
  name: string;
  password: string;
  role: 'ADMIN' | 'CAREGIVER';
}

// Pre-hashed passwords (generated once)
// admin123 -> $2a$12$hash...
// password123 -> $2a$12$hash...

export const users: User[] = [
  {
    id: '1',
    email: 'admin@vitanet.com',
    name: 'System Administrator',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSv6wvJm', // admin123
    role: 'ADMIN'
  },
  {
    id: '2',
    email: 'demo@caregiver.com',
    name: 'Demo Caregiver',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSv6wvJm', // password123
    role: 'CAREGIVER'
  },
  {
    id: '3',
    email: 'user@vitanet.com',
    name: 'Test User',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYILSv6wvJm', // password123
    role: 'CAREGIVER'
  }
];

export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find(user => user.email.toLowerCase() === email.toLowerCase());
}

export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export async function createUser(email: string, name: string, password: string): Promise<User> {
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser: User = {
    id: String(users.length + 1),
    email,
    name,
    password: hashedPassword,
    role: 'CAREGIVER'
  };
  users.push(newUser);
  return newUser;
}
