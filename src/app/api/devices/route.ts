import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// Force dynamic rendering for this API route
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const devices = await prisma.device.findMany({
      where: {
        userId: session.user.id,
      },
      include: {
        patient: true,
        readings: {
          orderBy: { timestamp: 'desc' },
          take: 1,
        },
        alerts: {
          where: { acknowledged: false },
          orderBy: { timestamp: 'desc' },
        },
      },
    });

    return NextResponse.json({ devices });
  } catch (error) {
    console.error('Error fetching devices:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { serialNumber, name, location } = await req.json();

    if (!serialNumber) {
      return NextResponse.json(
        { error: 'Serial number is required' },
        { status: 400 }
      );
    }

    // Check if device already exists
    const existingDevice = await prisma.device.findUnique({
      where: { serialNumber },
    });

    if (existingDevice) {
      return NextResponse.json(
        { error: 'Device already registered' },
        { status: 400 }
      );
    }

    const device = await prisma.device.create({
      data: {
        serialNumber,
        name: name || `Device ${serialNumber}`,
        location,
        userId: session.user.id,
        isOnline: false,
      },
    });

    return NextResponse.json({ device });
  } catch (error) {
    console.error('Error creating device:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}