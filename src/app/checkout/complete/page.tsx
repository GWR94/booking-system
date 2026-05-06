import { CompleteBooking } from '@features/checkout/components';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export const metadata: Metadata = {
	title: 'Booking Confirmed | The Short Grass',
	description: 'Your booking has been confirmed.',
};

const CheckoutCompletePage = async (props: {
	params: Promise<{ [key: string]: string | string[] | undefined }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => (
	<Suspense
		fallback={
			<Box
				display="flex"
				justifyContent="center"
				alignItems="center"
				sx={{ minHeight: '60vh', p: 4 }}
			>
				<CircularProgress />
			</Box>
		}
	>
		<CompleteBooking />
	</Suspense>
);
export default CheckoutCompletePage;
