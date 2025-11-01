import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Hash passwords
  const hashedCaregiverPassword = await bcrypt.hash('password123', 12);
  const hashedAdminPassword = await bcrypt.hash('admin123', 12);

  // Create demo caregiver user
  const caregiverUser = await prisma.user.upsert({
    where: { email: 'demo@caregiver.com' },
    update: {},
    create: {
      email: 'demo@caregiver.com',
      name: 'Demo Caregiver',
      password: hashedCaregiverPassword,
      role: 'CAREGIVER',
    },
  });

  // Create demo admin user
  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@medsmart.com' },
    update: {},
    create: {
      email: 'admin@medsmart.com',
      name: 'System Administrator',
      password: hashedAdminPassword,
      role: 'ADMIN',
    },
  });

  // Create a demo device first
  const demoDevice = await prisma.device.upsert({
    where: { serialNumber: 'EDC_DEMO_001' },
    update: {},
    create: {
      serialNumber: 'EDC_DEMO_001',
      name: 'Demo Living Room Monitor',
      location: 'Living Room',
      userId: caregiverUser.id,
      isOnline: true,
      lastHeartbeat: new Date(),
    },
  });

  // Create a demo patient
  const demoPatient = await prisma.patient.upsert({
    where: { deviceId: demoDevice.id },
    update: {},
    create: {
      name: 'Margaret Johnson',
      age: 78,
      relationship: 'Grandmother',
      conditions: 'Hypertension, Diabetes Type 2',
      emergency_contact: 'Dr. Sarah Smith',
      emergency_phone: '+1-555-123-4567',
      deviceId: demoDevice.id,
    },
  });

  // Create some sample sensor readings
  const sampleReadings = [];
  for (let i = 0; i < 24; i++) {
    const timestamp = new Date();
    timestamp.setHours(timestamp.getHours() - i); // Last 24 hours

    sampleReadings.push({
      deviceId: demoDevice.id,
      temperature: 20 + Math.random() * 8, // 20-28°C
      humidity: 40 + Math.random() * 20, // 40-60%
      motion: Math.random() > 0.5,
      fanActive: Math.random() > 0.8,
      timestamp,
    });
  }

  await prisma.sensorReading.createMany({
    data: sampleReadings,
  });

  // Create some sample alerts
  await prisma.alert.createMany({
    data: [
      {
        deviceId: demoDevice.id,
        type: 'HELP',
        message: 'Emergency help button pressed',
        priority: 'HIGH',
        acknowledged: false,
        timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
      },
      {
        deviceId: demoDevice.id,
        type: 'WATER',
        message: 'Water assistance requested',
        priority: 'MEDIUM',
        acknowledged: true,
        acknowledgedAt: new Date(Date.now() - 1000 * 60 * 60), // 1 hour ago
        timestamp: new Date(Date.now() - 1000 * 60 * 65), // 65 minutes ago
      },
      {
        deviceId: demoDevice.id,
        type: 'TEMPERATURE_HIGH',
        message: 'Temperature exceeds comfortable range: 31.2°C',
        priority: 'MEDIUM',
        acknowledged: true,
        acknowledgedAt: new Date(Date.now() - 1000 * 60 * 120),
        timestamp: new Date(Date.now() - 1000 * 60 * 125),
      },
    ],
  });

  // Create some medication reminders
  await prisma.reminder.createMany({
    data: [
      {
        deviceId: demoDevice.id,
        medication: 'Blood Pressure Medication',
        dosage: '1 tablet (Lisinopril 10mg)',
        time: '09:00',
        isActive: true,
        notes: 'Take with breakfast',
      },
      {
        deviceId: demoDevice.id,
        medication: 'Vitamin D Supplement',
        dosage: '2 tablets',
        time: '14:00',
        isActive: true,
        notes: 'Take with lunch',
      },
      {
        deviceId: demoDevice.id,
        medication: 'Diabetes Medication',
        dosage: '1 tablet (Metformin 500mg)',
        time: '08:00',
        isActive: true,
        notes: 'Take before meals',
      },
    ],
  });

  console.log('✅ Database seeded successfully!');
  console.log(`👤 Demo Caregiver: demo@caregiver.com / password123`);
  console.log(`🔧 Demo Admin: admin@medsmart.com / admin123`);
  console.log(`📱 Demo Device: ${demoDevice.serialNumber}`);
  console.log(`👵 Demo Patient: ${demoPatient.name}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });