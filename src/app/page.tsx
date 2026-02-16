import Landing from '@features/landing/Landing';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Home | The Short Grass',
	description:
		'Experience the best indoor golf in Maidstone at The Short Grass. Features TrackMan technology, premium bays, and flexible memberships. Book your sim time today!',
	keywords: [
		'golf simulator',
		'maidstone golf',
		'indoor golf',
		'trackman',
		'golf practice',
	],
};

export default function Page() {
	return <Landing />;
}
