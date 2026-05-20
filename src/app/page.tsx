import Landing from '@features/landing/Landing';
import { buildLandingSportsActivityLocationJsonLd } from '@features/landing/landingStructuredData';
import { StructuredData } from '@layout';
import { getPublicSiteUrl } from '@utils/site-url';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Home | The Short Grass',
	description:
		'The Short Grass is Maidstone’s premier indoor golf venue. Learn about our TrackMan bays, coaching, lounge, team, and flexible memberships — then book your sim time.',
	keywords: [
		'golf simulator',
		'maidstone golf',
		'indoor golf',
		'trackman',
		'golf practice',
	],
};

const Page = () => {
	const site = getPublicSiteUrl();

	return (
		<>
			<StructuredData
				data={buildLandingSportsActivityLocationJsonLd(site)}
			/>
			<Landing />
		</>
	);
};

export default Page;
