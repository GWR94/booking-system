import 'dotenv/config';
import { execSync } from 'node:child_process';
import { db } from '@db';
import { createBays } from '../scripts/create-bay.js';
import { createSlots } from '../scripts/populate-slots.js';
import { seedTestUsers } from '../scripts/seed-test-users.js';

export default async function globalSetup() {
	if (!process.env.DATABASE_URL) {
		console.warn(
			'[e2e] DATABASE_URL is not set — skipping DB sync. Auth/booking tests may skip or fail.',
		);
		return;
	}

	try {
		console.log('[e2e] Syncing database schema…');
		execSync('npx prisma db push', { stdio: 'inherit' });

		console.log('[e2e] Seeding bays, slots, and test users…');
		await createBays(db);
		await createSlots(db);
		await seedTestUsers(db);
	} catch (error) {
		console.error('[e2e] Database setup failed:', error);
		throw error;
	} finally {
		await db.$disconnect();
	}
}
