export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import { getSessionUser } from 'src/server/auth/auth';

export async function DELETE(req: NextRequest) {
	const user = await getSessionUser();

	if (!user) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
	}

	try {
		await db.user.delete({
			where: { id: user.id },
		});

		return NextResponse.json({ message: 'User successfully deleted' });
	} catch (error) {
		console.error('Delete user error:', error);
		return NextResponse.json(
			{
				error:
					error instanceof Error ? error.message : 'Internal Server Error',
			},
			{ status: 500 },
		);
	}
}
