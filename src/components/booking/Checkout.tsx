import { Box, CircularProgress } from '@mui/material';
import { Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import axios from '../../utils/axiosConfig';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import CompleteBooking from './CompleteBooking';
import { useBasket } from '../../hooks/useBasket';

const stripe = loadStripe(
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
);

const Checkout = () => {
	const { basket } = useBasket();
	const [clientSecret, setClientSecret] = useState('');
	const [isLoading, setLoading] = useState(true);

	useEffect(() => {
		const getClientSecret = async () => {
			if (basket.length === 0) return setLoading(false);
			setLoading(true);
			const response = await axios.post('/api/bookings/create-payment-intent', {
				items: basket,
			});
			const { clientSecret }: { clientSecret: string } = response.data;
			setClientSecret(clientSecret);
			setLoading(false);
		};
		getClientSecret();
	}, [basket]);

	const appearance: Appearance = {
		theme: 'stripe',
	};
	// Enable the skeleton loader UI for optimal loading.
	const loader = 'auto';

	return (
		<Box maxWidth="md" sx={{ p: 3, my: 3, mx: 'auto' }}>
			{isLoading ? (
				<CircularProgress />
			) : (
				<>
					{clientSecret && (
						<Elements
							options={{ clientSecret, appearance, loader }}
							stripe={stripe}
						>
							<Routes>
								<Route path="/" element={<CheckoutForm />} />
								<Route path="/complete" element={<CompleteBooking />} />
							</Routes>
						</Elements>
					)}
				</>
			)}
		</Box>
	);
};

export default Checkout;
