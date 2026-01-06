import { Box, CircularProgress } from '@mui/material';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CheckoutForm from '@components/checkout/CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import axios from '@utils/axiosConfig';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import CompleteBooking from '@components/checkout/CompleteBooking';
import { useBasket, useAuth } from '@hooks';
import GuestInfo, { GuestUser } from '../components/checkout/GuestInfo';
import { useSnackbar } from '@context';

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
	const [guest, setGuest] = useState<GuestUser | null>(null);
	const [recaptchaToken, setRecaptchaToken] = useState<string>('');

	const { showSnackbar } = useSnackbar();
	// const navigate = useNavigate();
	const { basket } = useBasket();
	const { isAuthenticated } = useAuth();

	useEffect(() => {
		if (paymentIntentClientSecret) return;

		const getClientSecret = async () => {
			// Only proceed if there are items in the basket
			if (basket.length === 0) {
				setLoading(false);
				// showSnackbar('Add an item to the basket to checkout');
				// navigate('/');
				return;
			}

			// If not authenticated, ensure guest info is available before fetching client secret
			if (!isAuthenticated && !guest) {
				setLoading(false);

				return;
			}

			setLoading(true);
			try {
				const response = await axios.post(
					`/api/bookings/create-payment-intent`,
					{
						items: basket,
					},
				);
				const { clientSecret }: { clientSecret: string } = response.data;
				setClientSecret(clientSecret);
			} catch (error: any) {
				console.error('Error fetching client secret:', error);
			} finally {
				setLoading(false);
			}
		};
		getClientSecret();
	}, [basket, isAuthenticated, guest, paymentIntentClientSecret]);

	const appearance: Appearance = {
		theme: 'stripe',
	};

	const loader = 'auto';

	if (!isAuthenticated && !guest && !paymentIntentClientSecret) {
		return (
			<Box maxWidth="md" sx={{ p: 3, my: 3, mx: 'auto' }}>
				<GuestInfo
					onSubmit={async (guest: GuestUser, recaptchaToken: string) => {
						try {
							const response = await axios.post(
								'api/bookings/guest/create-payment-intent',
								{
									items: basket,
									guestInfo: guest,
									recaptchaToken,
								},
							);
							setClientSecret(response.data.clientSecret);
							setGuest(guest);
							setRecaptchaToken(recaptchaToken);
						} catch (error: any) {
							if (error.response?.data?.error === 'RECAPTCHA_FAILED') {
								setGuest(null);
								showSnackbar(
									'reCAPTCHA verification failed. Please try again.',
								);
							}
							console.error(error);
						}
					}}
				/>
			</Box>
		);
	}

	if (isLoading || !clientSecret) {
		return (
			<Box
				maxWidth="md"
				sx={{
					p: 3,
					my: 3,
					mx: 'auto',
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: '200px',
				}}
			>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box maxWidth="lg" sx={{ p: 3, my: 3, mx: 'auto' }}>
			<Elements options={{ clientSecret, appearance, loader }} stripe={stripe}>
				<Routes>
					<Route
						path="/"
						element={
							<CheckoutForm guest={guest} recaptchaToken={recaptchaToken} />
						}
					/>
					<Route path="/complete" element={<CompleteBooking />} />
				</Routes>
			</Elements>
		</Box>
	);
};

export default Checkout;
