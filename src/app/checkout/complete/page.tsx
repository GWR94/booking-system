import { CompleteBooking } from '@features/checkout/components';
export const dynamic = 'force-dynamic';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
	title: 'Booking Confirmed | The Short Grass',
	description: 'Your booking has been confirmed.',
};

export default async function CheckoutCompletePage(props: {
	params: Promise<{ [key: string]: string | string[] | undefined }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
	return (
		<Suspense fallback={<div>Loading confirmation...</div>}>
			<CompleteBooking />
		</Suspense>
	);
}
