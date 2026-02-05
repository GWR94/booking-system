import { Box, Container, useTheme } from '@mui/material';
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
	CheckoutSkeleton,
} from './components';
import { useBasket, useAuth, useBookingManager } from '@hooks';
import { useSnackbar } from '@context';
import { LoadingSpinner, SectionHeader, AnimateIn } from '@ui';
import { useNavigate } from 'react-router-dom';

const stripe = loadStripe(
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
);

const Checkout = () => {
	const navigate = useNavigate();
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
	const theme = useTheme();
	const { booking } = useBookingManager();

	const [isFreeBooking, setIsFreeBooking] = useState(false);

	useEffect(() => {
		// Only redirect if:
		// 1. Basket is empty
		// 2. We're NOT on the /complete page
		// 3. We're NOT returning from a payment (no client secret)
		// 4. We don't have a fresh booking already (free flow return)
		const isReturningFromStripe = !!paymentIntentClientSecret;
		const isOnCompletePage = location.pathname.includes('/complete');
		const hasJustFinishedFreeBooking = queryParams.get('success') === 'true';

		if (
			basket.length === 0 &&
			!isOnCompletePage &&
			!isReturningFromStripe &&
			!hasJustFinishedFreeBooking
		) {
			navigate('/book');
		}
	}, [
		basket.length,
		location.pathname,
		paymentIntentClientSecret,
		navigate,
		queryParams,
	]);

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
		);
	};

	// Don't show header on success page, let CompleteBooking handle it
	const isCompletePage = location.pathname.includes('/complete');

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
				{!isCompletePage && (
					<SectionHeader
						title="Review & Pay"
						subtitle="CHECKOUT"
						description="Review your booking details and securely complete your payment."
					/>
				)}
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
