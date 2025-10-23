import {
	PaymentElement,
	useElements,
	useStripe,
} from '@stripe/react-stripe-js';
import React, { useState } from 'react';
import {
	Box,
	Button,
	CircularProgress,
	TextField,
	Grid2 as Grid,
	Typography,
} from '@mui/material';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { useSnackbar } from '../../context/SnackbarContext';
import CheckoutItem from './CheckoutItem';
import axios from '../../utils/axiosConfig';
import { AxiosError } from 'axios';
import { useBasket } from '../../hooks/useBasket';
import { useAuth } from '../../hooks/useAuth';
import { useBookingManager } from '../../hooks/useBookingManager';

const CheckoutForm: React.FC = () => {
	const stripe = useStripe();
	const elements = useElements();
	const { user } = useAuth();
	const { showSnackbar } = useSnackbar();
	const { basket, basketPrice } = useBasket();
	const { setBooking } = useBookingManager();

	const [message, setMessage] = useState('');
	const [isLoading, setLoading] = useState(false);
	const [discount, setDiscount] = useState(0);
	const [promoCode, setPromoCode] = useState('');

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		if (!stripe || !elements) return;
		setLoading(true);

		const bookingCreated = await createBooking();
		if (!bookingCreated) {
			return setLoading(false);
		}
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
			console.log(error?.message);
		}

		setLoading(false);
	};

	const createBooking = async (): Promise<boolean> => {
		if (!user) {
			showSnackbar('Please log in to continue', 'error');
			return false;
		}
		try {
			let slotIds = basket.map((slot) => slot.slotIds).flat();
			const {
				data: { booking },
			} = await axios.post('/api/bookings', {
				userId: user.id,
				slotIds,
			});

			setBooking(booking);
			return true;
		} catch (err) {
			showSnackbar(
				(err as AxiosError<{ message: string }>).response?.data.message ||
					'An error occurred while creating the booking',
				'error',
			);
			setBooking(null);
			console.log(err);
			return false;
		}
	};

	/**
	 * TODO
	 * [ ] Add check for un
	 *
	 * */

	const handlePromoCheck = () => {
		if (!promoCode) return;
		// FIXME - Change to server side or via stripe
		if (promoCode === '5OFF') {
			showSnackbar('Promo code applied successfully', 'success');
			return setDiscount(parseInt(basketPrice) * 0.05);
		}
		showSnackbar('Invalid promo code', 'error');
		setPromoCode('');
		setDiscount(0);
	};

	const paymentElementOptions: StripePaymentElementOptions = {
		layout: 'accordion',
		defaultValues: {
			billingDetails: {
				name: user?.name as string,
				email: user?.email as string,
			},
		},
	};

	const VAT = ((parseInt(basketPrice) - discount) * 0.2).toFixed(2);

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
				gutterBottom
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
				<Grid size={{ xs: 12, sm: 6 }}>
					<Grid container spacing={1}>
						<Grid>
							<TextField
								label="Promo Code / Voucher"
								fullWidth
								size="small"
								onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
							/>
						</Grid>
						<Grid>
							<Button
								variant="contained"
								disableElevation
								color="primary"
								sx={{ height: '100%' }}
								fullWidth
								onClick={handlePromoCheck}
							>
								Verify
							</Button>
						</Grid>
					</Grid>
				</Grid>
				<Grid size={{ xs: 12, sm: 6 }}>
					<Grid container spacing={1} alignItems="center">
						<Grid size={{ xs: 6 }}>
							<Typography variant="body1" fontWeight="bold" textAlign="right">
								Subtotal:
							</Typography>
						</Grid>
						<Grid size={{ xs: 6 }}>
							<Typography variant="body1" textAlign="right">
								£{(parseInt(basketPrice) - parseInt(VAT)).toFixed(2)}
							</Typography>
						</Grid>
						{discount > 0 && (
							<>
								<Grid size={{ xs: 6 }}>
									<Typography
										variant="body1"
										fontWeight="bold"
										textAlign="right"
										sx={{ color: 'red' }}
									>
										Discount:
									</Typography>
								</Grid>
								<Grid size={{ xs: 6 }}>
									<Typography
										variant="body1"
										textAlign="right"
										sx={{ color: 'red' }}
									>
										-£{discount.toFixed(2)}
									</Typography>
								</Grid>
							</>
						)}
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
								£{(parseInt(basketPrice) - discount).toFixed(2)}
							</Typography>
						</Grid>
					</Grid>
				</Grid>
			</Grid>
			<form id="payment-form" onSubmit={handleSubmit}>
				<PaymentElement id="payment-element" options={paymentElementOptions} />
				<Button
					disabled={isLoading || !stripe || !elements}
					fullWidth
					type="submit"
					variant="contained"
					color="primary"
					sx={{ mt: 1 }}
				>
					{isLoading ? (
						<CircularProgress size="small" />
					) : (
						`Pay £${basketPrice} with Stripe`
					)}
				</Button>
				{message && <Typography id="payment-message">{message}</Typography>}
			</form>
		</Box>
	);
};

export default CheckoutForm;
