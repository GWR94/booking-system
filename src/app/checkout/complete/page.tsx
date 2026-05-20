import { CompleteBooking } from '@features/checkout/components';
import {
	CHECKOUT_COMPLETE_PAGE_DESCRIPTION,
	buildCheckoutCompletePageJsonLd,
} from '@features/checkout/checkoutStructuredData';
import { StructuredData } from '@layout';
import { getPublicSiteUrl } from '@utils/site-url';
import { Metadata } from 'next';
import { Suspense } from 'react';
import { Box, CircularProgress } from '@mui/material';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Booking Confirmed | The Short Grass',
	description: CHECKOUT_COMPLETE_PAGE_DESCRIPTION,
};

const CheckoutCompletePage = async (_props: {
	params: Promise<{ [key: string]: string | string[] | undefined }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const site = getPublicSiteUrl();

	return (
		<>
			<StructuredData data={buildCheckoutCompletePageJsonLd(site)} />
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
		</>
	);
};

export default CheckoutCompletePage;
