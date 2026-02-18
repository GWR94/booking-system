import { Metadata } from 'next';
import { NotFound } from '@features';

export const metadata: Metadata = {
	title: '404 Not Found | The Short Grass',
	description: 'The page you are looking for does not exist.',
};

const NotFoundPage = () => <NotFound />;
export default NotFoundPage;
