import { Membership } from '@features';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Membership | The Short Grass',
	description:
		'Explore membership plans and choose the best option for your game.',
};

const MembershipPage = () => <Membership />;

export default MembershipPage;

