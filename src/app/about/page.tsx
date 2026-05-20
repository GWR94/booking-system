import About from '@features/about/About';
import {
	ABOUT_PAGE_DESCRIPTION,
	buildAboutPageJsonLd,
} from '@features/about/aboutStructuredData';
import { StructuredData } from '@layout';
import { getPublicSiteUrl } from '@utils/site-url';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'About | The Short Grass',
	description: ABOUT_PAGE_DESCRIPTION,
};

export default function AboutPage() {
	const site = getPublicSiteUrl();

	return (
		<>
			<StructuredData data={buildAboutPageJsonLd(site)} />
			<About />
		</>
	);
}
