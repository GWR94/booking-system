export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { auth } from '../../../../auth';
import { MembershipService } from '@/server/modules/membership/membership.service';
import { parseWithFirstError } from '@lib/zod';
import { apiUserProfileUpdateSchema } from '@validation/api-schemas';
import { errorResponse } from '../../_utils/responses';

export const GET = async (req: NextRequest) => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return NextResponse.json({ user: null });
		}

		const userId = Number(session.user.id);
		if (!Number.isInteger(userId) || userId < 1) {
			return NextResponse.json({ user: null });
		}

		const user = await db.user.findUnique({
			where: { id: userId },
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
		});

		if (!user) {
			return NextResponse.json({ user: null });
		}

		const hasPassword = !!user.passwordHash;
		const { passwordHash, ...safeUser } = user;

		const membershipUsage = await MembershipService.getUsageStats(user as any);

		return NextResponse.json({
			user: {
				...safeUser,
				hasPassword,
				membershipUsage,
			},
		});
	} catch (error) {
		console.error('Get user error:', error);
		return NextResponse.json(
			{ error: 'Internal Server Error' },
			{ status: 500 },
		);
	}
};

export const PATCH = async (req: NextRequest) => {
	try {
		const session = await auth();
		if (!session?.user?.id) {
			return errorResponse('Unauthorized', 401, 'AUTH_REQUIRED');
		}

		const userId = Number(session.user.id);
		const rawBody = await req.json();
		const parsed = parseWithFirstError(apiUserProfileUpdateSchema, rawBody);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400, 'VALIDATION_ERROR');
		}
		const body = parsed.data;

		// Mass assignment protection - only allow certain fields
		const { name, email, phone, allowMarketing } = body;
		const updateData: any = {};
		if (name !== undefined) updateData.name = name;
		if (email !== undefined) updateData.email = email;
		if (phone !== undefined) updateData.phone = phone;
		if (allowMarketing !== undefined)
			updateData.allowMarketing = allowMarketing;

		if (Object.keys(updateData).length === 0) {
			return errorResponse(
				'No valid fields provided for update',
				400,
				'VALIDATION_ERROR',
			);
		}

		const updatedUser = await db.user.update({
			where: { id: userId },
			data: updateData,
		});

		// Exclude sensitive fields from response
		const { passwordHash: _, ...safeUser } = updatedUser as any;

		return NextResponse.json({
			message: 'Profile updated successfully',
			user: safeUser,
		});
	} catch (error) {
		console.error('Update user profile error:', error);
		return errorResponse('Internal Server Error', 500);
	}
};
