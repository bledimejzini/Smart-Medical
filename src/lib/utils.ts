import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  }).format(date);
}

export function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
}

export function generateDeviceId(): string {
  return `EDC_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

export function getTemperatureStatus(temp: number): {
  status: 'normal' | 'warning' | 'critical';
  color: string;
  message: string;
} {
  if (temp < 15) {
    return {
      status: 'critical',
      color: 'text-blue-600',
      message: 'Too Cold',
    };
  } else if (temp > 30) {
    return {
      status: 'critical',
      color: 'text-red-600',
      message: 'Too Hot',
    };
  } else if (temp < 18 || temp > 26) {
    return {
      status: 'warning',
      color: 'text-orange-600',
      message: 'Suboptimal',
    };
  } else {
    return {
      status: 'normal',
      color: 'text-green-600',
      message: 'Comfortable',
    };
  }
}

export function getHumidityStatus(humidity: number): {
  status: 'normal' | 'warning' | 'critical';
  color: string;
  message: string;
} {
  if (humidity < 30) {
    return {
      status: 'warning',
      color: 'text-orange-600',
      message: 'Dry',
    };
  } else if (humidity > 70) {
    return {
      status: 'warning',
      color: 'text-blue-600',
      message: 'Humid',
    };
  } else {
    return {
      status: 'normal',
      color: 'text-green-600',
      message: 'Optimal',
    };
  }
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters long');
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}