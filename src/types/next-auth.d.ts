import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			role: string;
			membershipTier?: 'PAR' | 'BIRDIE' | 'HOLEINONE';
			membershipStatus?: 'ACTIVE' | 'CANCELLED';
		} & DefaultSession['user'];
	}

	interface User {
		id: string;
		role: string;
		email: string | null;
		name: string;
		membershipTier?: 'PAR' | 'BIRDIE' | 'HOLEINONE';
		membershipStatus?: 'ACTIVE' | 'CANCELLED';
	}
}

declare module '@auth/core/adapters' {
	interface AdapterUser {
		id: string;
		role: string;
		email: string;
		emailVerified: Date | null;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		role: string;
		membershipTier?: 'PAR' | 'BIRDIE' | 'HOLEINONE';
		membershipStatus?: 'ACTIVE' | 'CANCELLED';
	}
}
