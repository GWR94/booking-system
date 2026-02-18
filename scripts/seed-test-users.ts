import 'dotenv/config';
/**
 * Seeds e2e test users. Matches e2e/fixtures/test-data.ts.
 * Used by CI (prisma db seed) and locally: npm run seed:test-users
 */
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const TEST_USER = {
	email: 'test@example.com',
	password: 'Test123!',
	name: 'Test User',
	role: 'user',
};

const TEST_ADMIN = {
	email: 'admin@example.com',
	password: 'Admin123!',
	name: 'Admin User',
	role: 'admin',
};

export const seedTestUsers = async (prisma: PrismaClient): Promise<void> => {
	const hash = (password: string) => bcrypt.hash(password, 10);

	await prisma.user.upsert({
		where: { email: TEST_USER.email },
		update: {
			passwordHash: await hash(TEST_USER.password),
			name: TEST_USER.name,
			role: TEST_USER.role,
		},
		create: {
			email: TEST_USER.email,
			passwordHash: await hash(TEST_USER.password),
			name: TEST_USER.name,
			role: TEST_USER.role,
		},
	});

	await prisma.user.upsert({
		where: { email: TEST_ADMIN.email },
		update: {
			passwordHash: await hash(TEST_ADMIN.password),
			name: TEST_ADMIN.name,
			role: TEST_ADMIN.role,
		},
		create: {
			email: TEST_ADMIN.email,
			passwordHash: await hash(TEST_ADMIN.password),
			name: TEST_ADMIN.name,
			role: TEST_ADMIN.role,
		},
	});

	console.log('Seeded e2e test users:', TEST_USER.email, TEST_ADMIN.email);
};

// Run when executed directly (npm run seed:test-users)
const runAsScript = process.argv[1]?.includes('seed-test-users');
if (runAsScript) {
	const { db } = await import('@db');
	seedTestUsers(db)
		.catch((e) => {
			console.error(e);
			process.exit(1);
		})
		.finally(() => db.$disconnect());
}
