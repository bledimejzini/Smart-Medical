import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const endpoint = searchParams.get('endpoint');

    switch (endpoint) {
      case 'users':
        const users = await prisma.user.findMany({
          where: {
            role: 'CAREGIVER'
          },
          include: {
            devices: {
              include: {
                patient: true
              }
            }
          }
        });

        const formattedUsers = users.map((user: any) => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          deviceSerialNumber: user.devices[0]?.serialNumber || null,
          deviceStatus: user.devices[0]?.isOnline ? 'ONLINE' : 'OFFLINE',
          lastActive: user.devices[0]?.lastHeartbeat ? 
            getRelativeTime(user.devices[0].lastHeartbeat) : 'Never',
          patient: user.devices[0]?.patient ? {
            name: user.devices[0].patient.name,
            age: user.devices[0].patient.age
          } : null
        }));

        return NextResponse.json({ users: formattedUsers });

      case 'devices':
        const devices = await prisma.device.findMany({
          include: {
            patient: true,
            user: true,
            readings: {
              orderBy: {
                timestamp: 'desc'
              },
              take: 1
            }
          }
        });

        const formattedDevices = devices.map((device: any) => ({
          id: device.id,
          serialNumber: device.serialNumber,
          name: device.name || 'Unknown Device',
          status: device.isOnline ? 'ACTIVE' : 'INACTIVE',
          lastHeartbeat: device.lastHeartbeat ? 
            getRelativeTime(device.lastHeartbeat) : 'Never',
          batteryLevel: Math.floor(Math.random() * 100), // Simulated
          signalStrength: Math.floor(Math.random() * 100), // Simulated
          location: device.location || 'Unknown',
          owner: device.patient?.name || device.user?.name || 'Unknown',
          uptime: device.isOnline ? Math.random() * 200 : 0 // Simulated hours
        }));

        return NextResponse.json({ devices: formattedDevices });

      case 'alerts':
        const alerts = await prisma.alert.findMany({
          include: {
            device: true
          },
          orderBy: {
            timestamp: 'desc'
          },
          take: 20
        });

        const formattedAlerts = alerts.map((alert: any) => ({
          id: alert.id,
          type: mapAlertType(alert.type),
          severity: alert.priority.toUpperCase(),
          message: alert.message || 'System alert',
          deviceId: alert.deviceId,
          timestamp: getRelativeTime(alert.timestamp),
          acknowledged: alert.acknowledged
        }));

        return NextResponse.json({ alerts: formattedAlerts });

      case 'analytics':
        // Get analytics data for the last 7 days
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - 7);

        const analyticsData = [];
        
        for (let i = 6; i >= 0; i--) {
          const date = new Date();
          date.setDate(date.getDate() - i);
          
          const dateString = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
          
          // Get user activity for this date
          const usersCount = await prisma.user.count({
            where: {
              role: 'CAREGIVER'
            }
          });

          // Get alerts for this date
          const alertsCount = await prisma.alert.count({
            where: {
              timestamp: {
                gte: new Date(date.setHours(0, 0, 0, 0)),
                lte: new Date(date.setHours(23, 59, 59, 999))
              }
            }
          });

          analyticsData.push({
            date: dateString,
            activeUsers: Math.max(1, usersCount + Math.floor(Math.random() * 10)),
            alerts: alertsCount,
            deviceUptime: 97 + Math.random() * 3,
            responseTime: 1.2 + Math.random() * 0.8
          });
        }

        return NextResponse.json({ analytics: analyticsData });

      case 'stats':
        const totalUsers = await prisma.user.count({
          where: { role: 'CAREGIVER' }
        });

        const totalDevices = await prisma.device.count();
        const activeDevices = await prisma.device.count({
          where: { isOnline: true }
        });

        const unacknowledgedAlerts = await prisma.alert.count({
          where: { acknowledged: false }
        });

        return NextResponse.json({
          stats: {
            totalUsers,
            activeDevices,
            totalAlerts: unacknowledgedAlerts,
            avgUptime: 98.5 + Math.random() * 1.5,
            avgResponseTime: 1.3 + Math.random() * 0.7
          }
        });

      default:
        return NextResponse.json({ error: 'Invalid endpoint' }, { status: 400 });
    }

  } catch (error) {
    console.error('Admin API Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function getRelativeTime(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 1) {
    return 'Just now';
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
}

function mapAlertType(type: string): string {
  switch (type.toUpperCase()) {
    case 'HELP':
      return 'DEVICE_OFFLINE';
    case 'WATER':
      return 'SENSOR_ERROR';
    case 'TEMPERATURE_HIGH':
      return 'SENSOR_ERROR';
    case 'MEDICATION':
      return 'CONNECTION_ISSUE';
    default:
      return 'DEVICE_OFFLINE';
  }
}