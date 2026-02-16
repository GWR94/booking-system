export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';

export async function GET(req: NextRequest) {
	const { searchParams } = new URL(req.url);
	const email = searchParams.get('email');

	if (!email) {
		return NextResponse.json(
			{ message: 'Email is required' },
			{ status: 400 },
		);
	}

	try {
		const user = await db.user.findUnique({
			where: { email },
		});

		if (!user) {
			return NextResponse.json({ exists: false });
		}

		return NextResponse.json({ exists: true, role: user.role });
	} catch (error) {
		console.error('Error checking email:', error);
		return NextResponse.json({ exists: false, error: true });
	}
}
