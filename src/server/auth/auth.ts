import { db } from '@db';
import { auth } from '../../auth';

export const isAdmin = async (): Promise<boolean> => {
	const session = await auth();
	return session?.user?.role === 'admin';
};

/**
 * Get the current authenticated user from the NextAuth session.
 * Returns the full DB user (minus passwordHash) or null.
 */
export const getSessionUser = async () => {
	const session = await auth();
	if (!session?.user?.id) return null;

	try {
		const user = await db.user.findUnique({
			where: { id: parseInt(session.user.id, 10) },
		});

		if (!user) return null;

		const { passwordHash, ...safeUser } = user;
		return safeUser;
	} catch (error) {
		return null;
	}
};
