import Stripe from 'stripe';

let stripe: Stripe;

export const getStripe = () => {
	if (!stripe) {
		stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
			apiVersion: '2025-01-27.acacia' as Stripe.LatestApiVersion,
		});
	}
	return stripe;
};
