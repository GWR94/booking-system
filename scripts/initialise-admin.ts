import 'dotenv/config';
/**
 * Creates an admin user from env. Run once when setting up production/staging.
 * Requires ADMIN_EMAIL and ADMIN_PASSWORD in environment.
 *   npx tsx scripts/initialise-admin.ts
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const initialiseAdmin = async (prisma: PrismaClient): Promise<void> => {
	const adminEmail = process.env.ADMIN_EMAIL;
	const password = process.env.ADMIN_PASSWORD;

	if (!adminEmail || !password) {
		throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD must be set in the environment.');
	}

	const existingAdmin = await prisma.user.findFirst({
		where: { email: adminEmail, role: 'admin' },
	});

	if (existingAdmin) {
		console.log('Admin user already exists.');
		return;
	}

	const passwordHash = await bcrypt.hash(password, 10);
	await prisma.user.create({
		data: {
			email: adminEmail,
			name: 'Administrator',
			role: 'admin',
			passwordHash,
		},
	});
	console.log('Admin user created.');
};

export { initialiseAdmin };

const runAsScript = process.argv[1]?.includes('initialise-admin');
if (runAsScript) {
	const { db } = await import('@db');
	initialiseAdmin(db)
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(() => db.$disconnect());
}
