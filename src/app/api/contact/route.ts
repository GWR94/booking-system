export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { parseWithFirstError } from '@lib/zod';
import { apiContactSchema } from '@validation/api-schemas';
import { errorResponse } from '@/app/api/_utils/responses';

const transporter = nodemailer.createTransport({
	host: process.env.SMTP_HOST,
	port: Number(process.env.SMTP_PORT),
	secure: process.env.SMTP_SECURE === 'true',
	auth: {
		user: process.env.SMTP_USER,
		pass: process.env.SMTP_PASS,
	},
});

export const POST = async (req: NextRequest) => {
	try {
		const body = await req.json();
		const parsed = parseWithFirstError(apiContactSchema, body);
		if (!parsed.success) {
			return errorResponse(parsed.message, 400);
		}
		const { name, email, phone, subject, message } = parsed.data;

		await transporter.sendMail({
			from: `"Contact Form" <${process.env.SMTP_USER}>`,
			to: 'contact@jamesgower.dev', // Hardcoded as per original controller
			replyTo: email,
			subject: `New Contact Form: ${subject}`,
			text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
			html: `
        <h3>New Contact Message</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
		});

		return NextResponse.json({ message: 'Message sent successfully' });
	} catch (err) {
		console.error('Contact form error:', err);
		return errorResponse('Internal Server Error', 500);
	}
};
