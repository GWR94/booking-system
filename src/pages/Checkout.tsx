import { Box } from '@mui/material';
import { Route, Routes, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { createGuestPaymentIntent, createPaymentIntent } from '@api';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import {
	CompleteBooking,
	CheckoutForm,
	GuestUser,
	GuestInfo,
} from '@components/checkout';
import { useBasket, useAuth } from '@hooks';
import { useSnackbar } from '@context';
import { LoadingSpinner } from '@common';

const stripe = loadStripe(
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
);

const Checkout = () => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const paymentIntentClientSecret = queryParams.get(
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

	const [isFreeBooking, setIsFreeBooking] = useState(false);

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

	if (!isAuthenticated && !guestInfo && !paymentIntentClientSecret) {
		return (
			<Box maxWidth="md" sx={{ p: 3, my: 3, mx: 'auto' }}>
				<GuestInfo onSubmit={handleSubmitGuest} />
			</Box>
		);
	}

	if (isLoading) return <LoadingSpinner />;

	if (isFreeBooking) {
		return (
			<Box maxWidth="lg" sx={{ p: 3, my: 3, mx: 'auto' }}>
				<CheckoutForm
					guest={guestInfo}
					recaptchaToken={recaptchaToken}
					isFree={true}
				/>
			</Box>
		);
	}

	if (!clientSecret) return <LoadingSpinner />;

	return (
		<Box maxWidth="lg" sx={{ p: 3, my: 3, mx: 'auto' }}>
			<Elements options={{ clientSecret, appearance, loader }} stripe={stripe}>
				<Routes>
					<Route
						path="/"
						element={
							<CheckoutForm guest={guestInfo} recaptchaToken={recaptchaToken} />
						}
					/>
					<Route path="/complete" element={<CompleteBooking />} />
				</Routes>
			</Elements>
		</Box>
	);
};

export default Checkout;
