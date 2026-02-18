interface FaqItem {
	question: string;
	answer: string;
}

const faqData: Record<string, FaqItem[]> = {
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
};

export { faqData };
export type { FaqItem };
