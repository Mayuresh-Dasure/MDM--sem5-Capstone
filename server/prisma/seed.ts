import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding SunTrack database...');

  // 1. Clean existing records
  await prisma.cleaningRecord.deleteMany();
  await prisma.weatherSnapshot.deleteMany();
  await prisma.recommendation.deleteMany();
  await prisma.solarInstallation.deleteMany();
  await prisma.notificationPreference.deleteMany();
  await prisma.user.deleteMany();

  // 2. Create Demo User
  const passwordHash = await bcrypt.hash('password123', 12);
  const user = await prisma.user.create({
    data: {
      name: 'Rajesh Kumar Sharma',
      email: 'demo@suntrack.app',
      phone: '9876543210',
      state: 'Maharashtra',
      passwordHash,
      notificationPreference: {
        create: {
          cleaningAlerts: true,
          rainAlerts: true,
          weeklySummary: true,
          emailEnabled: true,
        },
      },
    },
  });

  console.log(`👤 Created Demo User: ${user.email} (Password: password123)`);

  // 3. Create Sample Solar Installation - Nagpur
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);

  const installation = await prisma.solarInstallation.create({
    data: {
      userId: user.id,
      name: 'Rooftop Solar Array - East Block',
      locationName: 'Nagpur, Maharashtra',
      latitude: 21.1458,
      longitude: 79.0882,
      capacityKw: 7.5,
      panelCount: 20,
      panelType: 'MONOCRYSTALLINE',
      tiltDegrees: 21.0,
      lastCleaningDate: fourteenDaysAgo,
    },
  });

  console.log(`⚡ Created Installation: ${installation.name} (${installation.capacityKw} kW) — Nagpur`);

  // 4. Historical Cleaning Records
  const fortyFiveDaysAgo = new Date();
  fortyFiveDaysAgo.setDate(fortyFiveDaysAgo.getDate() - 45);

  await prisma.cleaningRecord.create({
    data: {
      installationId: installation.id,
      cleanedAt: fortyFiveDaysAgo,
      efficiencyBefore: 83.2,
      efficiencyAfter: 99.5,
      cost: 350.0,
      notes: 'Quarterly pressure wash and squeegee cleaning. Removed summer dust buildup.',
    },
  });

  await prisma.cleaningRecord.create({
    data: {
      installationId: installation.id,
      cleanedAt: fourteenDaysAgo,
      efficiencyBefore: 86.0,
      efficiencyAfter: 100.0,
      cost: 200.0,
      notes: 'Routine water spray cleaning. Cleared post-monsoon dust.',
    },
  });

  console.log('✅ Seeding complete! SunTrack is ready.');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
