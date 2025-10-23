import { ReactElement, useEffect, useState } from 'react';
import { useStripe } from '@stripe/react-stripe-js';
import { PaymentIntent } from '@stripe/stripe-js';
import {
	Box,
	Typography,
	CircularProgress,
	Link,
	Divider,
	Button,
	Grid2 as Grid,
	Container,
} from '@mui/material';
import {
	CheckCircle,
	Error,
	OpenInNew,
	Info,
	Warning,
	Done,
} from '@mui/icons-material';
import CheckoutItem from './CheckoutItem';
import { GroupedSlot } from '../interfaces/SlotContext.i';
import { useBasket } from '../../hooks/useBasket';
import { useBookingManager } from '../../hooks/useBookingManager';

interface StatusContent {
	text: string;
	iconColor: string;
	icon: ReactElement;
}

const STATUS_CONTENT_MAP: Record<PaymentIntent.Status, StatusContent> = {
	succeeded: {
		text: 'Payment succeeded',
		iconColor: '#30B130',
		icon: <Done />,
	},
	processing: {
		text: 'Your payment is processing.',
		iconColor: '#6D6E78',
		icon: <Info />,
	},
	requires_payment_method: {
		text: 'Your payment was not successful, please try again.',
		iconColor: '#ff8040',
		icon: <Warning />,
	},
	canceled: {
		text: 'Payment was cancelled.',
		iconColor: '#6D6E78',
		icon: <Error />,
	},
	requires_action: {
		text: 'Your payment requires additional action.',
		iconColor: '#6D6E78',
		icon: <Warning />,
	},
	requires_capture: {
		text: 'Your payment requires capture.',
		iconColor: '#6D6E78',
		icon: <Info />,
	},
	requires_confirmation: {
		text: 'Your payment requires confirmation.',
		iconColor: '#6D6E78',
		icon: <Warning />,
	},
};

export default function CompletePage() {
	const stripe = useStripe();
	const { basket, basketPrice, clearBasket } = useBasket();
	const { booking } = useBookingManager();

	const [status, setStatus] = useState<PaymentIntent.Status>('processing');
	const [intentId, setIntentId] = useState('');
	const [isLoading, setLoading] = useState(true);
	const [items, setItems] = useState<GroupedSlot[]>([]);
	const [itemsCost, setItemsCost] = useState('');

	useEffect(() => {
		const fetchPaymentIntent = async () => {
			if (!stripe) return;

			const clientSecret = new URLSearchParams(window.location.search).get(
				'payment_intent_client_secret',
			);

			console.log(clientSecret);

			if (!clientSecret) return;

			const { paymentIntent } = await stripe.retrievePaymentIntent(
				clientSecret,
			);

			if (!paymentIntent) return;

			setItems(basket);
			setStatus(paymentIntent.status);
			setIntentId(paymentIntent.id);
			setItemsCost(basketPrice);
			clearBasket();
			setLoading(false);
		};
		fetchPaymentIntent();
	}, [stripe]);

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
						<CheckCircle sx={{ fontSize: 48, color: 'white' }} />
					) : (
						<Error sx={{ fontSize: 48, color: 'white' }} />
					)}
				</Box>

				<Typography variant="h4" gutterBottom>
					{STATUS_CONTENT_MAP[status].text}
				</Typography>

				{/* Payment Details */}
				{intentId && (
					<Box sx={{ width: '100%' }}>
						<Grid container spacing={{ xs: 1, sm: 2 }}>
							<Grid
								size={{ xs: 12, sm: 6 }}
								textAlign={{ xs: 'center', sm: 'right' }}
							>
								<Typography sx={{ fontWeight: 'bold' }}>Payment ID</Typography>
							</Grid>
							<Grid
								size={{ xs: 12, sm: 6 }}
								textAlign={{ xs: 'center', sm: 'left' }}
							>
								<Typography>{intentId}</Typography>
							</Grid>
							<Grid
								size={{ xs: 12, sm: 6 }}
								textAlign={{ xs: 'center', sm: 'right' }}
							>
								<Typography sx={{ fontWeight: 'bold' }}>Status</Typography>
							</Grid>
							<Grid
								size={{ xs: 12, sm: 6 }}
								textAlign={{ xs: 'center', sm: 'left' }}
							>
								<Typography sx={{ textTransform: 'capitalize' }}>
									{status}
								</Typography>
							</Grid>
							<Grid
								size={{ xs: 12, sm: 6 }}
								textAlign={{ xs: 'center', sm: 'right' }}
							>
								<Typography sx={{ fontWeight: 'bold' }}>Total</Typography>
							</Grid>
							<Grid
								size={{ xs: 12, sm: 6 }}
								textAlign={{ xs: 'center', sm: 'left' }}
							>
								<Typography sx={{ textTransform: 'capitalize' }}>
									£{itemsCost}
								</Typography>
							</Grid>
						</Grid>
					</Box>
				)}

				<Divider sx={{ width: '100%', my: 2 }} />

				{/* Booking Information */}
				{booking && (
					<>
						<Box sx={{ width: '100%' }}>
							<Typography variant="h6" gutterBottom>
								Booking Information
							</Typography>
							<Grid container spacing={2}>
								<Grid
									size={{ xs: 12, sm: 6 }}
									textAlign={{ xs: 'center', sm: 'right' }}
								>
									<Typography sx={{ fontWeight: 'bold' }}>
										Booking ID
									</Typography>
								</Grid>
								<Grid
									size={{ xs: 12, sm: 6 }}
									textAlign={{ xs: 'center', sm: 'left' }}
								>
									<Typography>{booking.id}</Typography>
								</Grid>
								<Grid
									size={{ xs: 12, sm: 6 }}
									textAlign={{ xs: 'center', sm: 'right' }}
								>
									<Typography sx={{ fontWeight: 'bold' }}>
										Booking Status
									</Typography>
								</Grid>
								<Grid
									size={{ xs: 12, sm: 6 }}
									textAlign={{ xs: 'center', sm: 'left' }}
								>
									<Typography sx={{ textTransform: 'capitalize' }}>
										{booking.status}
									</Typography>
								</Grid>
							</Grid>
						</Box>
						<Divider sx={{ width: '100%', my: 2 }} />
					</>
				)}

				{/* Booking Details */}
				<Typography variant="h6" gutterBottom>
					Booking Details
				</Typography>
				<Box>
					{items.map((item, index) => (
						<CheckoutItem slot={item} key={index} isCompleted />
					))}

					{intentId && (
						<Button
							variant="outlined"
							color="primary"
							endIcon={<OpenInNew />}
							component={Link}
							href={`https://dashboard.stripe.com/payments/${intentId}`}
							target="_blank"
							rel="noopener noreferrer"
							sx={{ m: '0 auto' }}
						>
							View Payment Details
						</Button>
					)}
				</Box>
			</Box>
		</Container>
	);
}
