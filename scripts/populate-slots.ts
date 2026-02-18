import 'dotenv/config';
/**
 * Populates slots for the next 365 days (excluding Sundays). Run after create-bay.
 *   npx tsx scripts/populate-slots.ts
 */
import { PrismaClient } from '@prisma/client';

const TIME_SLOTS = [
	{ start: '10:00', end: '10:55' },
	{ start: '11:00', end: '11:55' },
	{ start: '12:00', end: '12:55' },
	{ start: '13:00', end: '13:55' },
	{ start: '14:00', end: '14:55' },
	{ start: '15:00', end: '15:55' },
	{ start: '16:00', end: '16:55' },
	{ start: '17:00', end: '17:55' },
	{ start: '18:00', end: '18:55' },
	{ start: '19:00', end: '19:55' },
	{ start: '20:00', end: '20:55' },
	{ start: '21:00', end: '21:55' },
];

const DAYS_TO_CREATE = 365;

const createSlots = async (prisma: PrismaClient): Promise<void> => {
	const bays = await prisma.bay.findMany();
	if (bays.length === 0) {
		throw new Error('No bays found. Run create-bay.ts first.');
	}

	for (let i = 0; i < DAYS_TO_CREATE; i++) {
		const date = new Date();
		date.setDate(date.getDate() + i);

		if (date.getDay() === 0) {
			console.log(`Skipping Sunday: ${date.toDateString()}`);
			continue;
		}

		const slotsToCreate: Array<{
			startTime: Date;
			endTime: Date;
			status: string;
			bayId: number;
		}> = [];

		for (const slot of TIME_SLOTS) {
			const [startH, startM] = slot.start.split(':').map(Number);
			const [endH, endM] = slot.end.split(':').map(Number);

			const startTime = new Date(date);
			startTime.setHours(startH, startM, 0, 0);
			const endTime = new Date(date);
			endTime.setHours(endH, endM, 0, 0);

			for (const bay of bays) {
				slotsToCreate.push({
					startTime: new Date(startTime),
					endTime: new Date(endTime),
					status: 'available',
					bayId: bay.id,
				});
			}
		}

		if (slotsToCreate.length > 0) {
			await prisma.slot.createMany({
				data: slotsToCreate,
				skipDuplicates: true,
			});
		}
	}

	console.log('Slots populated successfully.');
};

export { createSlots };

const runAsScript = process.argv[1]?.includes('populate-slots');
if (runAsScript) {
	const { db } = await import('@db');
	createSlots(db)
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(() => db.$disconnect());
}
