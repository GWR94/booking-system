'use client';

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
	Card,
	CardContent,
	Divider,
	Stack,
} from '@mui/material';
import { Lock } from '@mui/icons-material';
import dayjs from 'dayjs';
import { StripePaymentElementOptions } from '@stripe/stripe-js';
import { useSnackbar } from '@context';
import CheckoutItem from './CheckoutItem';
import TestPaymentNotice from './TestPaymentNotice';
import { GuestUser } from './types';
import { useBasket, useAuth, useBookingManager } from '@hooks';
import { useRouter } from 'next/navigation';
import { confirmFreeBooking } from '@api';
import { Booking } from '@features/booking/components';
import MembershipUsageSummary from './MembershipUsageSummary';

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
	const { setBooking } = useBookingManager();
	const { basket, basketPrice, clearBasket } = useBasket();
	const router = useRouter();

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

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();

		const slotIds = basket.flatMap((slot) => slot.slotIds);

		if (isFree) {
			setLoading(true);
			setMessage('');
			try {
				const response = await confirmFreeBooking(slotIds, guest ?? undefined);

				if (response.booking) {
					setBooking(response.booking);
				}

				clearBasket();
				router.push('/checkout/complete?success=true');
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
				return_url: `${process.env.NEXT_PUBLIC_APP_URL ?? ''}/checkout/complete`,
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
			<Grid container spacing={4}>
				<Grid size={{ xs: 12, md: 8 }}>
					{isAuthenticated &&
						user?.membershipTier === 'PAR' &&
						basket.some((slot) => {
							const day = dayjs(slot.startTime).day();
							return day === 0 || day === 6;
						}) && (
							<Alert severity="warning" sx={{ mb: 3 }}>
								Note: Weekend slots are excluded from Par membership included
								hours. Your 10% discount has still been applied.
							</Alert>
						)}

					<Stack spacing={2} sx={{ mb: 4 }}>
						{basket.map((slot) => (
							<CheckoutItem slot={slot} key={slot.id} />
						))}
					</Stack>

					<Card
						variant="outlined"
						sx={{ borderRadius: 2, bgcolor: 'background.paper', mb: 4 }}
					>
						<CardContent sx={{ p: 3 }}>
							<Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
								Payment Details
							</Typography>

							<form id="payment-form" onSubmit={handleSubmit}>
								{!isFree && (
									<>
										<TestPaymentNotice />
										<Box sx={{ mb: 3 }}>
											<PaymentElement
												id="payment-element"
												options={paymentElementOptions}
											/>
										</Box>
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
									sx={{
										mt: 1,
										height: '56px',
										fontSize: '1.1rem',
									}}
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
											<CircularProgress sx={{ color: 'white' }} size={24} />
										</Box>
									) : (
										`Pay £${parseFloat(basketPrice).toFixed(2)}`
									)}
								</Button>

								<Stack
									direction="row"
									alignItems="center"
									justifyContent="center"
									spacing={1}
									sx={{ mt: 2, color: 'text.secondary' }}
								>
									<Lock fontSize="small" sx={{ fontSize: 16 }} />
									<Typography variant="caption" align="center">
										Payments are secure and encrypted
									</Typography>
								</Stack>

								{message && (
									<Typography
										id="payment-message"
										color="error"
										sx={{ mt: 2, textAlign: 'center' }}
									>
										{message}
									</Typography>
								)}
							</form>
						</CardContent>
					</Card>
				</Grid>

				<Grid size={{ xs: 12, md: 4 }}>
					<Box sx={{ position: 'sticky', top: 24 }}>
						{includedHours > 0 && (
							<Box sx={{ mb: 3 }}>
								<MembershipUsageSummary
									remainingAfter={remainingAfter}
									usedHours={usedHours}
									includedHours={includedHours}
									hoursToDeduct={hoursToDeduct}
								/>
							</Box>
						)}

						<Card
							variant="outlined"
							sx={{
								borderRadius: 2,
								bgcolor: 'background.paper',
								boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
								border: '1px solid',
								borderColor: 'divider',
							}}
						>
							<CardContent sx={{ p: 2.5 }}>
								<Typography variant="h6" gutterBottom sx={{ mb: 2 }}>
									Order Summary
								</Typography>
								<Stack spacing={1.5}>
									<Box display="flex" justifyContent="space-between">
										<Typography variant="body2" color="text.secondary">
											Subtotal
										</Typography>
										<Typography variant="body2" fontWeight="500">
											£{(parseFloat(basketPrice) - parseFloat(VAT)).toFixed(2)}
										</Typography>
									</Box>
									<Box display="flex" justifyContent="space-between">
										<Typography variant="body2" color="text.secondary">
											VAT (20%)
										</Typography>
										<Typography variant="body2" fontWeight="500">
											£{VAT}
										</Typography>
									</Box>
									<Divider sx={{ my: 1 }} />
									<Box
										display="flex"
										justifyContent="space-between"
										alignItems="center"
									>
										<Typography variant="subtitle1" fontWeight="bold">
											Total
										</Typography>
										<Typography
											variant="h5"
											color="primary.main"
											fontWeight="800"
										>
											£{parseFloat(basketPrice).toFixed(2)}
										</Typography>
									</Box>
								</Stack>
							</CardContent>
						</Card>
					</Box>
				</Grid>
			</Grid>
		</Box>
	);
};

export default CheckoutForm;
