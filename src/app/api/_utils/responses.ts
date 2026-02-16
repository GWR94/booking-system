import { NextResponse } from 'next/server';

export const errorResponse = (
	message: string,
	status: number,
	code?: string,
) => {
	return NextResponse.json(
		{
			error: message,
			message,
			...(code ? { code } : {}),
		},
		{ status },
	);
};
