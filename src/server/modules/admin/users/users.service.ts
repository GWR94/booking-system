import { db } from '@db';
import {
	Prisma,
	type MembershipTier,
	type MembershipStatus,
} from '@prisma/client';
import jwt from 'jsonwebtoken';
import { handleSendEmail } from '@utils/email';

export class AdminUsersService {
	/**
	 * Get all users with their bookings
	 */
	static async getAllUsers() {
		return await db.user.findMany({
			include: {
				bookings: {
					include: {
						slots: {
							include: {
								bay: true,
							},
						},
					},
				},
			},
			orderBy: { id: 'asc' },
		});
	}

	/**
	 * Update user details
	 */
	static async updateUserDetails(
		userId: number,
		data: {
			name?: string;
			email?: string;
			role?: string;
			membershipTier?: string | null;
			membershipStatus?: string | null;
		},
	) {
		const existingUser = await db.user.findUnique({
			where: { id: userId },
		});

		if (!existingUser) {
			throw new Error('User not found');
		}

		const updateData: Prisma.UserUpdateInput = {
			name: data.name,
			email: data.email,
			role: data.role,
			membershipTier: data.membershipTier as MembershipTier,
			membershipStatus: data.membershipStatus as MembershipStatus,
		};

		for (const key of Object.keys(
			updateData,
		) as (keyof Prisma.UserUpdateInput)[]) {
			if (updateData[key] === undefined) {
				delete updateData[key];
			}
		}

		const user = await db.user.update({
			where: { id: userId },
			data: updateData,
		});

		return { message: 'User updated successfully', user };
	}

	/**
	 * Send password reset email to user
	 */
	static async resetUserPassword(userId: number) {
		const user = await db.user.findUnique({
			where: { id: userId },
		});

		if (!user) {
			throw new Error('User not found');
		}

		if (!user.email) {
			throw new Error('User has no email address');
		}

		const resetToken = jwt.sign(
			{ id: user.id, email: user.email },
			process.env.ACCESS_TOKEN_SECRET as string,
			{ expiresIn: '1h' },
		);
		const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

		await db.user.update({
			where: { id: user.id },
			data: {
				resetToken,
				resetTokenExpiry,
			},
		});

		const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

		await handleSendEmail({
			senderPrefix: 'noreply',
			recipientEmail: user.email,
			subject: 'Admin Requested Password Reset',
			templateName: 'password-reset',
			templateContext: {
				name: user.name,
				resetUrl,
				year: new Date().getFullYear(),
				baseUrl: process.env.NEXT_PUBLIC_APP_URL,
				logoUrl: process.env.LOGO_URL,
			},
		});

		return { message: "Password reset link sent to user's email" };
	}
}
