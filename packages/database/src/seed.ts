import { db } from './index';
import { adminUsers, clients, castles, templates } from './schema';
import bcrypt from 'bcryptjs';
import { AUTH_CONSTANTS } from '@prosite/shared';

async function seed() {
  console.log('Seeding database...');

  try {
    // Create admin user
    const adminPasswordHash = await bcrypt.hash('admin123456', AUTH_CONSTANTS.BCRYPT_ROUNDS);
    await db.insert(adminUsers).values({
      email: 'admin@prosite.com',
      passwordHash: adminPasswordHash,
      role: 'super_admin',
    });

    // Create test client
    const clientPasswordHash = await bcrypt.hash('test123456', AUTH_CONSTANTS.BCRYPT_ROUNDS);
    const [client] = await db.insert(clients).values({
      email: 'test@example.com',
      passwordHash: clientPasswordHash,
      billingEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      active: true,
    }).returning();

    // Create test castles
    await db.insert(castles).values([
      {
        clientId: client.id,
        name: 'Castelo Principal',
        settingsJson: JSON.stringify({
          autoFight: true,
          autoUpgrade: false,
          autoCollect: true,
          maxTroops: 5000,
          defenseStrategy: 'balanced',
        }),
      },
      {
        clientId: client.id,
        name: 'Castelo Secundário',
        settingsJson: JSON.stringify({
          autoFight: false,
          autoUpgrade: true,
          autoCollect: true,
          maxTroops: 3000,
          defenseStrategy: 'defensive',
        }),
      },
    ]);

    // Create templates
    await db.insert(templates).values([
      {
        name: 'Template Agressivo',
        settingsJson: JSON.stringify({
          autoFight: true,
          autoUpgrade: true,
          autoCollect: true,
          maxTroops: 10000,
          defenseStrategy: 'aggressive',
        }),
      },
      {
        name: 'Template Defensivo',
        settingsJson: JSON.stringify({
          autoFight: false,
          autoUpgrade: true,
          autoCollect: true,
          maxTroops: 7000,
          defenseStrategy: 'defensive',
        }),
      },
    ]);

    console.log('Seed completed successfully!');
    console.log('');
    console.log('Test credentials:');
    console.log('Admin: admin@prosite.com / admin123456');
    console.log('Client: test@example.com / test123456');
  } catch (error) {
    console.error('Seed failed:', error);
    process.exit(1);
  }
}

seed();