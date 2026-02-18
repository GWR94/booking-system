import { NextRequest, NextResponse } from 'next/server';
import Handlebars from 'handlebars';
import fs from 'fs/promises';
import path from 'path';

const TEMPLATES = ['confirmation', 'password-reset', 'contact-form'] as const;
type TemplateName = (typeof TEMPLATES)[number];

const getDummyContext = (template: TemplateName): Record<string, unknown> => {
	const baseUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://example.com';
	const logoUrl = process.env.LOGO_URL ?? 'https://via.placeholder.com/200x60?text=Logo';
	const year = new Date().getFullYear();

	switch (template) {
		case 'confirmation':
			return {
				booking: {
					id: 12345,
					slots: [
						{ bay: 'Bay 1', date: 'Mon 17 Feb 2025', startTime: '09:00', endTime: '10:00' },
						{ bay: 'Bay 2', date: 'Mon 17 Feb 2025', startTime: '10:00', endTime: '11:00' },
					],
				},
				payment: { intentId: 'pi_abc123', amount: '24.00' },
				baseUrl,
				logoUrl,
				year,
			};
		case 'password-reset':
			return {
				name: 'Alex Smith',
				resetUrl: `${baseUrl}/reset-password?token=abc123def456`,
				year,
			};
		case 'contact-form':
			return {
				name: 'Jordan Lee',
				email: 'jordan@example.com',
				phone: '+44 7700 900000',
				subject: 'Question about membership',
				message: 'Hi,\n\nI’d like to know more about your membership tiers and how to upgrade.\n\nThanks!',
				baseUrl,
				year,
			};
		default:
			return {};
	}
};

export const GET = async (req: NextRequest) => {
	const template = req.nextUrl.searchParams.get('template') as TemplateName | null;
	if (!template || !TEMPLATES.includes(template)) {
		return NextResponse.json(
			{ error: 'Missing or invalid template. Use ?template=confirmation|password-reset|contact-form' },
			{ status: 400 }
		);
	}

	const viewPath = path.resolve(process.cwd(), 'src/templates/emails');
	const partialsDir = path.resolve(process.cwd(), 'src/templates/partials');

	try {
		// Register partials (header uses logoUrl; footer uses baseUrl, year)
		const [headerSrc, footerSrc] = await Promise.all([
			fs.readFile(path.join(partialsDir, 'header.hbs'), 'utf-8'),
			fs.readFile(path.join(partialsDir, 'footer.hbs'), 'utf-8'),
		]);
		Handlebars.registerPartial('header', headerSrc);
		Handlebars.registerPartial('footer', footerSrc);

		const templateSrc = await fs.readFile(path.join(viewPath, `${template}.hbs`), 'utf-8');
		const compile = Handlebars.compile(templateSrc);
		const html = compile(getDummyContext(template));

		return new NextResponse(html, {
			headers: { 'Content-Type': 'text/html; charset=utf-8' },
		});
	} catch (err) {
		console.error('Email preview error:', err);
		return NextResponse.json({ error: 'Failed to render template' }, { status: 500 });
	}
};
