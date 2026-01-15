import { ReactElement, useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import {
	Box,
	Typography,
	CircularProgress,
	Divider,
	Button,
	Grid2 as Grid,
	Container,
	Stack,
} from '@mui/material';
import {
	CheckCircle as CheckCircleIcon,
	Error as ErrorIcon,
	Info as InfoIcon,
	Warning as WarningIcon,
	Done as DoneIcon,
	Print as PrintIcon,
} from '@mui/icons-material';
import CheckoutItem from './CheckoutItem';
import { useBasket, useBookingManager } from '@hooks';
import { getBookingByPaymentIntent } from '@api';
import dayjs from 'dayjs';
import { useSnackbar } from '@context';
import { GroupedSlot } from '@components/booking';

interface StatusContent {
	text: string;
	iconColor: string;
	icon: ReactElement;
}

const STATUS_CONTENT_MAP: Record<PaymentIntent.Status, StatusContent> = {
	succeeded: {
		text: 'Booking Confirmed',
		iconColor: '#30B130',
		icon: <DoneIcon />,
	},
	processing: {
		text: 'Your payment is processing.',
		iconColor: '#6D6E78',
		icon: <InfoIcon />,
	},
	requires_payment_method: {
		text: 'Your payment was not successful, please try again.',
		iconColor: '#ff8040',
		icon: <WarningIcon />,
	},
	canceled: {
		text: 'Payment was cancelled.',
		iconColor: '#6D6E78',
		icon: <ErrorIcon />,
	},
	requires_action: {
		text: 'Your payment requires additional action.',
		iconColor: '#6D6E78',
		icon: <WarningIcon />,
	},
	requires_capture: {
		text: 'Your payment requires capture.',
		iconColor: '#6D6E78',
		icon: <InfoIcon />,
	},
	requires_confirmation: {
		text: 'Your payment requires confirmation.',
		iconColor: '#6D6E78',
		icon: <WarningIcon />,
	},
};

const CompletePage = () => {
	const stripe = useStripe();
	const { clearBasket } = useBasket();
	const { booking, setBooking } = useBookingManager();
	const { showSnackbar } = useSnackbar();

	const [status, setStatus] = useState<PaymentIntent.Status>('processing');
	const [intentId, setIntentId] = useState('');
	const [isLoading, setLoading] = useState(true);
	const [items, setItems] = useState<GroupedSlot[]>([]);
	const [itemsCost, setItemsCost] = useState('');
	const [paymentMethod, setPaymentMethod] = useState('Card Payment');

	useEffect(() => {
		const fetchPaymentIntent = async () => {
			if (!stripe) return;

			const clientSecret = new URLSearchParams(window.location.search).get(
				'payment_intent_client_secret',
			);

			if (!clientSecret) return;

			const { paymentIntent } = await stripe.retrievePaymentIntent(
				clientSecret,
			);

			if (!paymentIntent) return;

			setStatus(paymentIntent.status);
			setIntentId(paymentIntent.id);
			setItemsCost((paymentIntent.amount / 100).toFixed(2));

			// Get payment method details from payment intent
			let methodName = 'Card Payment';

			// Check payment_method_types array
			if (
				paymentIntent.payment_method_types &&
				paymentIntent.payment_method_types.length > 0
			) {
				const type = paymentIntent.payment_method_types[0];
				switch (type) {
					case 'card':
						methodName = 'Card Payment';
						break;
					case 'klarna':
						methodName = 'Klarna';
						break;
					case 'paypal':
						methodName = 'PayPal';
						break;
					case 'afterpay_clearpay':
						methodName = 'Afterpay / Clearpay';
						break;
					case 'alipay':
						methodName = 'Alipay';
						break;
					case 'apple_pay':
						methodName = 'Apple Pay';
						break;
					case 'google_pay':
						methodName = 'Google Pay';
						break;
					case 'link':
						methodName = 'Link';
						break;
					case 'cashapp':
						methodName = 'Cash App Pay';
						break;
					default:
						methodName = type
							.split('_')
							.map(
								(word: string) => word.charAt(0).toUpperCase() + word.slice(1),
							)
							.join(' ');
				}
			}

			setPaymentMethod(methodName);

			const fetchBookingWithRetry = async (
				retryCount = 0,
				maxRetries = 5,
			): Promise<void> => {
				try {
					const data = await getBookingByPaymentIntent(paymentIntent.id);
					if (data.booking && data.groupedSlots) {
						setBooking(data.booking);
						const grouped = data.groupedSlots.map((slot: any) => ({
							id: slot.slotIds[0],
							startTime: dayjs(slot.startTimeISO),
							endTime: dayjs(slot.endTimeISO),
							bayId: slot.bayId,
							slotIds: slot.slotIds,
						}));
						setItems(grouped);
						setLoading(false);
						clearBasket();
					} else {
						throw new Error('Incomplete booking data');
					}
				} catch (error) {
					console.error(
						`Error fetching booking (attempt ${retryCount + 1}/${maxRetries}):`,
						error,
					);
					if (retryCount < maxRetries) {
						// Wait 2 seconds before retrying
						await new Promise((resolve) => setTimeout(resolve, 2000));
						return fetchBookingWithRetry(retryCount + 1, maxRetries);
					} else {
						console.error('Failed to fetch booking after multiple attempts');
						showSnackbar('Unable to fetch booking. Please refresh the page.');
						setLoading(false);
					}
				}
			};

			await fetchBookingWithRetry();
		};
		fetchPaymentIntent();
	}, [stripe]);

	const subtotal = parseFloat(itemsCost) / 1.2;
	const vat = parseFloat(itemsCost) - subtotal;

	return isLoading ? (
		<Box display="flex" justifyContent="center" p={4}>
			<CircularProgress />
		</Box>
	) : (
		<Container>
			<Box display="flex" flexDirection="column" alignItems="center" gap={3}>
				<Box
					sx={{
						backgroundColor: STATUS_CONTENT_MAP[status].iconColor,
						borderRadius: '50%',
						p: 2,
						display: 'flex',
						justifyContent: 'center',
					}}
					maxWidth="sm"
				>
					{status === 'succeeded' ? (
						<CheckCircleIcon sx={{ fontSize: 48, color: 'white' }} />
					) : (
						<ErrorIcon sx={{ fontSize: 48, color: 'white' }} />
					)}
				</Box>

				<Typography variant="h4" gutterBottom>
					{STATUS_CONTENT_MAP[status].text}
				</Typography>

				<Grid container spacing={3} sx={{ width: '100%' }}>
					{/* Payment Details */}
					{intentId && (
						<Grid size={{ xs: 12, md: 6 }}>
							<Box
								sx={{
									p: 3,
									border: '1px solid #e0e0e0',
									borderRadius: 2,
									height: '100%',
								}}
							>
								<Typography variant="h6" gutterBottom>
									Payment Summary
								</Typography>
								<Stack spacing={2}>
									<Stack direction="row" justifyContent="space-between">
										<Typography color="text.secondary">
											Payment Status
										</Typography>
										<Typography
											sx={{
												textTransform: 'capitalize',
												fontWeight: 'medium',
												color:
													status === 'succeeded'
														? 'success.main'
														: 'text.primary',
											}}
										>
											{status}
										</Typography>
									</Stack>

									<Stack direction="row" justifyContent="space-between">
										<Typography color="text.secondary">
											Payment Method
										</Typography>
										<Typography sx={{ fontWeight: 'medium' }}>
											{paymentMethod}
										</Typography>
									</Stack>

									<Stack direction="row" justifyContent="space-between">
										<Typography color="text.secondary">
											Transaction Date
										</Typography>
										<Typography sx={{ fontWeight: 'medium' }}>
											{dayjs().format('DD MMM YYYY')}
										</Typography>
									</Stack>

									<Divider />

									<Stack direction="row" justifyContent="space-between">
										<Typography color="text.secondary">Subtotal</Typography>
										<Typography>£{subtotal.toFixed(2)}</Typography>
									</Stack>

									<Stack direction="row" justifyContent="space-between">
										<Typography color="text.secondary">VAT (20%)</Typography>
										<Typography>£{vat.toFixed(2)}</Typography>
									</Stack>

									<Divider />

									<Stack direction="row" justifyContent="space-between">
										<Typography variant="h6">Total</Typography>
										<Typography variant="h6" sx={{ fontWeight: 'bold' }}>
											£{itemsCost}
										</Typography>
									</Stack>

									<Box
										sx={{
											mt: 1,
											p: 1,
											bgcolor: 'action.hover',
											borderRadius: 1,
										}}
									>
										<Typography variant="caption" color="text.secondary">
											Transaction ID: {intentId.slice(-12).toUpperCase()}
										</Typography>
									</Box>
								</Stack>
							</Box>
						</Grid>
					)}

					{/* Booking Information */}
					{booking && (
						<Grid size={{ xs: 12, md: 6 }}>
							<Box
								sx={{
									p: 3,
									border: '1px solid #e0e0e0',
									borderRadius: 2,
									height: '100%',
									display: 'flex',
									flexDirection: 'column',
								}}
							>
								<Typography variant="h6" gutterBottom>
									Booking Details
								</Typography>
								<Stack
									spacing={2}
									sx={{ flex: 1, justifyContent: 'space-between' }}
								>
									<Box>
										<Stack spacing={2}>
											<Stack direction="row" justifyContent="space-between">
												<Typography color="text.secondary">
													Booking Reference
												</Typography>
												<Typography sx={{ fontWeight: 'medium' }}>
													#{booking.id}
												</Typography>
											</Stack>

											<Stack direction="row" justifyContent="space-between">
												<Typography color="text.secondary">Status</Typography>
												<Typography
													sx={{
														textTransform: 'capitalize',
														fontWeight: 'medium',
													}}
												>
													{booking.status}
												</Typography>
											</Stack>

											<Stack direction="row" justifyContent="space-between">
												<Typography color="text.secondary">Date</Typography>
												<Typography sx={{ fontWeight: 'medium' }}>
													{dayjs(booking.bookingTime).format('DD MMM YYYY')}
												</Typography>
											</Stack>

											{booking.user && (
												<>
													<Divider />
													<Stack direction="row" justifyContent="space-between">
														<Typography color="text.secondary">Name</Typography>
														<Typography sx={{ fontWeight: 'medium' }}>
															{booking.user.name}
														</Typography>
													</Stack>
													<Stack direction="row" justifyContent="space-between">
														<Typography color="text.secondary">
															Email
														</Typography>
														<Typography sx={{ fontWeight: 'medium' }}>
															{booking.user.email}
														</Typography>
													</Stack>
												</>
											)}
										</Stack>
									</Box>

									{booking.user && (
										<Box
											sx={{
												p: 1.5,
												bgcolor: 'action.hover',
												borderRadius: 1,
												display: 'flex',
												gap: 1,
												alignItems: 'start',
											}}
										>
											<InfoIcon
												fontSize="small"
												color="action"
												sx={{ mt: 0.2 }}
											/>
											<Typography variant="caption" color="text.secondary">
												A confirmation email has been sent to{' '}
												{booking.user.email}
											</Typography>
										</Box>
									)}
								</Stack>
							</Box>
						</Grid>
					)}
				</Grid>

				{/* Action Buttons */}
				<Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
					<Button
						variant="outlined"
						startIcon={<PrintIcon />}
						onClick={() => window.print()}
					>
						Print Receipt
					</Button>
					<Button
						variant="contained"
						onClick={() => (window.location.href = '/')}
					>
						Book Another
					</Button>
				</Box>

				<Divider sx={{ width: '100%', my: 4 }} />

				{/* Booked Slots */}
				{items && (
					<Box sx={{ width: '100%' }}>
						<Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
							Your Sessions
						</Typography>
						<Grid container spacing={2}>
							{items.map((item, index) => (
								<Grid size={{ xs: 12 }} key={index}>
									<CheckoutItem slot={item} isCompleted />
								</Grid>
							))}
						</Grid>
					</Box>
				)}
			</Box>
		</Container>
	);
};

export default CompletePage;
