import { Booking } from '@features';
import {
	BOOK_PAGE_DESCRIPTION,
	buildBookPageJsonLd,
} from '@features/booking/bookingStructuredData';
import { StructuredData } from '@layout';
import { getPublicSiteUrl } from '@utils/site-url';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Book a Session | The Short Grass',
	description: BOOK_PAGE_DESCRIPTION,
};

const BookPage = () => {
	const site = getPublicSiteUrl();

	return (
		<>
			<StructuredData data={buildBookPageJsonLd(site)} />
			<Booking />
		</>
	);
};

export default BookPage;
