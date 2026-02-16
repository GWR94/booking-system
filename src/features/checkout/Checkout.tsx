'use client';

import { Box, Container, useTheme } from '@mui/material';
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { createGuestPaymentIntent, createPaymentIntent } from '@api';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import {
	CheckoutForm,
	GuestUser,
	GuestInfo,
	CheckoutSkeleton,
} from './components';
import { useBasket, useAuth, useBookingManager } from '@hooks';
import { useSnackbar } from '@context';
import { SectionHeader, AnimateIn } from '@ui';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';

const stripe = loadStripe(
	process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string,
);

const Checkout = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const paymentIntentClientSecret = searchParams?.get(
		'payment_intent_client_secret',
	);

	const [clientSecret, setClientSecret] = useState(
		paymentIntentClientSecret || '',
	);
	const [isLoading, setLoading] = useState(!paymentIntentClientSecret);
	const [guestInfo, setGuestInfo] = useState<GuestUser | null>(null);
	const [recaptchaToken, setRecaptchaToken] = useState<string>('');

	const { showSnackbar } = useSnackbar();
	const { basket } = useBasket();
	const { isAuthenticated } = useAuth();
	const theme = useTheme();
	const { booking } = useBookingManager();

	const [isFreeBooking, setIsFreeBooking] = useState(false);

	useEffect(() => {
		// Only redirect if:
		// 1. Basket is empty
		// 2. We're NOT returning from a payment (no client secret)
		// 3. We're NOT returning from a free booking (no success param check here as it was for complete page)
		const isReturningFromStripe = !!paymentIntentClientSecret;

		if (basket.length === 0 && !isReturningFromStripe) {
			router.push('/book');
		}
	}, [basket.length, paymentIntentClientSecret, router]);

	useEffect(() => {
		if (paymentIntentClientSecret) return;

		const getClientSecret = async () => {
			if (basket.length === 0) {
				setLoading(false);
				return;
			}

			if (!isAuthenticated && !guestInfo) {
				setLoading(false);
				return;
			}

			setLoading(true);
			try {
				const { clientSecret, amount } = await createPaymentIntent(basket);

				if (clientSecret === null && amount === 0) {
					setIsFreeBooking(true);
					setClientSecret('');
				} else {
					setClientSecret(clientSecret);
				}
			} catch (error: any) {
				console.error('Error fetching client secret:', error);
			} finally {
				setLoading(false);
			}
		};
		getClientSecret();
	}, [basket, isAuthenticated, guestInfo, paymentIntentClientSecret]);

	const appearance: Appearance = {
		theme: 'stripe',
		variables: {
			colorPrimary: theme.palette.primary.main,
			colorText: theme.palette.text.primary,
		},
	};

	const handleSubmitGuest = async (
		guest: GuestUser,
		recaptchaToken: string,
	) => {
		try {
			const response = await createGuestPaymentIntent(
				basket,
				guest,
				recaptchaToken,
			);
			if (response.clientSecret === null && response.amount === 0) {
				setIsFreeBooking(true);
				setClientSecret('');
			} else {
				setClientSecret(response.clientSecret);
			}
			setGuestInfo(guest);
			setRecaptchaToken(recaptchaToken);
		} catch (error: any) {
			if (error.response?.data?.error === 'RECAPTCHA_FAILED') {
				setGuestInfo(null);
				showSnackbar('reCAPTCHA verification failed. Please try again.');
			}
			console.error(error);
		}
	};

	const loader = 'auto';

	const renderContent = () => {
		if (isLoading) {
			return <CheckoutSkeleton />;
		}

		if (!isAuthenticated && !guestInfo && !paymentIntentClientSecret) {
			return <GuestInfo onSubmit={handleSubmitGuest} />;
		}

		if (isFreeBooking) {
			return (
				<CheckoutForm
					guest={guestInfo}
					recaptchaToken={recaptchaToken}
					isFree={true}
				/>
			);
		}

		if (!clientSecret) {
			return <CheckoutSkeleton />;
		}

		return (
			<Elements options={{ clientSecret, appearance, loader }} stripe={stripe}>
				<CheckoutForm guest={guestInfo} recaptchaToken={recaptchaToken} />
			</Elements>
		);
	};

	return (
		<Box
			sx={{
				minHeight: '100vh',
				bgcolor: 'grey.50',
				pt: { xs: 4, md: 8 },
				pb: { xs: 8, md: 12 },
			}}
		>
			<Container maxWidth="lg">
				<SectionHeader
					title="Review & Pay"
					subtitle="CHECKOUT"
					description="Review your booking details and securely complete your payment."
				/>
				<AnimateIn>
					<Box maxWidth="lg" sx={{ mx: 'auto' }}>
						{renderContent()}
					</Box>
				</AnimateIn>
			</Container>
		</Box>
	);
};

export default Checkout;
