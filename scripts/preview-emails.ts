import path from 'path';
import { mkdir, readFile, writeFile } from 'fs/promises';
import Handlebars from 'handlebars';

const root = process.cwd();
const templatesDir = path.resolve(root, 'src/templates/emails');
const partialsDir = path.resolve(root, 'src/templates/partials');
const outputDir = path.resolve(root, 'email-previews');

const sharedContext = {
	baseUrl: 'http://localhost:3000',
	logoUrl: 'http://localhost:3000/logo.webp',
	year: new Date().getFullYear(),
};

const sampleContexts: Record<string, Record<string, unknown>> = {
	confirmation: {
		...sharedContext,
		booking: {
			id: 1234,
			slots: [
				{
					bay: 'Bay 1',
					date: '31 Mar 2026',
					startTime: '10:00',
					endTime: '11:00',
				},
				{
					bay: 'Bay 1',
					date: '31 Mar 2026',
					startTime: '11:05',
					endTime: '12:05',
				},
			],
		},
		payment: {
			intentId: 'pi_3N6x9Yexample',
			amount: '24.00',
		},
	},
	'password-reset': {
		...sharedContext,
		name: 'Alex',
		resetUrl: 'http://localhost:3000/reset-password?token=demo-token',
		expiresAtFormatted: '31 Mar 2026 at 12:00',
	},
	'pending-payment-reminder': {
		...sharedContext,
		bookingId: 1234,
		expiresAtFormatted: '31 Mar 2026 at 14:30',
		resumeUrl: 'http://localhost:3000/profile/bookings',
	},
	'refund-failed-alert': {
		...sharedContext,
		bookingId: 1234,
		paymentId: 'pi_3N6x9Yexample',
		userEmail: 'customer@example.com',
		detectedAtFormatted: '31 Mar 2026 at 11:15',
	},
	'contact-form': {
		...sharedContext,
		name: 'Jordan Smith',
		email: 'jordan@example.com',
		phone: '07123 456789',
		subject: 'Membership enquiry',
		message:
			'Hi team, I would like to understand what is included in the Birdie plan and how billing works.',
	},
};

const registerPartials = async () => {
	const header = await readFile(path.resolve(partialsDir, 'header.hbs'), 'utf8');
	const footer = await readFile(path.resolve(partialsDir, 'footer.hbs'), 'utf8');
	Handlebars.registerPartial('header', header);
	Handlebars.registerPartial('footer', footer);
};

const renderTemplate = async (templateName: string) => {
	const templatePath = path.resolve(templatesDir, `${templateName}.hbs`);
	const templateSource = await readFile(templatePath, 'utf8');
	const template = Handlebars.compile(templateSource);
	const html = template(sampleContexts[templateName] ?? sharedContext);
	const destination = path.resolve(outputDir, `${templateName}.html`);
	await writeFile(destination, html, 'utf8');
};

const main = async () => {
	await mkdir(outputDir, { recursive: true });
	await registerPartials();

	const templates = Object.keys(sampleContexts);
	for (const templateName of templates) {
		await renderTemplate(templateName);
	}

	console.log(`Rendered ${templates.length} email previews to ${outputDir}`);
};

main().catch((error) => {
	console.error('Failed to render email previews', error);
	process.exit(1);
});

