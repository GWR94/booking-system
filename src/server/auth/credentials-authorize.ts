import type { User } from 'next-auth';

type DbUser = {
	id: number;
	email: string | null;
	name: string | null;
	passwordHash: string | null;
	role: string;
	membershipTier: string | null;
	membershipStatus: string | null;
};

type Db = {
	user: {
		findUnique: (args: { where: { email: string } }) => Promise<DbUser | null>;
	};
};

type Bcrypt = {
	compare: (plain: string, hash: string) => Promise<boolean>;
};

/** Credentials from NextAuth (values are unknown until validated). */
type CredentialsInput = Partial<Record<string, unknown>> | undefined;

function isMembershipTier(
	s: string | null,
): s is NonNullable<User['membershipTier']> {
	return s === 'PAR' || s === 'BIRDIE' || s === 'HOLEINONE';
}

function isMembershipStatus(
	s: string | null,
): s is NonNullable<User['membershipStatus']> {
	return s === 'ACTIVE' || s === 'CANCELLED';
}

function getEmailPassword(
	credentials: CredentialsInput,
): { email: string; password: string } | null {
	if (!credentials) return null;
	const email =
		typeof credentials.email === 'string' && credentials.email.trim()
			? credentials.email.trim()
			: null;
	const password =
		typeof credentials.password === 'string' ? credentials.password : null;
	if (!email || !password) return null;
	return { email, password };
}

/**
 * Authorize credentials (email/password) against the database.
 * Extracted for testability; used by NextAuth Credentials provider in auth.config.
 */
export async function authorizeCredentials(
	credentials: CredentialsInput,
	db: Db,
	bcrypt: Bcrypt,
): Promise<User | null> {
	const creds = getEmailPassword(credentials);
	if (!creds) return null;

	const user = await db.user.findUnique({
		where: { email: creds.email },
	});

	if (!user || !user.passwordHash) {
		return null;
	}

	const validPassword = await bcrypt.compare(
		creds.password,
		user.passwordHash,
	);

	if (!validPassword) {
		return null;
	}

	// Credentials users must have a name (required by NextAuth User type)
	if (!user.name) {
		return null;
	}

	return {
		id: user.id.toString(),
		email: user.email,
		name: user.name,
		role: user.role,
		membershipTier: isMembershipTier(user.membershipTier)
			? user.membershipTier
			: undefined,
		membershipStatus: isMembershipStatus(user.membershipStatus)
			? user.membershipStatus
			: undefined,
	};
}
