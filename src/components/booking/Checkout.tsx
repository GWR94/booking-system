import { Typography, Button, Box } from '@mui/material';
import { Route, Routes, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';
import { Elements } from '@stripe/react-stripe-js';
import axios from '../../utils/axiosConfig';
import { Appearance, loadStripe } from '@stripe/stripe-js';
import CompleteBooking from './CompleteBooking';
import { ShoppingBasketOutlined } from '@mui/icons-material';
import { useBasket } from '../../context/BasketContext';

const stripe = loadStripe(
	import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as string,
);
const Checkout = () => {
	const { basket } = useBasket();
	const [clientSecret, setClientSecret] = useState('');

	useEffect(() => {
		const getClientSecret = async () => {
			if (basket.length === 0) return;
			const response = await axios.post('/api/bookings/create-payment-intent', {
				items: basket,
			});
			const { clientSecret }: { clientSecret: string } = response.data;
			setClientSecret(clientSecret);
		};
		getClientSecret();
	}, [basket]);

	const appearance: Appearance = {
		theme: 'stripe',
	};
	// Enable the skeleton loader UI for optimal loading.
	const loader = 'auto';

	console.log(clientSecret);

	return (
		<Box maxWidth="md" sx={{ p: 3, my: 3, mx: 'auto' }}>
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
		</Box>
	);
};

const EmptyBasket = () => {
	const navigate = useNavigate();
	return (
		<Box
			sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
		>
			<Typography variant="h6" align="center" gutterBottom>
				Your basket is empty.
			</Typography>
			<Typography variant="h6" align="center" gutterBottom>
				Please add items to proceed.
			</Typography>

			<ShoppingBasketOutlined sx={{ mb: 2 }} />
			<Button
				variant="contained"
				color="primary"
				onClick={() => navigate('/book')}
			>
				Go to Booking
			</Button>
		</Box>
	);
};

export default Checkout;
