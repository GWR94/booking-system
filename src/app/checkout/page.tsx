import Checkout from '@features/checkout/Checkout';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Checkout | The Short Grass',
	description: 'Complete your booking securely.',
};

import { Suspense } from 'react';

const CheckoutPage = async (props: {
	params: Promise<{ [key: string]: string | string[] | undefined }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => (
	<Suspense fallback={<div>Loading checkout...</div>}>
		<Checkout />
	</Suspense>
);
export default CheckoutPage;
