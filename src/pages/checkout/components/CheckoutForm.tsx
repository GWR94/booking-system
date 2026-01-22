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
	Alert,
} from '@mui/material';
import dayjs from 'dayjs';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { useSnackbar } from '@context';
import CheckoutItem from './CheckoutItem';
import TestPaymentNotice from './TestPaymentNotice';
import { GuestUser } from './types';
import { useBasket, useAuth } from '@hooks';
import { useNavigate } from 'react-router-dom';
import { confirmFreeBooking } from '@api';
import { Booking } from '../../booking/components';

interface CheckoutFormProps {
	guest: GuestUser | null;
	recaptchaToken?: string;
	isFree?: boolean;
}

const CheckoutForm = ({
	guest,
	recaptchaToken,
	isFree = false,
}: CheckoutFormProps) => {
	const stripe = useStripe();
	const elements = useElements();
	const { user, isAuthenticated } = useAuth();
	const { showSnackbar } = useSnackbar();
	const { basket, basketPrice } = useBasket();
	const navigate = useNavigate();

	const [message, setMessage] = useState('');
	const [isLoading, setLoading] = useState(false);

	// Use membership usage from user object (backend source of truth)
	const membershipUsage = user?.membershipUsage;
	const remainingIncluded = membershipUsage?.remainingHours ?? 0;
	const includedHours = membershipUsage?.totalHours ?? 0;
	const usedHours = membershipUsage?.usedHours ?? 0;

	// Calculate hours currently in basket that are eligible for "Free" usage
	const basketEligibleHours = React.useMemo(() => {
		if (!user?.membershipTier) return 0;
		return basket.reduce((count, slot) => {
			const slotDate = dayjs(slot.startTime);
			const isWeekend = slotDate.day() === 0 || slotDate.day() === 6;
			// Par cannot use included hours on weekends
			if (user.membershipTier === 'PAR' && isWeekend) {
				return count;
			}
			return count + slot.slotIds.length;
		}, 0);
	}, [basket, user?.membershipTier]);

	// Actual hours deducted from allowance for this basket
	const hoursToDeduct = Math.min(remainingIncluded, basketEligibleHours);
	const remainingAfter = Math.max(0, remainingIncluded - hoursToDeduct);

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

		if (isFree) {
			setLoading(true);
			setMessage('');
			try {
				const slotIds = basket.map((b) => b.slotIds).flat();

				await confirmFreeBooking(slotIds, guest);

				// Redirect to completion
				window.location.href = `${
					import.meta.env.VITE_FRONT_END
				}/checkout/complete`;
			} catch (err) {
				console.error(err);
				setMessage('Failed to confirm free booking.');
			} finally {
				setLoading(false);
			}
			return;
		}

		if (!stripe || !elements) return;
		setLoading(true);
		setMessage('');

		const result = await stripe.confirmPayment({
			elements,
			confirmParams: {
				return_url: `${import.meta.env.VITE_FRONT_END}/checkout/complete`,
			},
		});

		if (result.error) {
			if (result.error.type === 'card_error') {
				setMessage(result.error.message as string);
			} else if (result.error.type !== 'validation_error') {
				setMessage('An unexpected error occurred.');
			}
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

			{isAuthenticated &&
				user?.membershipTier === 'PAR' &&
				basket.some((slot) => {
					const day = dayjs(slot.startTime).day();
					return day === 0 || day === 6;
				}) && (
					<Alert severity="warning" sx={{ mb: 2 }}>
						Note: Weekend slots are excluded from Par membership included hours.
						Your 10% discount has still been applied.
					</Alert>
				)}

			{basket.map((slot) => (
				<CheckoutItem slot={slot} key={slot.id} />
			))}

			{includedHours > 0 && (
				<Box
					sx={{
						my: 3,
						p: 2,
						bgcolor: 'background.paper',
						borderRadius: 1,
						border: '1px solid #e0e0e0',
					}}
				>
					<Typography variant="h6" gutterBottom>
						Membership Allowance
					</Typography>
					<Grid container spacing={2}>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Typography variant="caption" color="text.secondary">
								Included
							</Typography>
							<Typography variant="body1" fontWeight="bold">
								{includedHours} hrs
							</Typography>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Typography variant="caption" color="text.secondary">
								Used
							</Typography>
							<Typography variant="body1">{usedHours} hrs</Typography>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Typography variant="caption" color="text.secondary">
								Using Now
							</Typography>
							<Typography
								variant="body1"
								color="primary.main"
								fontWeight="bold"
							>
								{hoursToDeduct > 0 ? `-${hoursToDeduct} hrs` : '0 hrs'}
							</Typography>
						</Grid>
						<Grid size={{ xs: 6, sm: 3 }}>
							<Typography variant="caption" color="text.secondary">
								Remaining
							</Typography>
							<Typography
								variant="body1"
								color={remainingAfter === 0 ? 'error.main' : 'success.main'}
							>
								{remainingAfter} hrs
							</Typography>
						</Grid>
					</Grid>
				</Box>
			)}

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
				{!isFree && (
					<>
						<TestPaymentNotice />
						<PaymentElement
							id="payment-element"
							options={paymentElementOptions}
						/>
					</>
				)}
				<Button
					disabled={
						isLoading ||
						(!isFree && (!stripe || !elements)) ||
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
						`Pay £${parseFloat(basketPrice).toFixed(2)} with Stripe`
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
