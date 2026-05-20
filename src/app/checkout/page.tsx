import Checkout from '@features/checkout/Checkout';
import {
	CHECKOUT_PAGE_DESCRIPTION,
	buildCheckoutPageJsonLd,
} from '@features/checkout/checkoutStructuredData';
import { StructuredData } from '@layout';
import { getPublicSiteUrl } from '@utils/site-url';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
	title: 'Checkout | The Short Grass',
	description: CHECKOUT_PAGE_DESCRIPTION,
};

const CheckoutPage = async (_props: {
	params: Promise<{ [key: string]: string | string[] | undefined }>;
	searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
	const site = getPublicSiteUrl();

	return (
		<>
			<StructuredData data={buildCheckoutPageJsonLd(site)} />
			<Suspense fallback={<div>Loading checkout...</div>}>
				<Checkout />
			</Suspense>
		</>
	);
};

export default CheckoutPage;
