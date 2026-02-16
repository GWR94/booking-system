import { Booking } from '@features';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Book a Session | The Short Grass',
	description: 'Book your indoor golf session at The Short Grass.',
};

export default function BookPage() {
	return <Booking />;
}
