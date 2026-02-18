import 'dotenv/config';
/**
 * Main seed entry. Test users only in non-production (dev/CI). Demo data optional.
 *   npx tsx scripts/seed.ts           — test users (dev/CI only) or nothing in production
 *   npx tsx scripts/seed.ts --demo   — same + demo data (bays/slots)
 *
 * Test users (admin@example.com etc.) are never created in production to avoid
 * known credentials in the codebase being usable on live environments.
 */
import { db } from '@db';
import { seedTestUsers } from './seed-test-users.js';
import { seedDemoData } from './seed-demo-data.js';

const isProduction = process.env.NODE_ENV === 'production';
const isCI = process.env.CI === 'true' || process.env.CI === '1';
const shouldSeedTestUsers = !isProduction || isCI;

const main = async () => {
	const args = process.argv.slice(2);
	const withDemo = args.includes('--demo');

	if (shouldSeedTestUsers) {
		await seedTestUsers(db);
	} else {
		console.log('Skipping test users in production.');
	}
	if (withDemo) {
		await seedDemoData(db);
	}
};

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(() => db.$disconnect());
