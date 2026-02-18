import 'dotenv/config';
/**
 * Creates default bays. Run once when setting up the DB (before populate-slots).
 *   npx tsx scripts/create-bay.ts
 */
import { PrismaClient } from '@prisma/client';

const createBays = async (prisma: PrismaClient): Promise<void> => {
	console.log('Creating bays...');

	await prisma.bay.upsert({
		where: { name: 'Bay 1' },
		update: {},
		create: { name: 'Bay 1', capacity: 1 },
	});
	await prisma.bay.upsert({
		where: { name: 'Bay 2' },
		update: {},
		create: { name: 'Bay 2', capacity: 1 },
	});
	await prisma.bay.upsert({
		where: { name: 'Bay 3' },
		update: {},
		create: { name: 'Bay 3', capacity: 1 },
	});
	await prisma.bay.upsert({
		where: { name: 'Bay 4' },
		update: {},
		create: { name: 'Bay 4', capacity: 1 },
	});

	console.log('Bays created successfully.');
};

export { createBays };

const runAsScript = process.argv[1]?.includes('create-bay');
if (runAsScript) {
	const { db } = await import('@db');
	createBays(db)
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(() => db.$disconnect());
}
