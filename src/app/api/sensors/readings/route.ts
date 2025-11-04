import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {
  try {
    const { deviceId, temperature, humidity, motion, fanActive } = await req.json();

    if (!deviceId || temperature === undefined || humidity === undefined) {
      return NextResponse.json(
        { error: 'Device ID, temperature, and humidity are required' },
        { status: 400 }
      );
    }

    // Update device last heartbeat
    await prisma.device.update({
      where: { id: deviceId },
      data: {
        isOnline: true,
        lastHeartbeat: new Date(),
      },
    });

    // Create sensor reading
    const reading = await prisma.sensorReading.create({
      data: {
        deviceId,
        temperature,
        humidity,
        motion: motion || false,
        fanActive: fanActive || false,
      },
    });

    // Check for temperature alerts
    if (temperature > 30 || temperature < 15) {
      await prisma.alert.create({
        data: {
          deviceId,
          type: temperature > 30 ? 'TEMPERATURE_HIGH' : 'TEMPERATURE_LOW',
          message: `Temperature is ${temperature}°C`,
          priority: temperature > 35 || temperature < 10 ? 'CRITICAL' : 'HIGH',
          acknowledged: false,
        },
      });
    }

    return NextResponse.json({ reading });
  } catch (error) {
    console.error('Error storing sensor reading:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const deviceId = url.searchParams.get('deviceId');
    const limit = parseInt(url.searchParams.get('limit') || '50');

    if (!deviceId) {
      return NextResponse.json(
        { error: 'Device ID is required' },
        { status: 400 }
      );
    }

    const readings = await prisma.sensorReading.findMany({
      where: { deviceId },
      orderBy: { timestamp: 'desc' },
      take: limit,
    });

    return NextResponse.json({ readings });
  } catch (error) {
    console.error('Error fetching sensor readings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}