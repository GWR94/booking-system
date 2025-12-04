import {
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import React, { useEffect, useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { useSnackbar } from '../../context/SnackbarContext';
import CheckoutItem from './CheckoutItem';
import { useBasket } from '../../hooks/useBasket';
import { useAuth } from '../../hooks/useAuth';
import { GuestUser } from './GuestInfo';
import { useNavigate } from 'react-router-dom';

interface CheckoutFormProps {
	guest: GuestUser | null;
	recaptchaToken?: string;
}

const CheckoutForm = ({ guest, recaptchaToken }: CheckoutFormProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const { user, isAuthenticated } = useAuth();
	const { showSnackbar } = useSnackbar();
	const { basket, basketPrice } = useBasket();
	const navigate = useNavigate();

	const [message, setMessage] = useState('');
	const [isLoading, setLoading] = useState(false);

	useEffect(() => {
		if (basket.length === 0) {
			setLoading(false);
			showSnackbar('Add an item to the basket to checkout', 'info');
			navigate('/basket');
			return;
		}
	}, [basket]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) return;
		setLoading(true);
		setMessage('');

		// Validate reCAPTCHA for guest users
		if (!isAuthenticated && !recaptchaToken) {
			setMessage('Please complete the reCAPTCHA.');
			setLoading(false);
			return;
		}

		// Validate guest info if not authenticated
		if (!isAuthenticated && (!guest?.name || !guest?.email)) {
			setMessage('Please provide your name and email for guest checkout.');
			setLoading(false);
			return;
		}

		// const bookingCreated = isAuthenticated
		// 	? await createBooking()
		// 	: await createGuestBooking();

		// if (!bookingCreated) {
		// 	return setLoading(false);
		// }

		const { error } = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${import.meta.env.VITE_FRONT_END}/checkout/complete`,
			},
		});
		if (error.type === 'card_error' || error.type === 'validation_error') {
			setMessage(error.message as string);
		} else {
			setMessage('An unexpected error occurred.');
		}

		setLoading(false);
	};

	const paymentElementOptions: StripePaymentElementOptions = {
		layout: 'accordion',
		defaultValues: {
			billingDetails: {
				name: isAuthenticated ? (user?.name as string) : guest?.name,
				email: isAuthenticated ? (user?.email as string) : guest?.email,
			},
		},
	};

	const TAX_RATE = 0.2;
	const VAT = (parseFloat(basketPrice) * TAX_RATE).toFixed(2);

	return (
		<Box>
			<Typography
				variant="h4"
				fontWeight="400"
				sx={{ mb: 2, borderBottom: '1px solid #1976D2' }}
			>
				Checkout
			</Typography>
			<Typography
				variant="subtitle2"
				fontWeight="300"
				textAlign="justify"
				sx={{ mb: 2 }}
			>
				Please check that all of the below details are correct, and continue
				with payment.
			</Typography>
			{basket.map((slot) => (
				<CheckoutItem slot={slot} key={slot.id} />
			))}
			<Typography
				variant="subtitle2"
				fontWeight="300"
				textAlign="justify"
				gutterBottom
			>
				If you have any promotional codes or vouchers, please input them below
				before completing payment.
			</Typography>
			<Grid container alignItems="center" sx={{ my: 2 }}>
				<Grid size={{ xs: 12, sm: 6 }} />
				<Grid size={{ xs: 12, sm: 6 }}>
					<Grid container spacing={1} alignItems="center">
						<Grid size={{ xs: 6 }}>
							<Typography variant="body1" fontWeight="bold" textAlign="right">
								Subtotal:
							</Typography>
						</Grid>
						<Grid size={{ xs: 6 }}>
							<Typography variant="body1" textAlign="right">
								£{(parseFloat(basketPrice) - parseFloat(VAT)).toFixed(2)}
							</Typography>
						</Grid>
						<Grid size={{ xs: 6 }}>
							<Typography variant="body1" fontWeight="bold" textAlign="right">
								VAT:
							</Typography>
						</Grid>
						<Grid size={{ xs: 6 }}>
							<Typography variant="body1" textAlign="right">
								£{VAT}
							</Typography>
						</Grid>
						<Grid size={{ xs: 6 }}>
							<Typography variant="h6" fontWeight="bold" textAlign="right">
								Total:
							</Typography>
						</Grid>
						<Grid size={{ xs: 6 }}>
							<Typography variant="h6" textAlign="right">
								£{parseFloat(basketPrice).toFixed(2)}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<form id="payment-form" onSubmit={handleSubmit}>
				<PaymentElement id="payment-element" options={paymentElementOptions} />
				<Button
					disabled={
						isLoading ||
						!stripe ||
						!elements ||
						(!isAuthenticated && !recaptchaToken)
					}
					fullWidth
					type="submit"
					variant="contained"
					color="primary"
					sx={{ mt: 1, height: '40px' }}
				>
					{isLoading ? (
						<Box
							sx={{
								m: 'auto',
								display: 'flex',
								justifyContent: 'center',
								alignItems: 'center',
							}}
						>
							<CircularProgress sx={{ color: 'white' }} size={20} />
						</Box>
					) : (
						`Pay £${parseInt(basketPrice).toFixed(2)} with Stripe`
					)}
				</Button>
				{message && (
					<Typography id="payment-message" color="error" sx={{ mt: 1 }}>
						{message}
					</Typography>
				)}
			</form>
		</Box>
	);
};

export default CheckoutForm;
