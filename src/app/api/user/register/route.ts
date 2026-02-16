import { NextRequest, NextResponse } from 'next/server';
import { db } from '@db';
import bcrypt from 'bcryptjs';
import { apiRegisterSchema } from '@validation/api-schemas';

export async function POST(req: NextRequest) {
	try {
		const body = await req.json();
		const { name, email, password } = body;

		const { error } = apiRegisterSchema.validate({ name, email, password });
		if (error) {
			return NextResponse.json(
				{ message: error.details[0].message },
				{ status: 400 },
			);
		}

		const userExists = await db.user.findUnique({
			where: { email },
		});

		if (userExists && userExists.passwordHash) {
			return NextResponse.json(
				{ message: 'User already exists', error: 'DUPLICATE_USER' },
				{ status: 409 },
			);
		}

		const passwordHash = await bcrypt.hash(password, 10);

		if (userExists) {
			const updatedUser = await db.user.update({
				where: { email },
				data: {
					passwordHash,
					name: name,
				},
			});

			return NextResponse.json(
				{
					message: 'User registered successfully (Merged)',
					user: { id: updatedUser.id, email: updatedUser.email },
				},
				{ status: 201 },
			);
		}

		const user = await db.user.create({
			data: {
				name,
				email,
				passwordHash,
			},
		});

		return NextResponse.json(
			{
				message: 'User registered successfully',
				user: { id: user.id, email: user.email },
			},
			{ status: 201 },
		);
	} catch (error) {
		console.error('Registration error:', error);
		return NextResponse.json(
			{ message: 'Internal Server Error' },
			{ status: 500 },
		);
	}
}
