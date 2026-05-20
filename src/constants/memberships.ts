/**
 * Single source for membership marketing copy, Stripe IDs, and usage rules.
 * UI lists use `memberships` (display order); APIs and services use `MEMBERSHIP_TIERS` + `MembershipTier`.
 */
export const MEMBERSHIP_TIER_ORDER = ['PAR', 'BIRDIE', 'HOLEINONE'] as const;

export type MembershipTier = (typeof MEMBERSHIP_TIER_ORDER)[number];

export const MEMBERSHIP_TIERS = {
	PAR: {
		title: 'Par',
		price: '£199.99',
		period: '/month',
		features: [
			'5 hours included play',
			'10% off bar & food',
			'Weekday access only',
			'Priority booking (7 days)',
		],
		recommended: false,
		includedHours: 5,
		discount: 0.1, // 10%
		priceId: process.env.STRIPE_PRICE_ID_PAR,
		amountPence: 19999,
		weekendAccess: false,
	},
	BIRDIE: {
		title: 'Birdie',
		price: '£299.99',
		period: '/month',
		features: [
			'10 hours included play',
			'15% off bar & food',
			'Full weekend access',
			'Priority booking (14 days)',
		],
		recommended: true,
		includedHours: 10,
		discount: 0.15, // 15%
		priceId: process.env.STRIPE_PRICE_ID_BIRDIE,
		amountPence: 29999,
		weekendAccess: true,
	},
	HOLEINONE: {
		title: 'Hole-In-One',
		price: '£399.99',
		period: '/month',
		features: [
			'15 hours included play',
			'20% off bar & food',
			'Full weekend access',
			'Priority booking (30 days)',
			'Free club storage',
		],
		recommended: false,
		includedHours: 15,
		discount: 0.2, // 20%
		priceId: process.env.STRIPE_PRICE_ID_HOLEINONE,
		amountPence: 39999,
		weekendAccess: true,
	},
} as const;

export const memberships = MEMBERSHIP_TIER_ORDER.map((tierKey) => ({
	tierKey,
	...MEMBERSHIP_TIERS[tierKey],
}));

export type TierInfo = (typeof memberships)[number];

export interface FaqItem {
	question: string;
	answer: string;
}

export const faqData: Record<string, FaqItem[]> = {
	booking: [
		{
			question: 'How do I book a golf simulator session?',
			answer:
				"To book a simulator, navigate to the 'Book' page, select your preferred date, session duration, and bay. Available time slots will be displayed for you to choose from. Add your preferred slot to the basket and proceed to checkout.",
		},
		{
			question: 'Can I book multiple time slots?',
			answer:
				'Yes, you can add multiple time slots to your basket before checking out. This allows you to book consecutive hours or different days as needed.',
		},
		{
			question: 'What is the cancellation policy?',
			answer:
				'Bookings can be cancelled up to 24 hours before the scheduled start time for a full refund. Cancellations made less than 24 hours in advance will be charged 50% of the booking fee.',
		},
		{
			question: 'Can I modify my booking after confirming?',
			answer:
				"Yes, you can modify your booking up to 24 hours before your scheduled time. Go to 'My Profile' > 'My Bookings' to make changes to your reservation.",
		},
	],
	payment: [
		{
			question: 'What payment methods do you accept?',
			answer:
				'We accept all major credit and debit cards including Visa, Mastercard, and American Express. We also accept PayPal for online bookings.',
		},
		{
			question: 'When am I charged for my booking?',
			answer:
				'Your payment is processed immediately upon completing your booking. You will receive an email confirmation with your receipt and booking details.',
		},
		{
			question: 'Is my payment information secure?',
			answer:
				'Yes, we use industry-standard encryption and secure payment processors to ensure your payment information is protected. We do not store your card details on our servers.',
		},
	],
	facilities: [
		{
			question: 'What equipment is provided with the simulator?',
			answer:
				'Each simulator bay comes equipped with a TrackMan launch monitor, high-definition projector, and premium hitting mat. Golf clubs are not provided, so please bring your own clubs.',
		},
		{
			question: 'How many people can use a simulator bay at once?',
			answer:
				'Each bay comfortably accommodates up to 4 players. If you have a larger group, we recommend booking multiple bays.',
		},
		{
			question: 'Are there refreshments available?',
			answer:
				'We offer a selection of soft drinks, beer, and light snacks at our facility. You are also welcome to bring your own refreshments.',
		},
		{
			question: 'Is there parking available?',
			answer:
				'Yes, we have free parking available for all customers during their booking time.',
		},
	],
	account: [
		{
			question: 'How do I create an account?',
			answer:
				"Click on the 'Register' button in the top right corner of our website. Fill in your details, verify your email address, and you're ready to start booking.",
		},
		{
			question: 'I forgot my password. How do I reset it?',
			answer:
				"On the login page, click 'Forgot Password'. Enter your email address and we'll send you instructions to reset your password.",
		},
		{
			question: 'How can I update my profile information?',
			answer:
				"Log in to your account and navigate to 'My Profile'. Here you can update your personal information, change your password, and manage your payment methods.",
		},
	],
	membership: [
		{
			question: 'Can I cancel my membership anytime?',
			answer:
				'Yes, you can cancel your membership at any time. Your access will remain active until the end of the current billing cycle.',
		},
		{
			question: 'What happens if I exceed my monthly hours?',
			answer:
				'If you exceed your monthly hours, you can book additional simulator time at a discounted rate based on your membership tier.',
		},
		{
			question: 'Can I upgrade or downgrade my membership?',
			answer:
				'Yes, you can upgrade or downgrade your membership at any time. Changes will take effect at the start of the next billing cycle.',
		},
		{
			question: 'How does billing work?',
			answer:
				'Memberships renew automatically each month on the same billing date you first subscribed. You will receive an email receipt after each successful payment.',
		},
		{
			question: 'Do unused playing hours roll over?',
			answer:
				'Included hours reset at the start of each billing cycle and do not roll over, so we encourage you to book regularly and get the most from your plan.',
		},
		{
			question: 'How does priority booking work?',
			answer:
				'Your tier sets how far in advance you can book included sessions before they open more widely. Longer windows make it easier to secure peak times and weekends.',
		},
		{
			question: 'Who can use my membership benefits?',
			answer:
				'Included hours and member discounts apply to sessions booked on your account. If you want to bring guests, book under your account so benefits stay aligned with your plan.',
		},
		{
			question: 'How do I update my payment method?',
			answer:
				"Log in, go to My Profile, and open billing or payment settings. From there you can replace your card before the next renewal—we'll charge the new card on your next billing date.",
		},
		{
			question: 'What happens if a payment fails?',
			answer:
				'We will email you and retry the charge. If payment cannot be completed, your membership may be paused until billing succeeds so access stays fair for all members.',
		},
	],
};
