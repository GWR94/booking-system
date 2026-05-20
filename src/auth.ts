import NextAuth from 'next-auth';
import { getServerSession } from 'next-auth';
import type { Session } from 'next-auth';
import { normalizeSiteUrl } from '@utils/site-url';
import authConfig from './auth.config';

/** NextAuth v4 reads `NEXTAUTH_URL` for OAuth callbacks; keep one canonical URL in env. */
const syncNextAuthUrlFromPublicAppUrl = () => {
	const publicUrl = process.env.NEXT_PUBLIC_APP_URL?.trim();
	if (!publicUrl || process.env.NEXTAUTH_URL?.trim()) {
		return;
	}
	process.env.NEXTAUTH_URL = normalizeSiteUrl(publicUrl);
};

syncNextAuthUrlFromPublicAppUrl();

const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

export const authOptions = {
	session: { strategy: 'jwt', maxAge: SESSION_MAX_AGE_SECONDS },
	jwt: { maxAge: SESSION_MAX_AGE_SECONDS },
	secret: process.env.AUTH_SECRET,
	...authConfig,
} as const;

const nextAuthHandler = NextAuth(authOptions as any);

export const handlers = {
	GET: nextAuthHandler,
	POST: nextAuthHandler,
};

export const auth = async (): Promise<Session | null> =>
	(await getServerSession(authOptions as any)) as Session | null;
