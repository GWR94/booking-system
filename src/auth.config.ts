import type { NextAuthOptions } from 'next-auth';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import { TwitterLegacy } from 'next-auth/providers/twitter';
import Credentials from 'next-auth/providers/credentials';
import type { Prisma } from '@prisma/client';
import { db } from '@db';
import bcrypt from 'bcryptjs';
import { authorizeCredentials } from '@/server/auth/credentials-authorize';

interface DbUser {
	id: number;
	role: string;
	membershipTier: 'PAR' | 'BIRDIE' | 'HOLEINONE' | null;
	membershipStatus: 'ACTIVE' | 'CANCELLED' | null;
}

const getProviderWhere = (provider: string, providerAccountId: string) => {
	if (provider === 'google') return { googleId: providerAccountId };
	if (provider === 'facebook') return { facebookId: providerAccountId };
	if (provider === 'twitter') return { twitterId: providerAccountId };
	return null;
};

const isOAuthEmailVerified = (provider: string, profile?: unknown): boolean => {
	if (!profile || typeof profile !== 'object') return false;

	// Google exposes a reliable boolean email_verified claim.
	if (provider === 'google') {
		const googleProfile = profile as { email_verified?: unknown };
		return googleProfile.email_verified === true;
	}

	// Facebook includes a "verified" marker in many profile payloads.
	if (provider === 'facebook') {
		const facebookProfile = profile as { verified?: unknown };
		return facebookProfile.verified === true;
	}

	// Twitter/X legacy provider doesn't provide a consistent verified-email claim.
	return false;
};

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID!,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
		}),
		Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID!,
			clientSecret: process.env.FACEBOOK_APP_SECRET!,
		}),
		TwitterLegacy({
			clientId: process.env.TWITTER_CONSUMER_KEY!,
			clientSecret: process.env.TWITTER_CONSUMER_SECRET!,
		}),
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				return authorizeCredentials(credentials, db, bcrypt);
			},
		}),
	],
	pages: {
		signIn: '/',
		error: '/',
	},
	callbacks: {
		async jwt({ token, user, account }) {
			if (account?.provider && account.providerAccountId) {
				token.oauthProvider = account.provider;
				token.oauthProviderAccountId = account.providerAccountId;
			}

			const oauthProvider =
				typeof token.oauthProvider === 'string'
					? token.oauthProvider
					: undefined;
			const oauthProviderAccountId =
				typeof token.oauthProviderAccountId === 'string'
					? token.oauthProviderAccountId
					: undefined;
			const tokenEmail =
				typeof token.email === 'string'
					? token.email
					: (user?.email ?? undefined);
			let dbUser: DbUser | null = null;

			// Prefer provider account resolution first for OAuth users (e.g. X can lack email).
			if (oauthProvider && oauthProviderAccountId) {
				const providerWhere = getProviderWhere(
					oauthProvider,
					oauthProviderAccountId,
				);
				if (providerWhere) {
					dbUser = await db.user.findUnique({
						where: providerWhere,
						select: {
							id: true,
							role: true,
							membershipTier: true,
							membershipStatus: true,
						},
					});
				}
			}

			if (!dbUser && tokenEmail) {
				dbUser = await db.user.findUnique({
					where: { email: tokenEmail },
					select: {
						id: true,
						role: true,
						membershipTier: true,
						membershipStatus: true,
					},
				});
			}

			if (!dbUser && oauthProvider && oauthProviderAccountId) {
				const providerWhere = getProviderWhere(
					oauthProvider,
					oauthProviderAccountId,
				);
				if (providerWhere) {
					const created = await db.user.create({
						data: {
							name: user?.name || '',
							email: tokenEmail,
							...providerWhere,
						},
						select: {
							id: true,
							role: true,
							membershipTier: true,
							membershipStatus: true,
						},
					});
					dbUser = created;
				}
			}

			if (dbUser) {
				token.id = String(dbUser.id);
				token.role = dbUser.role;
				token.membershipTier = (dbUser.membershipTier ?? undefined) as
					| 'PAR'
					| 'BIRDIE'
					| 'HOLEINONE';
				token.membershipStatus = (dbUser.membershipStatus ?? undefined) as
					| 'ACTIVE'
					| 'CANCELLED';
				return token;
			}

			if (user?.id) {
				token.id = String(user.id);
			}
			if (user?.role) {
				token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (session.user && token) {
				session.user.id = token.id as string;
				session.user.role = token.role as string;
				session.user.membershipTier = (token.membershipTier ?? undefined) as
					| 'PAR'
					| 'BIRDIE'
					| 'HOLEINONE';
				session.user.membershipStatus = (token.membershipStatus ??
					undefined) as 'ACTIVE' | 'CANCELLED';
			}
			return session;
		},
		async signIn({ user, account, profile }) {
			if (account?.provider === 'credentials') {
				return true;
			}

			const email = user.email;
			const provider = account?.provider;
			const providerAccountId = account?.providerAccountId;
			const emailVerified =
				!!provider && isOAuthEmailVerified(provider, profile);
			const providerWhere =
				provider && providerAccountId
					? getProviderWhere(provider, providerAccountId)
					: null;

			try {
				if (providerWhere) {
					const existingProviderUser = await db.user.findUnique({
						where: providerWhere,
					});
					if (existingProviderUser) {
						return true;
					}
				}

				if (!email) {
					if (!providerWhere) return false;

					await db.user.create({
						data: {
							name: user.name || '',
							...providerWhere,
						},
					});
					return true;
				}

				const existingUser = await db.user.findUnique({
					where: { email },
				});

				if (!existingUser) {
					await db.user.create({
						data: {
							email,
							name: user.name || '',
							googleId:
								account?.provider === 'google'
									? account.providerAccountId
									: undefined,
							facebookId:
								account?.provider === 'facebook'
									? account.providerAccountId
									: undefined,
							twitterId:
								account?.provider === 'twitter'
									? account.providerAccountId
									: undefined,
						},
					});
				} else {
					// Only link by email when the provider confirms email ownership.
					if (!emailVerified) {
						return false;
					}

					const updateData: Prisma.UserUpdateInput = {};
					if (provider === 'google' && !existingUser.googleId) {
						updateData.googleId = providerAccountId;
					}
					if (provider === 'facebook' && !existingUser.facebookId) {
						updateData.facebookId = providerAccountId;
					}
					if (provider === 'twitter' && !existingUser.twitterId) {
						updateData.twitterId = providerAccountId;
					}

					if (Object.keys(updateData).length > 0) {
						await db.user.update({
							where: { email },
							data: updateData,
						});
					}
				}

				return true;
			} catch (error) {
				console.error('Sign in error:', error);
				return false;
			}
		},
	},
} satisfies NextAuthOptions;
