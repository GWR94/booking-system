import 'dotenv/config';
/**
 * Initial production DB setup. Run once after migrations.
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in environment.
 *
 *   npx tsx scripts/setup-production.ts
 *   npm run setup:production
 *
 * Runs: create bays → populate slots (365 days) → create admin user.
 */
import { db } from '@db';
import { createBays } from './create-bay.js';
import { createSlots } from './populate-slots.js';
import { initialiseAdmin } from './initialise-admin.js';

const main = async () => {
	console.log('Running initial production setup...\n');

	await createBays(db);
	await createSlots(db);
	await initialiseAdmin(db);

	console.log('\nProduction setup complete.');
};

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => db.$disconnect());
