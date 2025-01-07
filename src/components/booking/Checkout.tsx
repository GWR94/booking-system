import { useSlots } from '../../context/SlotContext';
import { Paper, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CheckoutItem from './CheckoutItem';
import { useEffect, useState } from 'react';
import CheckoutForm from './CheckoutForm';
import { CheckoutProvider, useCheckout } from '@stripe/react-stripe-js';
import axios from '../../utils/axiosConfig';
import { loadStripe } from '@stripe/stripe-js';
import { useAuth } from '../../context/AuthContext';

const stripe = loadStripe(
	process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY as string,
	{
		betas: ['custom_checkout_beta_5'],
	},
);
const Checkout = () => {
	const { basket } = useSlots();
	const [paymentRequested, setPaymentRequested] = useState(false);
	const [clientSecret, setClientSecret] = useState('');

	useEffect(() => {
		const getClientSecret = async () => {
			const response = await axios.post(
				'/api/booking/create-checkout-session',
				{
					basket,
				},
			);
			const { clientSecret }: { clientSecret: string } = response.data;
			setClientSecret(clientSecret);
		};
		getClientSecret();
		// FIXME - get user email if one doesn't exist
	}, []);

	const navigate = useNavigate();

	return (
		<CheckoutProvider stripe={stripe} options={{ clientSecret }}>
			<Paper elevation={3} sx={{ p: 3, my: 3, maxWidth: 400, mx: 'auto' }}>
				{paymentRequested ? (
					<CheckoutForm />
				) : (
					<>
						<Typography variant="h6" gutterBottom>
							Checkout Summary
						</Typography>
						{basket.length > 0 ? (
							basket.map((slot, i) => (
								<CheckoutItem
									key={i}
									slot={slot}
									proceedToPayment={() => setPaymentRequested(true)}
								/>
							))
						) : (
							<Box>
								<Typography variant="body1" gutterBottom>
									Nothing here!
								</Typography>
								<Button
									variant="contained"
									color="primary"
									fullWidth
									onClick={() => navigate('/book')}
								>
									Find a Slot
								</Button>
							</Box>
						)}
					</>
				)}
			</Paper>
		</CheckoutProvider>
	);
};

export default Checkout;
