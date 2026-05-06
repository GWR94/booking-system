'use client';

import { Alert, Box, Button, Stack, Typography } from '@mui/material';
import { resumePendingBookingPayment } from '@api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useSnackbar } from '@context';

interface PendingPaymentBannerProps {
	bookingId: number;
}

const PendingPaymentBanner = ({ bookingId }: PendingPaymentBannerProps) => {
	const router = useRouter();
	const { showSnackbar } = useSnackbar();
	const [loading, setLoading] = useState(false);

	const handleResume = async () => {
		try {
			setLoading(true);
			const { clientSecret } = await resumePendingBookingPayment(bookingId);
			router.push(
				`/checkout?payment_intent_client_secret=${encodeURIComponent(clientSecret)}`,
			);
		} catch (error) {
			console.error(error);
			showSnackbar('Unable to resume payment for this booking', 'error');
		} finally {
			setLoading(false);
		}
	};

	return (
		<Alert
			severity="warning"
			sx={{ mb: 3, borderRadius: 2 }}
			action={
				<Button
					color="warning"
					variant="contained"
					onClick={handleResume}
					disabled={loading}
				>
					Complete Payment
				</Button>
			}
		>
			<Stack spacing={0.5}>
				<Typography fontWeight={700}>Pending payment</Typography>
				<Box>You have a booking waiting for payment. Complete checkout to confirm it.</Box>
			</Stack>
		</Alert>
	);
};

export default PendingPaymentBanner;

