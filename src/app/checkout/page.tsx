import Checkout from '@features/checkout/Checkout';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Checkout | The Short Grass',
	description: 'Complete your booking securely.',
};

import { Suspense } from 'react';

export default async function CheckoutPage(props: {
	params: Promise<{ [key: string]: string | string[] | undefined }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<div>Loading checkout...</div>}>
			<Checkout />
		</Suspense>
	);
}
