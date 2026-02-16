import type { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Facebook from 'next-auth/providers/facebook';
import Twitter from 'next-auth/providers/twitter';
import Credentials from 'next-auth/providers/credentials';
import { db } from '@db';
import bcrypt from 'bcryptjs';

if (!process.env.AUTH_SECRET) {
	throw new Error('AUTH_SECRET is not defined');
}

export default {
	providers: [
		Google({
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Facebook({
			clientId: process.env.FACEBOOK_CLIENT_ID,
			clientSecret: process.env.FACEBOOK_APP_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Twitter({
			clientId: process.env.TWITTER_CLIENT_ID,
			clientSecret: process.env.TWITTER_CLIENT_SECRET,
			allowDangerousEmailAccountLinking: true,
		}),
		Credentials({
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await db.user.findUnique({
					where: { email: credentials.email as string },
				});

				if (!user || !user.passwordHash) {
					return null;
				}

				const validPassword = await bcrypt.compare(
					credentials.password as string,
					user.passwordHash,
				);

				if (!validPassword) {
					return null;
				}

				return {
					id: user.id.toString(),
					email: user.email,
					name: user.name,
					role: user.role,
					membershipTier: user.membershipTier ?? undefined,
					membershipStatus: user.membershipStatus ?? undefined,
				};
			},
		}),
	],
	pages: {
		signIn: '/',
		error: '/',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.role = user.role;
				token.membershipTier = (user.membershipTier ?? undefined) as
					| 'PAR'
					| 'BIRDIE'
					| 'HOLEINONE';
				token.membershipStatus = (user.membershipStatus ?? undefined) as
					| 'ACTIVE'
					| 'CANCELLED';
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
				session.user.membershipStatus = (token.membershipStatus ?? undefined) as
					| 'ACTIVE'
					| 'CANCELLED';
			}
			return session;
		},
		async signIn({ user, account }) {
			if (account?.provider === 'credentials') {
				return true;
			}

			const email = user.email;
			if (!email) return false;

			try {
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
					const updateData: any = {};
					if (account?.provider === 'google' && !existingUser.googleId) {
						updateData.googleId = account.providerAccountId;
					}
					if (account?.provider === 'facebook' && !existingUser.facebookId) {
						updateData.facebookId = account.providerAccountId;
					}
					if (account?.provider === 'twitter' && !existingUser.twitterId) {
						updateData.twitterId = account.providerAccountId;
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
	trustHost: true,
} satisfies NextAuthConfig;
