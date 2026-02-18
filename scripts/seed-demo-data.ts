import 'dotenv/config';
/**
 * Seeds demo data: bays and available slots for the next N days.
 * For manual Admin Panel / booking flow testing.
 *
 *   npx tsx scripts/seed-demo-data.ts [numberOfDays]
 *   Example: npx tsx scripts/seed-demo-data.ts 7
 */
import { PrismaClient } from '@prisma/client';

const DEFAULT_DAYS = 7;
const SLOT_DURATION_MS = 60 * 60 * 1000; // 1 hour
const FIRST_SLOT_HOUR = 8; // 8:00
const LAST_SLOT_HOUR = 18; // 18:00 (last slot starts at 17:00)

export const seedDemoData = async (
	prisma: PrismaClient,
	options?: { numberOfDays?: number },
): Promise<void> => {
	const arg =
		options?.numberOfDays ?? process.argv.find((a) => /^\d+$/.test(a));
	const numberOfDays =
		typeof arg === 'number' ? arg : arg ? Number(arg) : DEFAULT_DAYS;

	// Ensure bays exist
	const bayNames = ['Bay 1', 'Bay 2'];
	for (const name of bayNames) {
		await prisma.bay.upsert({
			where: { name },
			update: {},
			create: { name, capacity: 1 },
		});
	}
	const bays = await prisma.bay.findMany({ where: { name: { in: bayNames } } });
	if (bays.length === 0) throw new Error('No bays found after upsert');

	const now = new Date();
	let created = 0;

	for (let d = 0; d < numberOfDays; d++) {
		const date = new Date(now);
		date.setDate(date.getDate() + d);
		date.setHours(0, 0, 0, 0);

		for (const bay of bays) {
			for (let hour = FIRST_SLOT_HOUR; hour < LAST_SLOT_HOUR; hour++) {
				const startTime = new Date(date);
				startTime.setHours(hour, 0, 0, 0);
				const endTime = new Date(startTime.getTime() + SLOT_DURATION_MS);

				await prisma.slot.upsert({
					where: {
						startTime_endTime_bayId: {
							startTime,
							endTime,
							bayId: bay.id,
						},
					},
					update: { status: 'available' },
					create: {
						startTime,
						endTime,
						bayId: bay.id,
						status: 'available',
					},
				});
				created++;
			}
		}
	}

	console.log(
		`Seeded demo data: ${bays.length} bays, ${created} slots over ${numberOfDays} days.`,
	);
};

// Run when executed directly (npm run seed:demo)
const runAsScript = process.argv[1]?.includes('seed-demo-data');
if (runAsScript) {
	const { db } = await import('@db');
	seedDemoData(db)
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(() => db.$disconnect());
}
