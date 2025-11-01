import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    role: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    role: string;
  }
}

export interface Patient {
  id: string;
  name: string;
  age?: number;
  relationship: string;
  conditions?: string;
  emergency_contact?: string;
  emergency_phone?: string;
  deviceId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Device {
  id: string;
  serialNumber: string;
  name?: string;
  userId: string;
  isOnline: boolean;
  lastHeartbeat?: Date;
  location?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SensorReading {
  id: string;
  deviceId: string;
  temperature: number;
  humidity: number;
  motion: boolean;
  fanActive: boolean;
  timestamp: Date;
}

export interface Alert {
  id: string;
  deviceId: string;
  type: AlertType;
  message?: string;
  priority: Priority;
  acknowledged: boolean;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  timestamp: Date;
}

export interface Reminder {
  id: string;
  deviceId: string;
  medication: string;
  dosage: string;
  time: string;
  isActive: boolean;
  lastTriggered?: Date;
  acknowledged: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CameraClip {
  id: string;
  deviceId: string;
  filename: string;
  duration: number;
  fileSize: number;
  triggerType: string;
  thumbnail?: string;
  createdAt: Date;
}

export enum AlertType {
  HELP = 'HELP',
  WATER = 'WATER',
  OTHER = 'OTHER',
  TEMPERATURE_HIGH = 'TEMPERATURE_HIGH',
  TEMPERATURE_LOW = 'TEMPERATURE_LOW',
  MOTION_DETECTED = 'MOTION_DETECTED',
  MOTION_TIMEOUT = 'MOTION_TIMEOUT',
  MEDICATION_REMINDER = 'MEDICATION_REMINDER',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  EMERGENCY = 'EMERGENCY',
}

export enum Priority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum Role {
  CAREGIVER = 'CAREGIVER',
  ADMIN = 'ADMIN',
}

export interface DashboardStats {
  totalUsers: number;
  activeDevices: number;
  totalAlerts: number;
  averageTemp: number;
  averageHumidity: number;
  medicationAdherence: number;
}

export interface UserFeedback {
  id: string;
  userId: string;
  type: string;
  rating?: number;
  subject: string;
  message: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}