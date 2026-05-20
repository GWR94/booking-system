import { Membership } from '@features';
import {
	MEMBERSHIP_PAGE_DESCRIPTION,
	buildMembershipPageJsonLd,
} from '@features/membership/membershipStructuredData';
import { StructuredData } from '@layout';
import { getPublicSiteUrl } from '@utils/site-url';
import { Metadata } from 'next';

export const metadata: Metadata = {
	title: 'Membership | The Short Grass',
	description: MEMBERSHIP_PAGE_DESCRIPTION,
};

const MembershipPage = () => {
	const site = getPublicSiteUrl();

	return (
		<>
			<StructuredData data={buildMembershipPageJsonLd(site)} />
			<Membership />
		</>
	);
};

export default MembershipPage;
