import { About } from '@features';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'About Us | The Short Grass',
	description:
		'Learn about The Short Grass, Maidstone’s premier indoor golf simulator venue.',
};

const AboutPage = () => <About />;
export default AboutPage;
