import 'dotenv/config';
/**
 * Initial dev DB setup. Run once for a fresh local database.
 *
 *   npx tsx scripts/setup-dev.ts
 *   npm run setup:dev
 *
 * Runs: create bays → populate slots (365 days) → seed test users (test@example.com, admin@example.com).
 */
import { db } from '@db';
import { createBays } from './create-bay.js';
import { createSlots } from './populate-slots.js';
import { seedTestUsers } from './seed-test-users.js';

const main = async () => {
	console.log('Running initial dev setup...\n');

	await createBays(db);
	await createSlots(db);
	await seedTestUsers(db);

	console.log('\nDev setup complete. You can log in with test@example.com or admin@example.com (see seed-test-users.ts).');
};

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => db.$disconnect());
