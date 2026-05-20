const COMPANY_INFO = {
	name: 'The Short Grass',
	email: 'theshortgrass@jamesgower.dev',
	phone: '+44 7986 445123',
	tagline: 'Play. Practice. Perform.',
	address: 'Royal Star Arcade, High St, Maidstone, ME14 1JL',
	emailDomain: 'jamesgower.dev',
	social: {
		facebook: 'https://www.facebook.com/theshortgrass-PLACEHOLDER',
		instagram: 'https://www.instagram.com/theshortgrass-PLACEHOLDER',
		twitter: 'https://x.com/theshortgrass-PLACEHOLDER',
		youtube: '#',
	},
	googleMapsEmbedUrl:
		'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2496.7280278529666!2d0.5157631767260644!3d51.2718865295977!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47df334ce5288035%3A0x308a415dedd49af5!2sHigh%20St%2C%20Maidstone%20ME14%201JL%2C%20UK!5e0!3m2!1sen!2sus!4v1712077333092!5m2!1sen!2sus',
} as const;

/** Address split at commas for stacked / multiline display. */
export const companyAddressLines = COMPANY_INFO.address
	.split(',')
	.map((part) => part.trim())
	.filter(Boolean);

/** Newlines render when parent uses `white-space: pre-line` (or use `companyAddressLines`). */
export const companyAddressMultiline = companyAddressLines.join('\n');

export const companyPhoneTel = `tel:${COMPANY_INFO.phone.replace(/\s/g, '')}`;

export const companyEmailMailto = `mailto:${COMPANY_INFO.email}?subject=${encodeURIComponent(
	'Enquiry from The Short Grass website',
)}`;

export const companyAddressMaps = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
	COMPANY_INFO.address,
)}`;

export default COMPANY_INFO;
